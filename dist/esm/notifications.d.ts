import algosdk from "algosdk";
import RPC from "./rpc";
import { PersonalNotification, PublicNotification } from "./interfaces";
export default class Notification extends RPC {
    sendPublicNotification(sender: string, channelAppIndex: number, notification: string): Promise<algosdk.Transaction>;
    sendPersonalNotification(sender: string, receiver: string, channelAppIndex: number, channelName: string, notification: string): Promise<algosdk.Transaction>;
    getPublicNotification(channelAppIndex: number): Promise<PublicNotification[]>;
    getPersonalNotification(sender: string): Promise<PersonalNotification[]>;
}
