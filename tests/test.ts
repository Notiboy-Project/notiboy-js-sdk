import { Algodv2, Indexer } from "algosdk";
import { describe, it } from "mocha";
import { assert } from "chai";
import SDK from "../src/index.js";

const client = new Algodv2("", "https://testnet-api.algonode.cloud", "");
const indexer = new Indexer("", "https://testnet-idx.algonode.cloud", "");

const sdk = new SDK(client, indexer);

describe("Testing notiboy functions", function () {
  it("Prepares creation of channel", async function () {
    this.timeout(5000);
    const txns = await sdk.createChannel("AD5J43O3N6UPEUFYOZHT6WBUXDOK66MMGL3JHQV77Y2EAEZJVLRCINWYBI");
    assert.isNotNull(txns, "Channel not created");
  });

  it("Prepares optin transactions for channel creator", async function () {
    const txns = await sdk.channelContractOptin(
      "HZ57J3K46JIJXILONBBZOHX6BKPXEM2VVXNRFSUED6DKFD5ZD24PMJ3MVA",
      110,
      "FunnyMeme"
    );
    assert.equal(txns.length, 5, "Not returning 5 transactions");
    assert.isNotNull(txns[0].group, "Not grouping the  transaction");
  });

  it("Prepares optout for channel creator", async function () {
    const txns = await sdk.channelContractOptout(
      "AD5J43O3N6UPEUFYOZHT6WBUXDOK66MMGL3JHQV77Y2EAEZJVLRCINWYBI",
      110,
      "FunnyMeme"
    );
    assert.equal(txns.length, 5, "Not returning two transactions");
    assert.isNotNull(txns[0].group, "Not grouping the two transaction");
  });

  it("Prepares destruction of channel SC", async function () {
    const txns = await sdk. channelDelete(
      "AD5J43O3N6UPEUFYOZHT6WBUXDOK66MMGL3JHQV77Y2EAEZJVLRCINWYBI",
      110,
    );
    assert.isNotNull(txns, "Not destroying channel SC");
  });

  it("Prepares receiving list of public channels", async function () {
    const listPublicChannels = await sdk.listPublicChannels();
    assert.isNotNull(
      listPublicChannels,
      "The app id does not exist or the channel details are not fetched properly."
    );
  });

  it("Prepares send public notifications", async function () {
    const txns = await sdk
      .notification()
      .sendPublicNotification(
        "5OQOYHJ6BYPWFBUTFTN4JA5GJEAJUNA2P65DPNTN5OUGSFFO47NHRZR6HU",
        105200,
        "Testing Notification"
      );
    assert.isNotNull(txns, "Not returning the transaction");
  });

  it("Prepares receiving Public Notifications", async function () {
    this.timeout(5000);
    const notifications = await sdk
      .notification()
      .getPublicNotification(
        "DXQ3Z5OGU4ABXDM6U5POOQK4QQ7RRP4GJ6QPN5USLZ7YTE2HQASE2VQUTM",
        105200
      );
    assert.isArray(
      notifications,
      "The local state is not fetched proporly. Either there is no notifications or notifications not fetched properly."
    );
  });

  // it("Prepares sending personal notifications", async function () {
  //   const txns = await sdk
  //     .notification()
  //     .sendPersonalNotification(
  //       "2K3YHO443GBX2BTEF2B7R7ZXEUCNVE3GWETOTTVCV42SGSJ2TL5HLNG5DM",
  //       "AD5J43O3N6UPEUFYOZHT6WBUXDOK66MMGL3JHQV77Y2EAEZJVLRCINWYBI",
  //       "vcs",
  //       "J754XZKT7PYJUE2HYTP4PXLZ5SNZ2MITOV3HOVBB3GGLFGA7H6QCSVE3U4",
  //       "Testing Notification"
  //     );
  //   assert.equal(txns.length, 2, "Not returning two transactions");
  //   assert.isNotNull(txns[0].group, "Not grouping the two transaction");
  // });

  // it("Prepares receiving personal notification", async function () {
  //   this.timeout(5000);
  //   const notifications = await sdk
  //     .notification()
  //     .getPersonalNotification(
  //       "P7U6A5G7CQXFJPH3S576ZPCFCY5XPUP5RHR577S5NTNN3LR2WURHAK3SUE"
  //     );
  //   assert.isArray(
  //     notifications,
  //     "The local state is not fetched proporly. Either there is no notifications or notifications not fetched properly."
  //   );
  // });

  it("Prepares checks optin state of address", async function () {
    const optinState = await sdk.getoptinState(
      "HL65SEX7ERMP25UJQ4JZ6MNRCDSBILTVFDGZJXL4HYT4VUCXPJ2RQBJLMI"
    );
    assert.isNotNull(optinState, "Optin state not properly fetched.");
  });
  
  //Getting the list of opted in addresses to an app id
  // it("Prepares testing", async function () {
  //   const appId = 144113274;
  //   const accountInfo = await indexer.searchAccounts().applicationID(appId).do();
  //   console.log(accountInfo);
  // });
});
