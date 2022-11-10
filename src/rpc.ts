import algosdk from "algosdk";
import * as base32 from "hi-base32";

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

  convertToArrayBuffer(arg: string): any {
    const args = [];
    args.push([Buffer.from(arg)]);
    return args;
  }

  encodeUint(arg: number): Uint8Array {
    return algosdk.encodeUint64(arg);
  }

  encodeString(arg: string): Uint8Array {
    return new Uint8Array(Buffer.from(arg, "utf8"));
  }

  base32EncodeArrayBuffer(arg: string): string {
    return base32.encode(Buffer.from(arg, "base64"));
  }

  decodeNote(note: string) {
    return Buffer.from(note, "base64").toString("utf-8");
  }
  //Get transaction ids for the list of notifications
  getTransactionIds(transactionDetails: Array<any>): Array<string> {
    let transactionIds: string[] = [];
    for (let j = 0; j < transactionDetails.length; j++) {
      // converting key into array buffer
      const bufferKey = Buffer.from(transactionDetails[j].key, "base64");
      let finalKey: any;
      // checking for "index" string to keep it as is
      const convertToString = bufferKey.toString("utf-8");
      if (convertToString == "index") {
        finalKey = convertToString;
        continue;
      } else {
        // other key values are converted into number
        finalKey = algosdk.decodeUint64(bufferKey, "mixed");
      }
      // Decoding the value into string and removing "===="
      let value = transactionDetails[j].value.bytes;
      let decodedValue = this.base32EncodeArrayBuffer(value);
      for (let i = decodedValue.length - 1; i >= 0; i--) {
        if (decodedValue[i] == "=") {
          decodedValue = decodedValue.slice(0, -1);
        } else {
          transactionIds.splice(finalKey - 1, 0, decodedValue);
          break;
        }
      }
    }
    return transactionIds;
  }

  //Get channel details for private notifications
  getTransactionDetails(transactionDetails: Array<any>): Array<any> {
    let channelDetails: Array<any> = [];
    for (let j = 0; j < transactionDetails.length; j++) {
      // converting key into array buffer
      const bufferKey = Buffer.from(transactionDetails[j].key, "base64");
      const finalKey = bufferKey.toString("utf-8");
      // Decoding the value into string and removing "===="
      let value = transactionDetails[j].value.bytes;
      let decodedValue = this.base32EncodeArrayBuffer(value);
      for (let i = decodedValue.length - 1; i >= 0; i--) {
        if (decodedValue[i] == "=") {
          decodedValue = decodedValue.slice(0, -1);
        } else {
          channelDetails.push({
            finalKey,
            decodedValue,
          });
          break;
        }
      }
    }
    return channelDetails;
  }
}
