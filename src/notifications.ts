//Defined the methods for notifications
import algosdk from "algosdk";
import RPC from "./rpc";

import {
  NOTIBOY_APP_INDEX,
  APP_ARG_PUB,
  APP_ARG_PVT,
  MAX_USER_BOX_MSG_SIZE,
} from "./constants";

import { PersonalNotification, PublicNotification } from "./interfaces";

export default class Notification extends RPC {
  // Send Public Notification
  async sendPublicNotification(
    sender: string,
    channelAppIndex: number,
    notification: string
  ): Promise<algosdk.Transaction> {
    const note = this.encodeString(notification);
    const appArgs = [this.encodeString(APP_ARG_PUB)];
    const foreignApps = [channelAppIndex];

    const params = await this.client.getTransactionParams().do();

    const notificationTransaction = algosdk.makeApplicationNoOpTxnFromObject({
      from: sender,
      suggestedParams: params,
      appIndex: NOTIBOY_APP_INDEX,
      appArgs: appArgs,
      foreignApps: foreignApps,
      note: note,
    });

    return notificationTransaction;
  }

  // Send Personal Notification
  async sendPersonalNotification(
    sender: string,
    receiver: string,
    channelAppIndex: number,
    channelName: string,
    notification: string
  ): Promise<algosdk.Transaction> {
    const note = this.encodeString(notification);

    const boxNameArray = algosdk.decodeAddress(receiver).publicKey;
    const boxes = [
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
    ];

    const appArgs = [
      this.encodeString(APP_ARG_PVT),
      this.encodeString(channelName),
    ];

    const foreignApps = [channelAppIndex];
    const accounts = [receiver];

    const params = await this.client.getTransactionParams().do();

    const notificationTransaction = algosdk.makeApplicationNoOpTxnFromObject({
      from: sender,
      suggestedParams: params,
      appIndex: NOTIBOY_APP_INDEX,
      appArgs: appArgs,
      accounts: accounts,
      foreignApps: foreignApps,
      note: note,
      boxes: boxes,
    });

    return notificationTransaction;
  }

  //Read Public notifications
  async getPublicNotification(
    channelAppIndex: number
  ): Promise<PublicNotification[]> {
    try {
      const appInfo = await this.indexer
        .lookupApplications(channelAppIndex)
        .do();
      const localState = await this.indexer
        .lookupAccountAppLocalStates(appInfo["application"]["params"].creator)
        .applicationID(NOTIBOY_APP_INDEX)
        .do();
      if (localState["apps-local-states"] == undefined) return [];
      const transactionDetails =
        localState["apps-local-states"][0]["key-value"];
      return this.getLocalState(transactionDetails);
    } catch (error) {
      return [];
    }
  }

  //Read Personal Notifications
  async getPersonalNotification(
    sender: string
  ): Promise<PersonalNotification[]> {
    try {
      const boxName = algosdk.decodeAddress(sender).publicKey;
      const boxResponse = await this.client
        .getApplicationBoxByName(NOTIBOY_APP_INDEX, Buffer.from(boxName))
        .do();
      const value = boxResponse.value;
      const chunks: Uint8Array[] = [];
      const notifications: PersonalNotification[] = [];
      //splitting the box data into chunks
      for (let i = 0; i < value.length; i += MAX_USER_BOX_MSG_SIZE) {
        chunks.push(value.slice(i, i + MAX_USER_BOX_MSG_SIZE));
      }
      // Getting the chunk with notification details(the chunks without notifications will have only zeros)
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
}
