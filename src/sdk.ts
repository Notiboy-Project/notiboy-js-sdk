import algosdk from "algosdk";
import {
  // APP_ARG_FOR_DAPP,
  APP_INDEX,
  DAPP_ESCROW,
  OPTIN_FEE,
} from "./constants";
import RPC from "./rpc";
import Notification from "./notifications";
import LsigTeal from "./lsig";

export default class SDK extends RPC {
  isValidAddress(address: string): boolean {
    return algosdk.isValidAddress(address);
  }

  //Creating a logic sig for channel
  async createLogicSig(channelName: string): Promise<algosdk.LogicSigAccount> {
    const teal = LsigTeal(channelName);
    const results = await this.client.compile(teal).do();
    const program = new Uint8Array(Buffer.from(results.result, "base64"));
    return new algosdk.LogicSigAccount(program);
  }

  // Funding logicsig with minimum balance of 1 algo
  async provideBasicLsigBalance(
    address: string,
    lsig: string
  ): Promise<algosdk.Transaction> {
    const params = await this.client.getTransactionParams().do();
    return algosdk.makePaymentTxnWithSuggestedParams(
      address,
      lsig,
      OPTIN_FEE,
      undefined,
      undefined,
      params,
      undefined
    );
  }

  // Optin to SC for channel creation
  async optin(
    // name can be either dApp name or user
    //optin address is the logic sig address
    //address is the creator address
    channelName: string,
    optinAddress: string,
    address: string,
    appArg: string
  ): Promise<algosdk.Transaction[]> {
    //TODO: dapp name validations if necessary
    if (!this.isValidAddress(address)) {
      throw new Error("Invalid address");
    }
    let appArgs = [];
    let boxes: any;
    if (channelName == "") {
      appArgs = [this.convertToIntArray(appArg)];
      boxes = [
        // use public key as box name
        [0, algosdk.decodeAddress(address)],
        [0, ""],
        [0, ""],
        [0, ""],
        [0, ""],
        [0, ""],
        [0, ""],
        [0, ""],
      ];
    } else {
      appArgs = [
        this.convertToIntArray(appArg),
        this.convertToIntArray(channelName),
      ];
      boxes = [
        [0, channelName],
        [0, ""],
        [0, ""],
        [0, ""],
        [0, ""],
        [0, ""],
        [0, ""],
        [0, ""],
      ];
    }
    const params = await this.client.getTransactionParams().do();
    params.fee = 5000;
    params.flatFee = true;
    const txn2 = algosdk.makeApplicationNoOpTxnFromObject({
      from: optinAddress,
      suggestedParams: params,
      appIndex: APP_INDEX,
      appArgs: appArgs,
      boxes: boxes,
    });
    const txn3 = algosdk.makeApplicationNoOpTxnFromObject({
      from: optinAddress,
      suggestedParams: params,
      appIndex: APP_INDEX,
      note: this.encodeString("Notiboy optout txn3"),
      boxes: boxes,
    });
    txn3.fee = 0;
    const txn4 = algosdk.makeApplicationNoOpTxnFromObject({
      from: optinAddress,
      suggestedParams: params,
      appIndex: APP_INDEX,
      note: this.encodeString("Notiboy optout txn4"),
      boxes: boxes,
    });
    txn4.fee = 0;
    const txn5 = algosdk.makeApplicationNoOpTxnFromObject({
      from: optinAddress,
      suggestedParams: params,
      appIndex: APP_INDEX,
      note: this.encodeString("Notiboy optout txn5"),
      boxes: boxes,
    });
    txn5.fee = 0;
    const txn1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      amount: 1000000,
      from: address,
      suggestedParams: params,
      to: DAPP_ESCROW,
    });
    const groupTxns = [txn1, txn2, txn3, txn4, txn5];
    algosdk.assignGroupID(groupTxns);
    return groupTxns;
  }
  //Opt-out from channels
  async optOut(
    address: string,
    channelName: string,
    appArg: string
  ): Promise<algosdk.Transaction[]> {
    if (!this.isValidAddress(address)) {
      throw new Error("Invalid address");
    }
    let appArgs = [];
    let boxes: any;
    if (channelName == "") {
      appArgs = [this.convertToIntArray(appArg)];
      boxes = [
        // use public key as box name
        [0, algosdk.decodeAddress(address)],
        [0, ""],
        [0, ""],
        [0, ""],
        [0, ""],
        [0, ""],
        [0, ""],
        [0, ""],
      ];
    } else {
      appArgs = [
        this.convertToIntArray(appArg),
        this.convertToIntArray(channelName),
      ];
      boxes = [
        [0, channelName],
        [0, ""],
        [0, ""],
        [0, ""],
        [0, ""],
        [0, ""],
        [0, ""],
        [0, ""],
      ];
    }
    const params = await this.client.getTransactionParams().do();
    params.fee = 1000;
    params.flatFee = true;
    let note: any;
    //create unsigned transaction
    const txn2 = algosdk.makeApplicationCloseOutTxnFromObject({
      from: address,
      suggestedParams: params,
      appIndex: APP_INDEX,
      appArgs: appArgs,
      boxes: boxes,
    });
    const txn3 = algosdk.makeApplicationNoOpTxnFromObject({
      from: address,
      suggestedParams: params,
      appIndex: APP_INDEX,
      note: this.encodeString("Notiboy optout txn3"),
      boxes: boxes,
    });
    const txn4 = algosdk.makeApplicationNoOpTxnFromObject({
      from: address,
      suggestedParams: params,
      appIndex: APP_INDEX,
      note: this.encodeString("Notiboy optout txn4"),
      boxes: boxes,
    });
    const txn5 = algosdk.makeApplicationNoOpTxnFromObject({
      from: address,
      suggestedParams: params,
      appIndex: APP_INDEX,
      note: this.encodeString("Notiboy optout txn5"),
      boxes: boxes,
    });

    const groupTxns = [txn2, txn3, txn4, txn5];
    algosdk.assignGroupID(groupTxns);
    return groupTxns;
  }
  // Get list of public channels
  async listPublicChannels(): Promise<any[]> {
    const appInfo = await this.indexer.lookupApplications(APP_INDEX).do();
    let channelDetails = [];
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
      channelDetails.push({
        channelName: key,
        dappAddress: algosdk.encodeAddress(addressList.slice(0, 32)),
        lsigAddress: algosdk.encodeAddress(addressList.slice(33)),
      });
    }
    return channelDetails;
  }

  //Get notifications from a channel
  notification() {
    return new Notification(this.client, this.indexer);
  }
}
