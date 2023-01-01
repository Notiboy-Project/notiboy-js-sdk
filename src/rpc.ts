//Defined basic RPC methods
import algosdk, { Transaction } from "algosdk";
import * as base32 from "hi-base32";
import { PublicNotification } from "./interfaces";
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

  convertToString(arg:Uint8Array):string{
    return  new TextDecoder().decode(arg)
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
  ): Transaction[] {
    let txnsArray = [];
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

  //Read Global State Key for 
  async readGlobalStateKey(appId:number, key:string){
    const appInfo = await this.indexer.lookupApplications(appId).do();
    if(appInfo['params']['global-state']){
      const globalState = appInfo['params']['global-state'];
    }else{
      return[]
    }
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
      if (convertToString == "index" || convertToString == "msgcount" || convertToString == "whoami") {
        finalKey = convertToString;
        continue;
      } else {
        // other key values are converted into number
        finalKey = algosdk.decodeUint64(bufferKey, "mixed");   
        const publicNotification = Buffer.from(transactionDetails[j].value.bytes,"base64").toString();
        console.log(publicNotification)
        let PublicNotification = {
          index:finalKey,
          notification:publicNotification,
        }
        publicNotifications.unshift(PublicNotification)
      }
    }
    return publicNotifications;
  }

  readCounter(transactionDetails: Array<any>): number[] {
      let counter:number[] = [0,0];
    for (let j = 0; j < transactionDetails.length; j++) {
      // converting key into array buffer
      const bufferKey = Buffer.from(transactionDetails[j].key, "base64");
      let finalKey: any;
      const convertToString = bufferKey.toString("utf-8");
      if (convertToString == "msgcount") {
        finalKey = convertToString;
        console.log(finalKey)
        const value = transactionDetails[j].value.bytes;
        console.log(value.length)
        counter = [Number(algosdk.bytesToBigInt(value.slice(0,8))),Number(algosdk.bytesToBigInt(value.slice(9,17)))];
      }
    }
    return counter;
  }

  checkIsZeroValue(byteData:Uint8Array,index:number):boolean{
    let data = this.convertToString(byteData);
    console.log(data, ":")
    const check = data.replace(/^0+/, '').replace(/0+$/, '').trim()
    if(check == ""){
      return true
    }else{
      // console.log(index,":",check,":",check.length,":")
      return false
    } 
  }

  parseMainBoxChunk(chunk:Uint8Array, index:number){
    const chunkItems = [this.convertToString(chunk.slice(0,10)).replace(/^:+/, ''),Number(algosdk.bytesToBigInt(chunk.slice(10,18))),this.convertToString(chunk.slice(18))];
    return{
      channelName: chunkItems[0],
      appIndex: chunkItems[1],
      channelIndex: index, 
      verificationStatus: chunkItems[2]
    }
  }

  parseUserBoxChunk(chunk:Uint8Array){
    const chunkItems = [Number(algosdk.bytesToBigInt(chunk.slice(0,8))),Number(algosdk.bytesToBigInt(chunk.slice(8,16))),
      this.convertToString(chunk.slice(16)).replace(/0+$/, '')];
    return{
      appIndex: chunkItems[0],
      notification: chunkItems[2],
      timeStamp: chunkItems[1],
    }
  }

  //Get channel details from global state
  getTransactionDetails(transactionDetails: Array<any>): Array<any> {
    const channelDetails: Array<any> = [];
    for (let j = 0; j < transactionDetails.length; j++) {
      // converting key into array buffer
      const bufferKey = Buffer.from(transactionDetails[j].key, "base64");
      // checking for "index" string to keep it as is
      const convertToString = bufferKey.toString("utf-8");
      if (convertToString === "index" || convertToString === "msgcount") continue;
      const decodedAppName = Buffer.from(
        transactionDetails[j].value.bytes,
        "base64"
      )
        .slice(32)
        .toString();
      let decodedTxid = this.base32EncodeArrayBuffer(
        transactionDetails[j].value.bytes.slice(0, 43)
      );
      for (let i = decodedTxid.length - 1; i >= 0; i--) {
        if (decodedTxid[i] == "=") {
          decodedTxid = decodedTxid.slice(0, -1);
        } else {
          channelDetails.push({
            decodedTxid,
            decodedAppName,
          });
          break;
        }
      }
    }
    return channelDetails;
  }
}
