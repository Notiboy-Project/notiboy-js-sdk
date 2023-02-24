"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/sdk.ts
var import_algosdk3 = __toESM(require("algosdk"), 1);

// src/constants.ts
var CHANNEL_CREATION_FEE = 25e6;
var USER_BOX_CREATION_FEE = 5e6;
var ASA_ASSET = 31566704;
var NOTIBOY_BOX_NAME = "notiboy";
var NOTIBOY_APP_INDEX = 1025363595;
var DAPP_ESCROW = "PLQ37KYHYLLX757ZRACQCELRAWN5JFU6VJZRYVA2LK5NDJXERE5DL3TCU4";
var NOTIBOY_SC_ADDR = "KGNCP3PMGIJUAMD7NO5G3SSTYOO74HGYAS72EE34YTXYLRN3ZVQBYXZA3U";
var APP_ARG_PUB = "pub_notify";
var APP_ARG_PVT = "pvt_notify";
var LOCAL_INTS = 0;
var GLOBAL_INTS = 0;
var LOCAL_BYTES = 16;
var GLOBAL_BYTES = 64;
var APP_ARG_NULL = [];
var CHANNEL_NOOP_TXNS = 4;
var MAX_USER_BOX_MSG_SIZE = 296;
var MAX_MAIN_BOX_MSG_SIZE = 19;

// src/rpc.ts
var import_algosdk = __toESM(require("algosdk"), 1);
var base32 = __toESM(require("hi-base32"), 1);
var RPC = class {
  constructor(client, indexer) {
    this.client = client;
    this.indexer = indexer;
  }
  convertToIntArray(arg) {
    return new Uint8Array(Buffer.from(arg));
  }
  convertToString(arg) {
    return new TextDecoder("utf-8").decode(arg);
  }
  convertToArrayBuffer(arg) {
    const args = [];
    args.push([Buffer.from(arg)]);
    return args;
  }
  encodeUint(arg) {
    return import_algosdk.default.encodeUint64(arg);
  }
  encodeString(arg) {
    return new Uint8Array(Buffer.from(arg, "utf-8"));
  }
  base32EncodeArrayBuffer(arg) {
    return base32.encode(Buffer.from(arg, "base64"));
  }
  decodeNote(note) {
    return Buffer.from(note, "base64").toString("utf-8");
  }
  //Create noop transactions
  createNoopTransactions(txns, address, params, appIndex, boxes, foreignApps) {
    const txnsArray = [];
    for (let i = 0; i < txns; i++) {
      txnsArray.push(
        import_algosdk.default.makeApplicationNoOpTxnFromObject({
          from: address,
          suggestedParams: params,
          appIndex,
          note: this.encodeString(`noop ${i}`),
          boxes,
          foreignApps
        })
      );
    }
    return txnsArray;
  }
  //Get transaction ids from local state
  getLocalState(transactionDetails) {
    const publicNotifications = [];
    for (let j = 0; j < transactionDetails.length; j++) {
      const bufferKey = Buffer.from(transactionDetails[j].key, "base64");
      let finalKey;
      const convertToString = bufferKey.toString("utf-8");
      if (convertToString == "index" || convertToString == "msgcount" || convertToString == "whoami") {
        finalKey = convertToString;
        continue;
      } else {
        finalKey = Number(import_algosdk.default.bytesToBigInt(bufferKey));
        const publicNotification = this.decodeNote(
          transactionDetails[j].value.bytes
        );
        const PublicNotification = {
          index: finalKey,
          notification: publicNotification
        };
        publicNotifications.push(PublicNotification);
      }
    }
    return publicNotifications;
  }
  //Reading counter from local state
  readCounter(transactionDetails) {
    let counter = { personalNotification: 0, publicNotification: 0 };
    for (let j = 0; j < transactionDetails.length; j++) {
      const finalKey = this.decodeNote(transactionDetails[j].key);
      if (finalKey == "msgcount") {
        const value = Buffer.from(transactionDetails[j].value.bytes, "base64");
        counter = {
          personalNotification: Number(
            import_algosdk.default.bytesToBigInt(value.slice(0, 8))
          ),
          publicNotification: Number(import_algosdk.default.bytesToBigInt(value.slice(9, 17)))
        };
      }
    }
    return counter;
  }
  //Reading the app index related to an address(check if the address is creator or not)
  readAppIndex(transactionDetails) {
    const appIndex = {
      channelAppIndex: 0,
      channelName: "Null"
    };
    for (let j = 0; j < transactionDetails.length; j++) {
      const finalKey = this.decodeNote(transactionDetails[j].key);
      if (finalKey == "whoami") {
        const chunk = Buffer.from(transactionDetails[j].value.bytes, "base64");
        appIndex.channelAppIndex = Number(
          import_algosdk.default.bytesToBigInt(chunk.slice(10, 18))
        );
        appIndex.channelName = this.decodeNote(
          transactionDetails[j].value.bytes
        ).slice(0, 10).replace(/^:+/, "");
        return appIndex;
      }
    }
    return appIndex;
  }
  //Check if the chunk is zero in main box
  checkIsZeroValue(byteData) {
    const data = this.convertToString(byteData);
    const check = data.replace(/^0+/, "").replace(/0+$/, "").trim();
    if (check == "") {
      return true;
    } else {
      return false;
    }
  }
  //Parse each chunk in main box
  parseMainBoxChunk(chunk, index) {
    const chunkItems = [
      this.convertToString(chunk.slice(0, 10)).replace(/^:+/, ""),
      Number(import_algosdk.default.bytesToBigInt(chunk.slice(10, 18))),
      this.convertToString(chunk.slice(18))
    ];
    return {
      channelName: chunkItems[0],
      appIndex: chunkItems[1],
      channelIndex: index,
      verificationStatus: chunkItems[2]
    };
  }
  //parse each chunk in user box
  parseUserBoxChunk(chunk) {
    const chunkItems = [
      Number(import_algosdk.default.bytesToBigInt(chunk.slice(0, 8))),
      Number(import_algosdk.default.bytesToBigInt(chunk.slice(8, 16))),
      this.convertToString(chunk.slice(16)).replace(/0+$/, "")
    ];
    return {
      appIndex: chunkItems[1],
      notification: chunkItems[2],
      timeStamp: chunkItems[0]
    };
  }
};

// src/notifications.ts
var import_algosdk2 = __toESM(require("algosdk"), 1);
var Notification = class extends RPC {
  // Send Public Notification
  async sendPublicNotification(sender, channelAppIndex, notification) {
    const note = this.encodeString(notification);
    if (note.length > 180)
      throw Error;
    const appArgs = [this.encodeString(APP_ARG_PUB)];
    const foreignApps = [channelAppIndex];
    const params = await this.client.getTransactionParams().do();
    const notificationTransaction = import_algosdk2.default.makeApplicationNoOpTxnFromObject({
      from: sender,
      suggestedParams: params,
      appIndex: NOTIBOY_APP_INDEX,
      appArgs,
      foreignApps,
      note
    });
    return notificationTransaction;
  }
  // Send Personal Notification
  async sendPersonalNotification(sender, receiver, channelAppIndex, channelName, notification) {
    const note = this.encodeString(notification);
    if (note.length > 280)
      throw Error;
    const boxNameArray = import_algosdk2.default.decodeAddress(receiver).publicKey;
    const boxes = [
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray }
    ];
    const appArgs = [
      this.encodeString(APP_ARG_PVT),
      this.encodeString(channelName)
    ];
    const foreignApps = [channelAppIndex];
    const accounts = [receiver];
    const params = await this.client.getTransactionParams().do();
    const notificationTransaction = import_algosdk2.default.makeApplicationNoOpTxnFromObject({
      from: sender,
      suggestedParams: params,
      appIndex: NOTIBOY_APP_INDEX,
      appArgs,
      accounts,
      foreignApps,
      note,
      boxes
    });
    return notificationTransaction;
  }
  //Read Public notifications
  async getPublicNotification(channelAppIndex) {
    try {
      const appInfo = await this.indexer.lookupApplications(channelAppIndex).do();
      const localState = await this.indexer.lookupAccountAppLocalStates(appInfo["application"]["params"].creator).applicationID(NOTIBOY_APP_INDEX).do();
      if (localState["apps-local-states"] == void 0)
        return [];
      const transactionDetails = localState["apps-local-states"][0]["key-value"];
      return this.getLocalState(transactionDetails);
    } catch (error) {
      return [];
    }
  }
  //Read Personal Notifications
  async getPersonalNotification(sender) {
    try {
      const boxName = import_algosdk2.default.decodeAddress(sender).publicKey;
      const boxResponse = await this.client.getApplicationBoxByName(NOTIBOY_APP_INDEX, Buffer.from(boxName)).do();
      const value = boxResponse.value;
      const chunks = [];
      const notifications = [];
      for (let i = 0; i < value.length; i += MAX_USER_BOX_MSG_SIZE) {
        chunks.push(value.slice(i, i + MAX_USER_BOX_MSG_SIZE));
      }
      for (let i = 0; i < chunks.length; i++) {
        for (let j = 0; j < 8; j++) {
          if (chunks[i][j] != 0) {
            const notification = this.parseUserBoxChunk(chunks[i]);
            notifications.push(notification);
            break;
          }
        }
      }
      return notifications;
    } catch (error) {
      return [];
    }
  }
};

// src/channel.ts
function Channel() {
  return `#pragma version 7 
    int 1`;
}

// src/sdk.ts
var SDK = class extends RPC {
  //Get notifications from a channel
  notification() {
    return new Notification(this.client, this.indexer);
  }
  isValidAddress(address) {
    return import_algosdk3.default.isValidAddress(address);
  }
  //Channel Creation
  async createChannel(sender) {
    const tealProgram = Channel();
    const programBytes = this.convertToIntArray(tealProgram);
    const compiledTeal = await this.client.compile(programBytes).do();
    const compiledBytes = new Uint8Array(
      Buffer.from(compiledTeal.result, "base64")
    );
    const onComplete = import_algosdk3.default.OnApplicationComplete.NoOpOC;
    const params = await this.client.getTransactionParams().do();
    return import_algosdk3.default.makeApplicationCreateTxnFromObject({
      onComplete,
      from: sender,
      suggestedParams: params,
      approvalProgram: compiledBytes,
      clearProgram: compiledBytes,
      numLocalInts: LOCAL_INTS,
      numLocalByteSlices: LOCAL_BYTES,
      numGlobalInts: GLOBAL_INTS,
      numGlobalByteSlices: GLOBAL_BYTES,
      appArgs: APP_ARG_NULL
    });
  }
  //Opt-in to Notiboy smart contract by creator address & and payment of one-time fee
  async channelContractOptin(sender, creatorAppIndex, channelName) {
    const boxNameArray = this.convertToIntArray(NOTIBOY_BOX_NAME);
    const boxes = [
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray }
    ];
    if (this.encodeString(channelName).length > 10)
      throw Error;
    const appArgs = [
      this.convertToIntArray("dapp"),
      this.encodeString(channelName)
    ];
    const params = await this.client.getTransactionParams().do();
    const paymentTxn = import_algosdk3.default.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender,
      assetIndex: ASA_ASSET,
      suggestedParams: params,
      to: DAPP_ESCROW,
      amount: CHANNEL_CREATION_FEE
    });
    const optinTransaction = import_algosdk3.default.makeApplicationOptInTxnFromObject({
      from: sender,
      suggestedParams: params,
      appIndex: NOTIBOY_APP_INDEX,
      appArgs,
      foreignAssets: [ASA_ASSET],
      foreignApps: [creatorAppIndex]
    });
    const noopTxns = this.createNoopTransactions(
      CHANNEL_NOOP_TXNS,
      sender,
      params,
      NOTIBOY_APP_INDEX,
      boxes,
      []
    );
    const basicTxns = [paymentTxn, optinTransaction];
    const groupTxns = basicTxns.concat(noopTxns);
    import_algosdk3.default.assignGroupID(groupTxns);
    return groupTxns;
  }
  //Channel Deletion (first we have to close-out and then delete the SC)
  async channelDelete(sender, creatorAppIndex) {
    const params = await this.client.getTransactionParams().do();
    return import_algosdk3.default.makeApplicationDeleteTxnFromObject({
      from: sender,
      appIndex: creatorAppIndex,
      suggestedParams: params
    });
  }
  //Channel Opt-out from Notiboy contract
  async channelContractOptout(sender, creatorAppIndex, channelName, channelBoxIndex) {
    const boxNameArray = this.convertToIntArray(NOTIBOY_BOX_NAME);
    const boxes = [
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray }
    ];
    const appArgs = [
      this.convertToIntArray("dapp"),
      this.encodeString(channelName),
      import_algosdk3.default.bigIntToBytes(channelBoxIndex, 8)
    ];
    const params = await this.client.getTransactionParams().do();
    const closeOutTransaction = import_algosdk3.default.makeApplicationCloseOutTxnFromObject({
      from: sender,
      appIndex: NOTIBOY_APP_INDEX,
      suggestedParams: params,
      foreignApps: [creatorAppIndex],
      appArgs
    });
    const noopTxns = this.createNoopTransactions(
      CHANNEL_NOOP_TXNS,
      sender,
      params,
      NOTIBOY_APP_INDEX,
      boxes,
      []
    );
    const basicTxns = [closeOutTransaction];
    const groupTxns = basicTxns.concat(noopTxns);
    import_algosdk3.default.assignGroupID(groupTxns);
    return groupTxns;
  }
  //User opt-in to Notiboy SC
  async userContractOptin(sender) {
    const boxNameArray = import_algosdk3.default.decodeAddress(sender).publicKey;
    const boxes = [
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray }
    ];
    const appArgs = [this.convertToIntArray("user")];
    const params = await this.client.getTransactionParams().do();
    const paymentTxn = import_algosdk3.default.makePaymentTxnWithSuggestedParamsFromObject({
      from: sender,
      suggestedParams: params,
      to: NOTIBOY_SC_ADDR,
      amount: USER_BOX_CREATION_FEE
    });
    const optinTransaction = import_algosdk3.default.makeApplicationOptInTxnFromObject({
      from: sender,
      suggestedParams: params,
      appIndex: NOTIBOY_APP_INDEX,
      appArgs,
      boxes
    });
    const groupTxns = [paymentTxn, optinTransaction];
    import_algosdk3.default.assignGroupID(groupTxns);
    return groupTxns;
  }
  //User opt-in to a channel
  async userChannelOptin(sender, channelAppIndex) {
    const params = await this.client.getTransactionParams().do();
    const optinTransaction = import_algosdk3.default.makeApplicationOptInTxnFromObject({
      from: sender,
      suggestedParams: params,
      appIndex: channelAppIndex
    });
    return optinTransaction;
  }
  //User Opt-out of channel
  async userChannelOptout(sender, channelAppIndex) {
    const params = await this.client.getTransactionParams().do();
    const optOutTransaction = import_algosdk3.default.makeApplicationCloseOutTxnFromObject({
      from: sender,
      suggestedParams: params,
      appIndex: channelAppIndex
    });
    return optOutTransaction;
  }
  //Read channel list
  async getChannelList() {
    try {
      const boxResponse = await this.client.getApplicationBoxByName(
        NOTIBOY_APP_INDEX,
        this.convertToIntArray(NOTIBOY_BOX_NAME)
      ).do();
      const value = boxResponse.value;
      const chunks = [];
      const channels = [];
      for (let i = 0; i < value.length; i += MAX_MAIN_BOX_MSG_SIZE) {
        chunks.push(value.slice(i, i + MAX_MAIN_BOX_MSG_SIZE));
      }
      for (let i = 0; i < chunks.length; i++) {
        if (this.checkIsZeroValue(chunks[i])) {
          continue;
        } else {
          const channel = this.parseMainBoxChunk(chunks[i], i);
          channels.push(channel);
        }
      }
      return channels;
    } catch (error) {
      return [];
    }
  }
  //Get counter for personal and public notification
  async getCounter(sender) {
    try {
      const localState = await this.indexer.lookupAccountAppLocalStates(sender).applicationID(NOTIBOY_APP_INDEX).do();
      if (localState["apps-local-states"] == void 0)
        return { personalNotification: 0, publicNotification: 0 };
      const transactionDetails = localState["apps-local-states"][0]["key-value"];
      return this.readCounter(transactionDetails);
    } catch (error) {
      return { personalNotification: 0, publicNotification: 0 };
    }
  }
  //Get channel smart contract appIndex related to an address from address local state
  async getAddressAppIndex(sender) {
    try {
      const localState = await this.indexer.lookupAccountAppLocalStates(sender).applicationID(NOTIBOY_APP_INDEX).do();
      if (localState["apps-local-states"] == void 0)
        return {
          channelAppIndex: 0,
          channelName: "Null"
        };
      const transactionDetails = localState["apps-local-states"][0]["key-value"];
      return this.readAppIndex(transactionDetails);
    } catch (error) {
      return {
        channelAppIndex: 0,
        channelName: "Null"
      };
    }
  }
  //Get opt-in state of an address to notiboy SC
  async getNotiboyOptinState(address) {
    try {
      const accountInfo = await this.indexer.lookupAccountByID(address).do();
      if (accountInfo["account"]["apps-local-state"] == void 0)
        return false;
      for (let i = 0; i < accountInfo["account"]["apps-local-state"].length; i++) {
        if (accountInfo["account"]["apps-local-state"][i].id === NOTIBOY_APP_INDEX) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  //Get opt-in state of an address to channel SC
  async getChannelScOptinState(address, channelAppIndex) {
    try {
      const accountInfo = await this.indexer.lookupAccountByID(address).do();
      if (accountInfo["account"]["apps-local-state"] == void 0)
        return false;
      for (let i = 0; i < accountInfo["account"]["apps-local-state"].length; i++) {
        if (accountInfo["account"]["apps-local-state"][i].id === channelAppIndex) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  //Get opt-in address list
  async getOptinAddressList(channelAppIndex) {
    try {
      let nextToken = "";
      let accountInfo;
      const addressList = [];
      do {
        if (nextToken == "") {
          accountInfo = await this.indexer.searchAccounts().applicationID(channelAppIndex).do();
          nextToken = accountInfo["next-token"];
          for (let i = 0; i < accountInfo["accounts"].length; i++)
            addressList.push(accountInfo["accounts"][i].address);
        } else {
          accountInfo = await this.indexer.searchAccounts().applicationID(channelAppIndex).nextToken(nextToken).do();
          nextToken = accountInfo["next-token"];
          for (let i = 0; i < accountInfo["accounts"].length; i++)
            addressList.push(accountInfo["accounts"][i].address);
        }
      } while (accountInfo["accounts"].length > 0);
      return addressList;
    } catch (error) {
      return ["0"];
    }
  }
};

// src/index.ts
var src_default = SDK;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=index.cjs.map