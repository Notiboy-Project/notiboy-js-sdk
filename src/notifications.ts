//Defined the methods for notifications
import algosdk from "algosdk";
import RPC from "./rpc";

import {
  NOTIBOY_APP_INDEX,
  APP_ARG_PUB,
  APP_ARG_PVT,
  USER_NOOP_TXNS 
} from "./constants";

import { PublicNotification, PersonalNotification } from "./interfaces";

export default class Notification extends RPC {
  // Send Public Notification
  async sendPublicNotification(
    sender: string,
    channelAppIndex:number,
    notification: string
  ): Promise<algosdk.Transaction>{
    const note = this.encodeString(notification);
    const appArgs = [
      this.encodeString(APP_ARG_PUB),
    ];
    const foreignApps = [channelAppIndex]

    const params = await this.client.getTransactionParams().do();
    params.flatFee = true;

    const notificationTransaction = algosdk.makeApplicationNoOpTxnFromObject({
      from:sender,
      suggestedParams:params,
      appIndex:NOTIBOY_APP_INDEX,
      appArgs:appArgs,
      foreignApps:foreignApps,
      note:note
    });

    return notificationTransaction
  }

  // Send Personal Notification
  async sendPersonalNotification(
    sender: string,
    receiver: string,
    channelAppIndex:number,
    channelName: string,
    notification: string,
    globalStateIndex:number
  ): Promise<algosdk.Transaction[]>{
    const note = this.encodeString(notification);

    const boxNameArray = this.convertToIntArray(channelName);
    let boxes = [
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray }
    ];

    const appArgs = [
      this.encodeString(APP_ARG_PVT),
      this.encodeString(channelName),
      algosdk.bigIntToBytes(globalStateIndex,8) //passing the index of the channel details stored in the notiboy box
    ];

    const foreignApps = [channelAppIndex];
    const accounts = [receiver];

    const params = await this.client.getTransactionParams().do();
    params.flatFee = true;

    const notificationTransaction = algosdk.makeApplicationNoOpTxnFromObject({
      from:sender,
      suggestedParams:params,
      appIndex:NOTIBOY_APP_INDEX,
      appArgs:appArgs,
      accounts:accounts,
      foreignApps:foreignApps,
      note:note,
      boxes:boxes
    });

    boxes = [
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray }
    ]; 

    const noopTxns = this.createNoopTransactions(
      USER_NOOP_TXNS,
      sender,
      params,
      NOTIBOY_APP_INDEX,
      boxes,
      []
    );

    //Group Transactions
    const basicTxns = [notificationTransaction];
    const groupTxns = basicTxns.concat(noopTxns);
    algosdk.assignGroupID(groupTxns);
    return groupTxns;
  }

  // Get Public notifications
  async getPublicNotification(
    sender: string,
    channelAppIndex:number
  ): Promise<PublicNotification[]> {
    try {
      const localState = await this.indexer
        .lookupAccountAppLocalStates(sender)
        .applicationID(channelAppIndex)
        .do();
      if (localState["apps-local-states"] == undefined) return [];
      const transactionDetails = localState["apps-local-states"][0]["key-value"];
      const transactionIds = this.getTransactionIds(transactionDetails);
      const notifications = [];
      for (let i = 0; i < transactionIds.length; i++) {
        const txnId = transactionIds[i];
        const txnInfo = await this.indexer.lookupTransactionByID(txnId).do();
        const notification = {
          notification: this.decodeNote(txnInfo.transaction.note),
          timeStamp: txnInfo.transaction["round-time"],
        };
        //Getting the latest notification first(with higher index first)
        notifications.unshift(notification);
      }
      return notifications;
    } catch (error) {
      return [];
    }
  }
}
