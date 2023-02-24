import algosdk from "algosdk";
import { PublicNotification, counter, channeIndex } from "./interfaces";
export default class RPC {
    protected client: algosdk.Algodv2;
    protected indexer: algosdk.Indexer;
    constructor(client: algosdk.Algodv2, indexer: algosdk.Indexer);
    convertToIntArray(arg: string): Uint8Array;
    convertToString(arg: Uint8Array): string;
    convertToArrayBuffer(arg: string): any;
    encodeUint(arg: number): Uint8Array;
    encodeString(arg: string): Uint8Array;
    base32EncodeArrayBuffer(arg: string): string;
    decodeNote(note: string): string;
    createNoopTransactions(txns: number, address: string, params: algosdk.SuggestedParams, appIndex: number, boxes: {
        appIndex: number;
        name: Uint8Array;
    }[], foreignApps: Array<number>): algosdk.Transaction[];
    getLocalState(transactionDetails: Array<any>): PublicNotification[];
    readCounter(transactionDetails: Array<any>): counter;
    readAppIndex(transactionDetails: Array<any>): channeIndex;
    checkIsZeroValue(byteData: Uint8Array): boolean;
    parseMainBoxChunk(chunk: Uint8Array, index: number): {
        channelName: string | number;
        appIndex: string | number;
        channelIndex: number;
        verificationStatus: string | number;
    };
    parseUserBoxChunk(chunk: Uint8Array): {
        appIndex: string | number;
        notification: string | number;
        timeStamp: string | number;
    };
}
