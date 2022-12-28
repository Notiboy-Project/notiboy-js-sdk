//Defined basic methods related to channels
import algosdk from "algosdk";
import {
  // APP_ARG_FOR_DAPP,
  APP_INDEX,
  DAPP_ESCROW,
  CREATION_FEE,
  LOCAL_INTS,
  GLOBAL_INTS,
  LOCAL_BYTES,
  GLOBAL_BYTES,
  APP_ARG_NULL,
  MAIN_BOX,
  CHANNEL_NOOP_TXNS,
  USER_NOOP_TXNS
} from "./constants";
import RPC from "./rpc";
import Notification from "./notifications";
import Channel from "./channel";

export default class SDK extends RPC {
  isValidAddress(address: string): boolean {
    return algosdk.isValidAddress(address);
  }

  //Channel Creation
  async createChannel(address: string): Promise<algosdk.Transaction> {
    //Reading teal code
    const tealProgram = Channel();
    const programBytes = this.convertToIntArray(tealProgram);
    const compiledTeal = await this.client.compile(programBytes).do();
    const compiledBytes = new Uint8Array(
      Buffer.from(compiledTeal.result, "base64")
    );

    //Fetching prameters
    const onComplete = algosdk.OnApplicationComplete.NoOpOC;
    const params = await this.client.getTransactionParams().do();

    //Return the transaction for signing
    return algosdk.makeApplicationCreateTxnFromObject({
      onComplete: onComplete,
      from: address,
      suggestedParams: params,
      approvalProgram: compiledBytes,
      clearProgram: compiledBytes,
      numLocalInts: LOCAL_INTS,
      numLocalByteSlices: LOCAL_BYTES,
      numGlobalInts: GLOBAL_INTS,
      numGlobalByteSlices: GLOBAL_BYTES,
      appArgs: APP_ARG_NULL,
    });
  }

  //Opt-in to Notiboy smart contract by creator address & and payment of one-time fee
  async channelContractOptin(
    address: string,
    creatorAppIndex: number,
    channelName: string
  ): Promise<algosdk.Transaction[]> {
    const boxNameArray = this.convertToIntArray(MAIN_BOX);
    const boxes = [
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
    ];

    const appArgs = [
      this.convertToIntArray("dapp"),
      this.convertToIntArray(channelName),
    ];

    const params = await this.client.getTransactionParams().do();
    params.fee = 1000;
    params.flatFee = true;

    //channel creation fee
    const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: address,
      suggestedParams: params,
      to: DAPP_ESCROW,
      amount: CREATION_FEE,
    });

    //Optin
    const optinTransaction = algosdk.makeApplicationOptInTxnFromObject({
      from: address,
      suggestedParams: params,
      appIndex: APP_INDEX,
      appArgs: appArgs,
      foreignApps: [creatorAppIndex],
      boxes: boxes,
    });

    //Noop Txns
    const noopTxns = this.createNoopTransactions(
      CHANNEL_NOOP_TXNS,
      address,
      params,
      APP_INDEX,
      boxes,
      []
    );
    //Group Transactions
    const basicTxns = [paymentTxn, optinTransaction];
    const groupTxns = basicTxns.concat(noopTxns);
    algosdk.assignGroupID(groupTxns);
    return groupTxns;
  }

  //Channel Deletion (first we have to close-out and then delete the SC)
  async channelDelete(
    address: string,
    creatorAppIndex: number
  ): Promise<algosdk.Transaction> {
    //Fetching prameters
    const params = await this.client.getTransactionParams().do();

    //Return the transaction for signing
    return algosdk.makeApplicationDeleteTxnFromObject({
      from: address,
      appIndex: creatorAppIndex,
      suggestedParams: params,
    });
  }

  //Channel Opt-out from Notiboy contract
  async channelContractOptout(
    address: string,
    creatorAppIndex: number,
    channelName: string
  ): Promise<algosdk.Transaction[]> {
    const boxNameArray = this.convertToIntArray(MAIN_BOX);
    const boxes = [
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
    ];

    const appArgs = [
      this.convertToIntArray("dapp"),
      this.convertToIntArray(channelName),
    ];

    const params = await this.client.getTransactionParams().do();
    params.fee = 1000;
    params.flatFee = true;

    //closeOut
    const closeOutTransaction = algosdk.makeApplicationCloseOutTxnFromObject({
      from: address,
      appIndex: creatorAppIndex,
      suggestedParams: params,
      foreignApps: [creatorAppIndex],
      appArgs: appArgs,
      boxes: boxes,
    });

    //Noop Txns
    const noopTxns = this.createNoopTransactions(
      CHANNEL_NOOP_TXNS,
      address,
      params,
      APP_INDEX,
      boxes,
      []
    );
    //Group Transactions
    const basicTxns = [closeOutTransaction];
    const groupTxns = basicTxns.concat(noopTxns);
    algosdk.assignGroupID(groupTxns);
    return groupTxns;
  }

  //User opt-in to Notiboy SC
  async userContractOptin(
    address: string
  ): Promise<algosdk.Transaction[]> {
    const boxNameArray = this.convertToIntArray(MAIN_BOX);
    const boxes = [
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
      { appIndex: 0, name: boxNameArray },
    ];

    const appArgs = [
      this.convertToIntArray("user")
    ];

    const params = await this.client.getTransactionParams().do();
    params.fee = 1000;
    params.flatFee = true;

    //Optin
    const optinTransaction = algosdk.makeApplicationOptInTxnFromObject({
      from: address,
      suggestedParams: params,
      appIndex: APP_INDEX,
      appArgs: appArgs,
      foreignApps: [],
      boxes: boxes,
    });

    //Noop Txns
    const noopTxns = this.createNoopTransactions(
      USER_NOOP_TXNS,
      address,
      params,
      APP_INDEX,
      boxes,
      []
    );
    //Group Transactions
    const basicTxns = [optinTransaction];
    const groupTxns = basicTxns.concat(noopTxns);
    algosdk.assignGroupID(groupTxns);
    return groupTxns;
  }

  //User opt-in to a channel
  async userChannelOptin(
    address: string,
    channelAppIndex: number,
  ): Promise<algosdk.Transaction>{
    const params = await this.client.getTransactionParams().do();
    params.fee = 1000;
    params.flatFee = true;
    const optinTransaction = algosdk.makeApplicationOptInTxnFromObject({
      from: address,
      suggestedParams: params,
      appIndex: channelAppIndex,
    });
    return optinTransaction;
  }

  //User Opt-out of channel
  async userChannelOptout(
    address: string,
    channelAppIndex: number,
  ): Promise<algosdk.Transaction>{
    const params = await this.client.getTransactionParams().do();
    params.fee = 1000;
    params.flatFee = true;
    const optOutTransaction = algosdk.makeApplicationCloseOutTxnFromObject({
      from: address,
      suggestedParams: params,
      appIndex: channelAppIndex,
    });
    return optOutTransaction;
  }

  // Get list of public channels
  async listPublicChannels(): Promise<any[]> {
    const appInfo = await this.indexer.lookupApplications(APP_INDEX).do();
    const channelDetails = [];
    for (
      let i = 0;
      i < appInfo.application.params["global-state"].length;
      i++
    ) {
      const key = Buffer.from(
        appInfo.application.params["global-state"][i].key,
        "base64"
      ).toString("utf-8");
      if (key === "Creator") continue;
      const addressList = Buffer.from(
        appInfo.application.params["global-state"][i].value.bytes,
        "base64"
      );
      if (
        addressList.length === 67 &&
        addressList.slice(66).toString("utf-8") == "v"
      ) {
        channelDetails.push({
          channelName: key,
          dappAddress: algosdk.encodeAddress(addressList.slice(0, 32)),
          lsigAddress: algosdk.encodeAddress(addressList.slice(33, 65)),
          status: "verified",
        });
      } else if (addressList.length === 65) {
        channelDetails.push({
          channelName: key,
          dappAddress: algosdk.encodeAddress(addressList.slice(0, 32)),
          lsigAddress: algosdk.encodeAddress(addressList.slice(33, 65)),
          status: "regular",
        });
      }
    }
    return channelDetails;
  }

  //Get notifications from a channel
  notification() {
    return new Notification(this.client, this.indexer);
  }

  async getoptinState(address: string): Promise<boolean> {
    const accountInfo = await this.indexer.lookupAccountByID(address).do();
    if (accountInfo["account"]["apps-local-state"] == undefined) return false;
    for (
      let i = 0;
      i < accountInfo["account"]["apps-local-state"].length;
      i++
    ) {
      if (accountInfo["account"]["apps-local-state"][i].id === APP_INDEX) {
        return true;
      }
    }
    return false;
  }
}
