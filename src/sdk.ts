//Defined basic methods related to channels
import algosdk from "algosdk";
import {
  NOTIBOY_APP_INDEX,
  DAPP_ESCROW,
  CHANNEL_CREATION_FEE,
  USER_BOX_CREATION_FEE,
  ASA_ASSET,
  LOCAL_INTS,
  GLOBAL_INTS,
  LOCAL_BYTES,
  GLOBAL_BYTES,
  APP_ARG_NULL,
  NOTIBOY_BOX_NAME,
  CHANNEL_NOOP_TXNS,
  USER_NOOP_TXNS,
  MAX_MAIN_BOX_MSG_SIZE,
} from "./constants";
import RPC from "./rpc";
import Notification from "./notifications";
import Channel from "./channel";
import { RegularChannel } from "./interfaces";

export default class SDK extends RPC {
  //Get notifications from a channel
  notification() {
    return new Notification(this.client, this.indexer);
  }
  isValidAddress(address: string): boolean {
    return algosdk.isValidAddress(address);
  }

  //Channel Creation
  async createChannel(sender: string): Promise<algosdk.Transaction> {
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
      from: sender,
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
    sender: string,
    creatorAppIndex: number,
    channelName: string
  ): Promise<algosdk.Transaction[]> {
    const boxNameArray = this.convertToIntArray(NOTIBOY_BOX_NAME);
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

    //channel creation fee
    const paymentTxn =
      algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: sender,
        assetIndex: ASA_ASSET,
        suggestedParams: params,
        to: DAPP_ESCROW,
        amount: CHANNEL_CREATION_FEE,
      });

    //Optin
    const optinTransaction = algosdk.makeApplicationOptInTxnFromObject({
      from: sender,
      suggestedParams: params,
      appIndex: NOTIBOY_APP_INDEX,
      appArgs: appArgs,
      foreignAssets: [ASA_ASSET],
      foreignApps: [creatorAppIndex],
    });

    //Noop Txns
    const noopTxns = this.createNoopTransactions(
      CHANNEL_NOOP_TXNS,
      sender,
      params,
      NOTIBOY_APP_INDEX,
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
    sender: string,
    creatorAppIndex: number
  ): Promise<algosdk.Transaction> {
    //Fetching prameters
    const params = await this.client.getTransactionParams().do();

    //Return the transaction for signing
    return algosdk.makeApplicationDeleteTxnFromObject({
      from: sender,
      appIndex: creatorAppIndex,
      suggestedParams: params,
    });
  }

  //Channel Opt-out from Notiboy contract
  async channelContractOptout(
    sender: string,
    creatorAppIndex: number,
    channelName: string,
    channelBoxIndex: number
  ): Promise<algosdk.Transaction[]> {
    const boxNameArray = this.convertToIntArray(NOTIBOY_BOX_NAME);
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
      algosdk.bigIntToBytes(channelBoxIndex, 8),
    ];

    const params = await this.client.getTransactionParams().do();

    //closeOut
    const closeOutTransaction = algosdk.makeApplicationCloseOutTxnFromObject({
      from: sender,
      appIndex: NOTIBOY_APP_INDEX,
      suggestedParams: params,
      foreignApps: [creatorAppIndex],
      appArgs: appArgs,
    });

    //Noop Txns
    const noopTxns = this.createNoopTransactions(
      CHANNEL_NOOP_TXNS,
      sender,
      params,
      NOTIBOY_APP_INDEX,
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
  async userContractOptin(sender: string): Promise<algosdk.Transaction[]> {
    const boxNameArray = algosdk.decodeAddress(sender).publicKey;
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

    const appArgs = [this.convertToIntArray("user")];

    const params = await this.client.getTransactionParams().do();

    const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: sender,
      suggestedParams: params,
      to: algosdk.getApplicationAddress(NOTIBOY_APP_INDEX),
      amount: USER_BOX_CREATION_FEE,
    });

    //Optin
    const optinTransaction = algosdk.makeApplicationOptInTxnFromObject({
      from: sender,
      suggestedParams: params,
      appIndex: NOTIBOY_APP_INDEX,
      appArgs: appArgs,
      boxes: boxes,
    });

    //Group Transactions
    const groupTxns = [paymentTxn, optinTransaction];
    algosdk.assignGroupID(groupTxns);
    return groupTxns;
  }

  //User opt-in to a channel
  async userChannelOptin(
    sender: string,
    channelAppIndex: number
  ): Promise<algosdk.Transaction> {
    const params = await this.client.getTransactionParams().do();
    const optinTransaction = algosdk.makeApplicationOptInTxnFromObject({
      from: sender,
      suggestedParams: params,
      appIndex: channelAppIndex,
    });
    return optinTransaction;
  }

  //User Opt-out of channel
  async userChannelOptout(
    sender: string,
    channelAppIndex: number
  ): Promise<algosdk.Transaction> {
    const params = await this.client.getTransactionParams().do();
    const optOutTransaction = algosdk.makeApplicationCloseOutTxnFromObject({
      from: sender,
      suggestedParams: params,
      appIndex: channelAppIndex,
    });
    return optOutTransaction;
  }

  //Read channel list
  async getChannelList() {
    try {
      const boxResponse = await this.client
        .getApplicationBoxByName(
          NOTIBOY_APP_INDEX,
          this.convertToIntArray(NOTIBOY_BOX_NAME)
        )
        .do();
      const value = boxResponse.value;
      //Getting each channel details as chunk
      const chunks: Uint8Array[] = [];
      const channels: RegularChannel[] = [];

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

  //Get counter
  async getCounter(sender: string): Promise<number[]> {
    try {
      const localState = await this.indexer
        .lookupAccountAppLocalStates(sender)
        .applicationID(NOTIBOY_APP_INDEX)
        .do();
      if (localState["apps-local-states"] == undefined) return [0, 0];
      const transactionDetails =
        localState["apps-local-states"][0]["key-value"];
      return this.readCounter(transactionDetails);
    } catch (error) {
      return [0, 0];
    }
  }

  async getNotiboyOptinState(address: string): Promise<boolean> {
    const accountInfo = await this.indexer.lookupAccountByID(address).do();
    if (accountInfo["account"]["apps-local-state"] == undefined) return false;
    for (
      let i = 0;
      i < accountInfo["account"]["apps-local-state"].length;
      i++
    ) {
      if (
        accountInfo["account"]["apps-local-state"][i].id === NOTIBOY_APP_INDEX
      ) {
        return true;
      }
    }
    return false;
  }

  async getChannelScOptinState(
    address: string,
    channelAppIndex: number
  ): Promise<boolean> {
    const accountInfo = await this.indexer.lookupAccountByID(address).do();
    if (accountInfo["account"]["apps-local-state"] == undefined) return false;
    for (
      let i = 0;
      i < accountInfo["account"]["apps-local-state"].length;
      i++
    ) {
      if (
        accountInfo["account"]["apps-local-state"][i].id === channelAppIndex
      ) {
        return true;
      }
    }
    return false;
  }

  async getOptinAddressList(channelAppIndex: number): Promise<string[]> {
    let nextToken = "";
    let accountInfo;
    const addressList = [];
    //A do while loop to get full list of asset ids
    do {
      if (nextToken == "") {
        accountInfo = await this.indexer
          .searchAccounts()
          .applicationID(channelAppIndex)
          .do();
        nextToken = accountInfo["next-token"];
        console.log("Next Token: ", nextToken);
        for (let i = 0; i < accountInfo["accounts"].length; i++)
          addressList.push(accountInfo["accounts"][i].address);
      } else {
        accountInfo = await this.indexer
          .searchAccounts()
          .applicationID(channelAppIndex)
          .nextToken(nextToken)
          .do();
        nextToken = accountInfo["next-token"];
        for (let i = 0; i < accountInfo["accounts"].length; i++)
          addressList.push(accountInfo["accounts"][i].address);
      }
    } while (accountInfo["accounts"].length > 0);
    return addressList;
  }
}
