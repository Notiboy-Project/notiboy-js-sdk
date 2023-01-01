import { Algodv2, Indexer } from "algosdk";
import algosdk from "algosdk";
import { describe, it } from "mocha";
import { assert } from "chai";
import SDK from "../src/index.js";

const client = new Algodv2("", "https://testnet-api.algonode.cloud", "");
const indexer = new Indexer("", "https://testnet-idx.algonode.cloud", "");

const sdk = new SDK(client, indexer);
//channel appi id 151309134

const user_mnemonic_string = "illegal prize mouse empty cry smart chicken sponsor crowd board north this smile keen embrace gauge crew laptop zebra tag home boost rescue absent solution";
const user1_mnemonic_string='image such scheme erase ethics else coach ensure fox goose skin share mutual fury elevator dice snap outer purpose forward possible tree reunion above topic';
const user2_mnemonic_string = 'inner coin boil peanut type legend merge convince insane gold wool educate rally best animal awake lemon penalty arrive craft evidence wheel point absent chair';
const useraccount =  algosdk.mnemonicToSecretKey(user1_mnemonic_string)
const enduseraccount =  algosdk.mnemonicToSecretKey(user2_mnemonic_string)
describe("Testing notiboy functions", function () {
  // it("Prepares creation of channel", async function () {
  //   this.timeout(5000);
  //   const txns = await sdk.createChannel("3KOQUDTQAYKMXFL66Q5DS27FJJS6O3E2J3YMOC3WJRWNWJW3J4Q65POKPI");
  //   let signedTxn = txns.signTxn(useraccount.sk)
  //   let txId = txns.txID().toString();
  //   console.log(txId)
  //   await client.sendRawTransaction(signedTxn).do();
  //   assert.isNotNull(txns, "Channel not created");
  // });

  // it("Prepares optout transactions from Notiboy SC for channel creator", async function () {
  //   const txns = await sdk.channelContractOptout(
  //     "3KOQUDTQAYKMXFL66Q5DS27FJJS6O3E2J3YMOC3WJRWNWJW3J4Q65POKPI",
  //     151406743,
  //     "MINT"
  //     38
  //   );
  //   let signedTxn1 = txns[0].signTxn(useraccount.sk)
  //   let signedTxn2 = txns[1].signTxn(useraccount.sk)
  //   let signedTxn3 = txns[2].signTxn(useraccount.sk)
  //   let signedTxn4 = txns[3].signTxn(useraccount.sk)
  //   let signedTxn5 = txns[4].signTxn(useraccount.sk)
  //   let  groupTxns:any = [];
  //   groupTxns.push(signedTxn1);
  //   groupTxns.push(signedTxn2);
  //   groupTxns.push(signedTxn3);
  //   groupTxns.push(signedTxn4);
  //   groupTxns.push(signedTxn5);
  //   let txnList = await client.sendRawTransaction(groupTxns).do();
  //   let txId = txnList.txID;
  //   console.log(txId)
  //   assert.equal(txns.length, 5, "Not returning 5 transactions");
  //   assert.isNotNull(txns[0].group, "Not grouping the  transaction");
  // });

  // it("Prepares optin transactions for channel creator", async function () {
  //   const txns = await sdk.channelContractOptin(
  //     "3KOQUDTQAYKMXFL66Q5DS27FJJS6O3E2J3YMOC3WJRWNWJW3J4Q65POKPI",
  //     151406743,
  //     "MINT"
  //   );
  //   let signedTxn1 = txns[0].signTxn(useraccount.sk)
  //   let signedTxn2 = txns[1].signTxn(useraccount.sk)
  //   let signedTxn3 = txns[2].signTxn(useraccount.sk)
  //   let signedTxn4 = txns[3].signTxn(useraccount.sk)
  //   let signedTxn5 = txns[4].signTxn(useraccount.sk)
  //   let signedTxn6 = txns[5].signTxn(useraccount.sk)
  //   let  groupTxns:any = [];
  //   groupTxns.push(signedTxn1);
  //   groupTxns.push(signedTxn2);
  //   groupTxns.push(signedTxn3);
  //   groupTxns.push(signedTxn4);
  //   groupTxns.push(signedTxn5);
  //   groupTxns.push(signedTxn6);
  //   let txnList = await client.sendRawTransaction(groupTxns).do();
  //   let txId = txnList.txID;
  //   console.log(txId)
  //   assert.equal(txns.length, 6, "Not returning 6 transactions");
  //   assert.isNotNull(txns[0].group, "Not grouping the  transaction");
  // });

  // it("Prepares user opt-in to Notiboy sc", async function () {
  //   const txns = await sdk.userContractOptin(
  //     "SVCYFMQM6QER62RMPSVUHHIZXUIYHBXEZVGUPL6OVBRBNK7LNVGIRYMP3Y",
  //   );
  //   let signedTxn1 = txns[0].signTxn(enduseraccount.sk)
  //   let signedTxn2 = txns[1].signTxn(enduseraccount.sk)
  //   let  groupTxns:any = [];
  //   groupTxns.push(signedTxn1);
  //   groupTxns.push(signedTxn2);
  //   let txnList = await client.sendRawTransaction(groupTxns).do();
  //   let txId = txnList.txID;
  //   console.log(txId)
  //   assert.equal(txns.length, 2, "Not returning 2 transactions");
  //   assert.isNotNull(txns[0].group, "Not grouping the  transaction");
  // });

  // it("Prepares check opt-out for end user to channel SC", async function () {
  //   const txns = await sdk.userChannelOptout(
  //     "SVCYFMQM6QER62RMPSVUHHIZXUIYHBXEZVGUPL6OVBRBNK7LNVGIRYMP3Y",
  //     151406743
  //   );
  //   let signedTxn = txns.signTxn(enduseraccount.sk)
  //   let txId = txns.txID().toString();
  //   console.log(txId)
  //   await client.sendRawTransaction(signedTxn).do();
  //   assert.isNotNull(txns, "transaction not created properly.");
  // });

  // it("Prepares check opt-in for end user to channel SC", async function () {
  //   const txns = await sdk.userChannelOptin(
  //     "SVCYFMQM6QER62RMPSVUHHIZXUIYHBXEZVGUPL6OVBRBNK7LNVGIRYMP3Y",
  //     151406743
  //   );
  //   let signedTxn = txns.signTxn(enduseraccount.sk)
  //   let txId = txns.txID().toString();
  //   console.log(txId)
  //   await client.sendRawTransaction(signedTxn).do();
  //   assert.isNotNull(txns, "transaction not created properly.");
  // });

  // it("Prepares receiving list of public channels", async function () {
  // this.timeout(5000)
  //   const listPublicChannels = await sdk.getChannelList();
  //   console.log(listPublicChannels)
  //   assert.isNotNull(
  //     listPublicChannels,
  //     "The app id does not exist or the channel details are not fetched properly."
  //   );
  // });

  // it("Prepares send public notifications", async function () {
  //   const txns = await sdk
  //     .notification()
  //     .sendPublicNotification(
  //       "3KOQUDTQAYKMXFL66Q5DS27FJJS6O3E2J3YMOC3WJRWNWJW3J4Q65POKPI",
  //       151406743,
  //       "Public Notification number 2 "
  //     );
  //     let signedTxn = txns.signTxn(useraccount.sk)
  //     let txId = txns.txID().toString();
  //     console.log(txId)
  //     await client.sendRawTransaction(signedTxn).do();
  //   assert.isNotNull(txns, "Not returning the transaction");
  // });

  // it("Prepares receiving Public Notifications", async function () {
  //   this.timeout(5000);
  //   const notifications = await sdk
  //     .notification()
  //     .getPublicNotification(
  //       "3KOQUDTQAYKMXFL66Q5DS27FJJS6O3E2J3YMOC3WJRWNWJW3J4Q65POKPI"
  //     );
  //     console.log(notifications)
  //   assert.isArray(
  //     notifications,
  //     "The local state is not fetched proporly. Either there is no notifications or notifications not fetched properly."
  //   );
  // });

  // it("Prepares sending personal notifications", async function () {
  //   const txns = await sdk
  //     .notification()
  //     .sendPersonalNotification(
  //       "3KOQUDTQAYKMXFL66Q5DS27FJJS6O3E2J3YMOC3WJRWNWJW3J4Q65POKPI",
  //       "SVCYFMQM6QER62RMPSVUHHIZXUIYHBXEZVGUPL6OVBRBNK7LNVGIRYMP3Y",
  //       151406743,
  //       "MINT",
  //       "Personal Notification number4 from MINT ",
  //       38,
  //     );
  //     let signedTxn = txns.signTxn(useraccount.sk)
  //      let txId = txns.txID();
  //      console.log(txId)
  //      await client.sendRawTransaction(signedTxn).do();
  //   assert.isNotNull(txns, "Not sending personal notifications");
  // });

  // it("Prepares receiving personal notification", async function () {
  //   this.timeout(5000);
  //   const notifications = await sdk
  //     .notification()
  //     .getPersonalNotification(
  //       "SVCYFMQM6QER62RMPSVUHHIZXUIYHBXEZVGUPL6OVBRBNK7LNVGIRYMP3Y"
  //     );

  //   assert.isArray(
  //     notifications,
  //     "The local state is not fetched proporly. Either there is no notifications or notifications not fetched properly."
  //   );
  // });

  it("Prepares receiving counter", async function () {
    const counter = await sdk.getCounter(
      "SVCYFMQM6QER62RMPSVUHHIZXUIYHBXEZVGUPL6OVBRBNK7LNVGIRYMP3Y"
    );
      console.log(counter)
    assert.isNotEmpty(
      counter,
      "The local state is not fetched proporly. Either there is no notifications or notifications not fetched properly."
    );
  });

  // it("Prepares checks optin state of address", async function () {
  //   const optinState = await sdk.getoptinState(
  //     "HL65SEX7ERMP25UJQ4JZ6MNRCDSBILTVFDGZJXL4HYT4VUCXPJ2RQBJLMI"
  //   );
  //   assert.isNotNull(optinState, "Optin state not properly fetched.");
  // });
  
  //Getting the list of opted in addresses to an app id
  // it("Prepares testing", async function () {
  //   const appId = 144113274;
  //   const accountInfo = await indexer.searchAccounts().applicationID(appId).do();
  //   console.log(accountInfo);
  // });

  

  // it("Prepares destruction of channel SC", async function () {
  //   const txns = await sdk. channelDelete(
  //     "AD5J43O3N6UPEUFYOZHT6WBUXDOK66MMGL3JHQV77Y2EAEZJVLRCINWYBI",
  //     110,
  //   );
  //   assert.isNotNull(txns, "Not destroying channel SC");
  // });
  
});
