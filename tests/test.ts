import { Algodv2, Indexer } from "algosdk";
import { describe, it } from "mocha";
import { assert } from "chai";
import Notiboy from "../src/index.js";

const client = new Algodv2("", "https://testnet-api.algonode.cloud", "");
const indexer = new Indexer("", "https://testnet-idx.algonode.cloud", "");

const notiboy = new Notiboy(client, indexer);

describe("Testing notiboy functions", function () {
  it("Prepares creation of channel", async function () {
    this.timeout(5000);
    const txns = await notiboy.createChannel("3KOQUDTQAYKMXFL66Q5DS27FJJS6O3E2J3YMOC3WJRWNWJW3J4Q65POKPI");
    assert.isNotNull(txns, "Channel not created");
  });

  it("Prepares optout transactions from Notiboy SC for channel creator", async function () {
    const txns = await notiboy.channelContractOptout(
      "3KOQUDTQAYKMXFL66Q5DS27FJJS6O3E2J3YMOC3WJRWNWJW3J4Q65POKPI",
      151406743,
      "MINT",
      5
    );
    assert.equal(txns.length, 5, "Not returning 5 transactions");
    assert.isNotNull(txns[0].group, "Not grouping the  transaction");
  });

  it("Prepares optin transactions for channel creator", async function () {
    const txns = await notiboy.channelContractOptin(
      "3KOQUDTQAYKMXFL66Q5DS27FJJS6O3E2J3YMOC3WJRWNWJW3J4Q65POKPI",
      151406743,
      "MINT"
    );
    assert.equal(txns.length, 6, "Not returning 6 transactions");
    assert.isNotNull(txns[0].group, "Not grouping the  transaction");
  });

  it("Prepares user opt-in to Notiboy sc", async function () {
    const txns = await notiboy.userContractOptin(
      "SVCYFMQM6QER62RMPSVUHHIZXUIYHBXEZVGUPL6OVBRBNK7LNVGIRYMP3Y",
    );

    assert.equal(txns.length, 2, "Not returning 2 transactions");
    assert.isNotNull(txns[0].group, "Not grouping the  transaction");
  });

  it("Prepares check opt-out for end user to channel SC", async function () {
    const txns = await notiboy.userChannelOptout(
      "SVCYFMQM6QER62RMPSVUHHIZXUIYHBXEZVGUPL6OVBRBNK7LNVGIRYMP3Y",
      151406743
    );

    assert.isNotNull(txns, "transaction not created properly.");
  });

  it("Prepares check opt-in for end user to channel SC", async function () {
    const txns = await notiboy.userChannelOptin(
      "SVCYFMQM6QER62RMPSVUHHIZXUIYHBXEZVGUPL6OVBRBNK7LNVGIRYMP3Y",
      151406743
    );

    assert.isNotNull(txns, "transaction not created properly.");
  });

  it("Prepares receiving list of public channels", async function () {
  this.timeout(5000)
    const listPublicChannels = await notiboy.getChannelList();
    assert.isNotNull(
      listPublicChannels,
      "The app id does not exist or the channel details are not fetched properly."
    );
  });

  it("Prepares sending public notifications", async function () {
    const txns = await notiboy
      .notification()
      .sendPublicNotification(
        "3KOQUDTQAYKMXFL66Q5DS27FJJS6O3E2J3YMOC3WJRWNWJW3J4Q65POKPI",
        151406743,
        "Public Notification number 2 "
      );
    assert.isNotNull(txns, "Not returning the transaction");
  });

  it("Prepares receiving Public Notifications", async function () {
    this.timeout(5000);
    const notifications = await notiboy
      .notification()
      .getPublicNotification(
        151406743
      );
    assert.isArray(
      notifications,
      "The local state is not fetched proporly. Either there is no notifications or notifications not fetched properly."
    );
  });

  it("Prepares sending personal notifications", async function () {
    const txns = await notiboy
      .notification()
      .sendPersonalNotification(
        "3KOQUDTQAYKMXFL66Q5DS27FJJS6O3E2J3YMOC3WJRWNWJW3J4Q65POKPI",
        "SVCYFMQM6QER62RMPSVUHHIZXUIYHBXEZVGUPL6OVBRBNK7LNVGIRYMP3Y",
        151406743,
        "MINT",
        "Personal Notification number5 from MINT "
    );
    assert.isNotNull(txns, "Not sending personal notifications");
  });

  it("Prepares receiving personal notification", async function () {
    this.timeout(5000);
    const notifications = await notiboy
      .notification()
      .getPersonalNotification(
        "3KOQUDTQAYKMXFL66Q5DS27FJJS6O3E2J3YMOC3WJRWNWJW3J4Q65POKPI"
      );
    assert.isArray(
      notifications,
      "Box storage. Either there is no notifications or notifications not fetched properly."
    );
  });

  it("Prepares receiving counter", async function () {
    const counter = await notiboy.getCounter(
      "3KOQUDTQAYKMXFL66Q5DS27FJJS6O3E2J3YMOC3WJRWNWJW3J4Q65POKPI"
    );
    assert.isNotEmpty(
      counter,
      "The local state is not fetched proporly. Either there is no counter."
    );
  });

  it("Prepares checks optin state of address with notiboy SC", async function () {
    const optinState = await notiboy.getNotiboyOptinState(
      "HL65SEX7ERMP25UJQ4JZ6MNRCDSBILTVFDGZJXL4HYT4VUCXPJ2RQBJLMI"
    );
    assert.isNotNull(optinState, "Optin state not properly fetched.");
  });

  it("Prepares checks optin state of address with channel SC", async function () {
    const optinState = await notiboy.getChannelScOptinState(
      "HL65SEX7ERMP25UJQ4JZ6MNRCDSBILTVFDGZJXL4HYT4VUCXPJ2RQBJLMI",
      151406743
    );
    assert.isNotNull(optinState, "Optin state not properly fetched.");
  });
  
  it("Get list of addresses opted-in to a SC", async function () {
    const addressList = await notiboy.getOptinAddressList(
      144113274
    )
    assert.isArray(addressList, "List of addresses not properly fetched.");
  });


  it("Get app index of a channel from local state of address", async function () {
    const appIndex = await notiboy.getAddressAppIndex(
      "AAVUPELO5ZCBDA3DD3G7ZDZ64BSEOOE3G7ZBOMR7DKI3YIBXLYEC3EATQA"
    )
    assert.isNumber(appIndex, "AppIndex not fetched properly from local state.");
  });
  
});
