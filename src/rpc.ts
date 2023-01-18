//Defined basic RPC methods
import algosdk from "algosdk";
import * as base32 from "hi-base32";
import { PublicNotification, counter, channeIndex } from "./interfaces";
export default class RPC {
  protected client: algosdk.Algodv2;
  protected indexer: algosdk.Indexer;

  constructor(client: algosdk.Algodv2, indexer: algosdk.Indexer) {
    this.client = client;
    this.indexer = indexer;
  }

  convertToIntArray(arg: string): Uint8Array {
    return new Uint8Array(Buffer.from(arg));
  }

  convertToString(arg: Uint8Array): string {
    return new TextDecoder("utf-8").decode(arg);
  }

  convertToArrayBuffer(arg: string): any {
    const args = [];
    args.push([Buffer.from(arg)]);
    return args;
  }

  encodeUint(arg: number): Uint8Array {
    return algosdk.encodeUint64(arg);
  }

  encodeString(arg: string): Uint8Array {
    return new Uint8Array(Buffer.from(arg, "utf-8"));
  }

  base32EncodeArrayBuffer(arg: string): string {
    return base32.encode(Buffer.from(arg, "base64"));
  }

  decodeNote(note: string) {
    return Buffer.from(note, "base64").toString("utf-8");
  }

  //Create noop transactions
  createNoopTransactions(
    txns: number,
    address: string,
    params: algosdk.SuggestedParams,
    appIndex: number,
    boxes: {
      appIndex: number;
      name: Uint8Array;
    }[],
    foreignApps: Array<number>
  ): algosdk.Transaction[] {
    const txnsArray = [];
    for (let i = 0; i < txns; i++) {
      txnsArray.push(
        algosdk.makeApplicationNoOpTxnFromObject({
          from: address,
          suggestedParams: params,
          appIndex: appIndex,
          note: this.encodeString(`noop ${i}`),
          boxes: boxes,
          foreignApps: foreignApps,
        })
      );
    }
    return txnsArray;
  }

  //Get transaction ids from local state
  getLocalState(transactionDetails: Array<any>): PublicNotification[] {
    const publicNotifications: PublicNotification[] = [];
    for (let j = 0; j < transactionDetails.length; j++) {
      // converting key into array buffer
      const bufferKey = Buffer.from(transactionDetails[j].key, "base64");
      let finalKey: any;
      // checking for "index" string to keep it as is
      const convertToString = bufferKey.toString("utf-8");
      if (
        convertToString == "index" ||
        convertToString == "msgcount" ||
        convertToString == "whoami"
      ) {
        finalKey = convertToString;
        continue;
      } else {
        // other key values are converted into number
        finalKey = Number(algosdk.bytesToBigInt(bufferKey));
        const publicNotification = this.decodeNote(
          transactionDetails[j].value.bytes
        );
        const PublicNotification = {
          index: finalKey,
          notification: publicNotification,
        };
        publicNotifications.push(PublicNotification);
      }
    }
    return publicNotifications;
  }
  //Reading counter from local state
  readCounter(transactionDetails: Array<any>): counter {
    let counter = { personalNotification: 0, publicNotification: 0 };
    for (let j = 0; j < transactionDetails.length; j++) {
      // converting key into array buffer
      const finalKey = this.decodeNote(transactionDetails[j].key);
      if (finalKey == "msgcount") {
        const value = Buffer.from(transactionDetails[j].value.bytes, "base64");
        counter = {
          personalNotification: Number(
            algosdk.bytesToBigInt(value.slice(0, 8))
          ),
          publicNotification: Number(algosdk.bytesToBigInt(value.slice(9, 17))),
        };
      }
    }
    return counter;
  }
  //Reading the app index related to an address(check if the address is creator or not)
  readAppIndex(transactionDetails: Array<any>): channeIndex {
    const appIndex = {
      channelAppIndex: 0,
      channelName: "Null",
    };
    for (let j = 0; j < transactionDetails.length; j++) {
      // converting key into array buffer
      const finalKey = this.decodeNote(transactionDetails[j].key);
      if (finalKey == "whoami") {
        const chunk = Buffer.from(transactionDetails[j].value.bytes, "base64");
        appIndex.channelAppIndex = Number(
          algosdk.bytesToBigInt(chunk.slice(10, 18))
        );
        appIndex.channelName = this.decodeNote(
          transactionDetails[j].value.bytes
        )
          .slice(0, 10)
          .replace(/^:+/, "");
        return appIndex;
      }
    }
    return appIndex;
  }
  //Check if the chunk is zero in main box
  checkIsZeroValue(byteData: Uint8Array): boolean {
    const data = this.convertToString(byteData);
    const check = data.replace(/^0+/, "").replace(/0+$/, "").trim();
    if (check == "") {
      return true;
    } else {
      return false;
    }
  }
  //Parse each chunk in main box
  parseMainBoxChunk(chunk: Uint8Array, index: number) {
    const chunkItems = [
      this.convertToString(chunk.slice(0, 10)).replace(/^:+/, ""),
      Number(algosdk.bytesToBigInt(chunk.slice(10, 18))),
      this.convertToString(chunk.slice(18)),
    ];
    return {
      channelName: chunkItems[0],
      appIndex: chunkItems[1],
      channelIndex: index,
      verificationStatus: chunkItems[2],
    };
  }
  //parse each chunk in user box
  parseUserBoxChunk(chunk: Uint8Array) {
    const chunkItems = [
      Number(algosdk.bytesToBigInt(chunk.slice(0, 8))),
      Number(algosdk.bytesToBigInt(chunk.slice(8, 16))),
      this.convertToString(chunk.slice(16)).replace(/0+$/, ""),
    ];
    return {
      appIndex: chunkItems[1],
      notification: chunkItems[2],
      timeStamp: chunkItems[0],
    };
  }
}
