"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var algosdk_1 = require("algosdk");
var algosdk_2 = require("algosdk");
var mocha_1 = require("mocha");
var chai_1 = require("chai");
var index_js_1 = require("../src/index.js");
var client = new algosdk_1.Algodv2("", "https://testnet-api.algonode.cloud", "");
var indexer = new algosdk_1.Indexer("", "https://testnet-idx.algonode.cloud", "");
var sdk = new index_js_1["default"](client, indexer);
//channel appi id 151309134
var user_mnemonic_string = "illegal prize mouse empty cry smart chicken sponsor crowd board north this smile keen embrace gauge crew laptop zebra tag home boost rescue absent solution";
var user1_mnemonic_string = 'image such scheme erase ethics else coach ensure fox goose skin share mutual fury elevator dice snap outer purpose forward possible tree reunion above topic';
var user2_mnemonic_string = 'inner coin boil peanut type legend merge convince insane gold wool educate rally best animal awake lemon penalty arrive craft evidence wheel point absent chair';
var useraccount = algosdk_2["default"].mnemonicToSecretKey(user1_mnemonic_string);
var enduseraccount = algosdk_2["default"].mnemonicToSecretKey(user2_mnemonic_string);
(0, mocha_1.describe)("Testing notiboy functions", function () {
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
    (0, mocha_1.it)("Prepares receiving counter", function () {
        return __awaiter(this, void 0, void 0, function () {
            var counter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sdk.getCounter("SVCYFMQM6QER62RMPSVUHHIZXUIYHBXEZVGUPL6OVBRBNK7LNVGIRYMP3Y")];
                    case 1:
                        counter = _a.sent();
                        console.log(counter);
                        chai_1.assert.isNotEmpty(counter, "The local state is not fetched proporly. Either there is no notifications or notifications not fetched properly.");
                        return [2 /*return*/];
                }
            });
        });
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
