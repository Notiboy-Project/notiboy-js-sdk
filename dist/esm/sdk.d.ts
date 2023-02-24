import algosdk from "algosdk";
import RPC from "./rpc";
import Notification from "./notifications";
import { counter, RegularChannel, channeIndex } from "./interfaces";
export default class SDK extends RPC {
    notification(): Notification;
    isValidAddress(address: string): boolean;
    createChannel(sender: string): Promise<algosdk.Transaction>;
    channelContractOptin(sender: string, creatorAppIndex: number, channelName: string): Promise<algosdk.Transaction[]>;
    channelDelete(sender: string, creatorAppIndex: number): Promise<algosdk.Transaction>;
    channelContractOptout(sender: string, creatorAppIndex: number, channelName: string, channelBoxIndex: number): Promise<algosdk.Transaction[]>;
    userContractOptin(sender: string): Promise<algosdk.Transaction[]>;
    userChannelOptin(sender: string, channelAppIndex: number): Promise<algosdk.Transaction>;
    userChannelOptout(sender: string, channelAppIndex: number): Promise<algosdk.Transaction>;
    getChannelList(): Promise<RegularChannel[]>;
    getCounter(sender: string): Promise<counter>;
    getAddressAppIndex(sender: string): Promise<channeIndex>;
    getNotiboyOptinState(address: string): Promise<boolean>;
    getChannelScOptinState(address: string, channelAppIndex: number): Promise<boolean>;
    getOptinAddressList(channelAppIndex: number): Promise<string[]>;
}
