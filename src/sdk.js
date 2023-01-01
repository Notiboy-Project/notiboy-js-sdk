"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
//Defined basic methods related to channels
var algosdk_1 = require("algosdk");
var constants_1 = require("./constants");
var rpc_1 = require("./rpc");
var notifications_1 = require("./notifications");
var channel_1 = require("./channel");
var SDK = /** @class */ (function (_super) {
    __extends(SDK, _super);
    function SDK() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SDK.prototype.isValidAddress = function (address) {
        return algosdk_1["default"].isValidAddress(address);
    };
    //Channel Creation
    SDK.prototype.createChannel = function (sender) {
        return __awaiter(this, void 0, void 0, function () {
            var tealProgram, programBytes, compiledTeal, compiledBytes, onComplete, params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tealProgram = (0, channel_1["default"])();
                        programBytes = this.convertToIntArray(tealProgram);
                        return [4 /*yield*/, this.client.compile(programBytes)["do"]()];
                    case 1:
                        compiledTeal = _a.sent();
                        compiledBytes = new Uint8Array(Buffer.from(compiledTeal.result, "base64"));
                        onComplete = algosdk_1["default"].OnApplicationComplete.NoOpOC;
                        return [4 /*yield*/, this.client.getTransactionParams()["do"]()];
                    case 2:
                        params = _a.sent();
                        //Return the transaction for signing
                        return [2 /*return*/, algosdk_1["default"].makeApplicationCreateTxnFromObject({
                                onComplete: onComplete,
                                from: sender,
                                suggestedParams: params,
                                approvalProgram: compiledBytes,
                                clearProgram: compiledBytes,
                                numLocalInts: constants_1.LOCAL_INTS,
                                numLocalByteSlices: constants_1.LOCAL_BYTES,
                                numGlobalInts: constants_1.GLOBAL_INTS,
                                numGlobalByteSlices: constants_1.GLOBAL_BYTES,
                                appArgs: constants_1.APP_ARG_NULL
                            })];
                }
            });
        });
    };
    //Opt-in to Notiboy smart contract by creator address & and payment of one-time fee
    SDK.prototype.channelContractOptin = function (sender, creatorAppIndex, channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var boxNameArray, boxes, appArgs, params, paymentTxn, optinTransaction, noopTxns, basicTxns, groupTxns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        boxNameArray = this.convertToIntArray(constants_1.NOTIBOY_BOX_NAME);
                        boxes = [
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                        ];
                        appArgs = [
                            this.convertToIntArray("dapp"),
                            this.convertToIntArray(channelName),
                        ];
                        return [4 /*yield*/, this.client.getTransactionParams()["do"]()];
                    case 1:
                        params = _a.sent();
                        paymentTxn = algosdk_1["default"].makeAssetTransferTxnWithSuggestedParamsFromObject({
                            from: sender,
                            assetIndex: constants_1.ASA_ASSET,
                            suggestedParams: params,
                            to: constants_1.DAPP_ESCROW,
                            amount: constants_1.CHANNEL_CREATION_FEE
                        });
                        optinTransaction = algosdk_1["default"].makeApplicationOptInTxnFromObject({
                            from: sender,
                            suggestedParams: params,
                            appIndex: constants_1.NOTIBOY_APP_INDEX,
                            appArgs: appArgs,
                            foreignAssets: [constants_1.ASA_ASSET],
                            foreignApps: [creatorAppIndex]
                        });
                        noopTxns = this.createNoopTransactions(constants_1.CHANNEL_NOOP_TXNS, sender, params, constants_1.NOTIBOY_APP_INDEX, boxes, []);
                        basicTxns = [paymentTxn, optinTransaction];
                        groupTxns = basicTxns.concat(noopTxns);
                        algosdk_1["default"].assignGroupID(groupTxns);
                        return [2 /*return*/, groupTxns];
                }
            });
        });
    };
    //Channel Deletion (first we have to close-out and then delete the SC)
    SDK.prototype.channelDelete = function (sender, creatorAppIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.getTransactionParams()["do"]()];
                    case 1:
                        params = _a.sent();
                        //Return the transaction for signing
                        return [2 /*return*/, algosdk_1["default"].makeApplicationDeleteTxnFromObject({
                                from: sender,
                                appIndex: creatorAppIndex,
                                suggestedParams: params
                            })];
                }
            });
        });
    };
    //Channel Opt-out from Notiboy contract
    SDK.prototype.channelContractOptout = function (sender, creatorAppIndex, channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var boxNameArray, boxes, appArgs, params, closeOutTransaction, noopTxns, basicTxns, groupTxns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        boxNameArray = this.convertToIntArray(constants_1.NOTIBOY_BOX_NAME);
                        boxes = [
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                        ];
                        appArgs = [
                            this.convertToIntArray("dapp"),
                            this.convertToIntArray(channelName),
                        ];
                        return [4 /*yield*/, this.client.getTransactionParams()["do"]()];
                    case 1:
                        params = _a.sent();
                        closeOutTransaction = algosdk_1["default"].makeApplicationCloseOutTxnFromObject({
                            from: sender,
                            appIndex: constants_1.NOTIBOY_APP_INDEX,
                            suggestedParams: params,
                            foreignApps: [creatorAppIndex],
                            appArgs: appArgs
                        });
                        noopTxns = this.createNoopTransactions(constants_1.CHANNEL_NOOP_TXNS, sender, params, constants_1.NOTIBOY_APP_INDEX, boxes, []);
                        basicTxns = [closeOutTransaction];
                        groupTxns = basicTxns.concat(noopTxns);
                        algosdk_1["default"].assignGroupID(groupTxns);
                        return [2 /*return*/, groupTxns];
                }
            });
        });
    };
    //User opt-in to Notiboy SC
    SDK.prototype.userContractOptin = function (sender) {
        return __awaiter(this, void 0, void 0, function () {
            var boxNameArray, boxes, appArgs, params, paymentTxn, optinTransaction, groupTxns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        boxNameArray = algosdk_1["default"].decodeAddress(sender).publicKey;
                        boxes = [
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                        ];
                        appArgs = [
                            this.convertToIntArray("user")
                        ];
                        return [4 /*yield*/, this.client.getTransactionParams()["do"]()];
                    case 1:
                        params = _a.sent();
                        paymentTxn = algosdk_1["default"].makePaymentTxnWithSuggestedParamsFromObject({
                            from: sender,
                            suggestedParams: params,
                            to: algosdk_1["default"].getApplicationAddress(constants_1.NOTIBOY_APP_INDEX),
                            amount: constants_1.USER_BOX_CREATION_FEE
                        });
                        optinTransaction = algosdk_1["default"].makeApplicationOptInTxnFromObject({
                            from: sender,
                            suggestedParams: params,
                            appIndex: constants_1.NOTIBOY_APP_INDEX,
                            appArgs: appArgs,
                            boxes: boxes
                        });
                        groupTxns = [paymentTxn, optinTransaction];
                        algosdk_1["default"].assignGroupID(groupTxns);
                        return [2 /*return*/, groupTxns];
                }
            });
        });
    };
    //User opt-in to a channel
    SDK.prototype.userChannelOptin = function (sender, channelAppIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var params, optinTransaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.getTransactionParams()["do"]()];
                    case 1:
                        params = _a.sent();
                        optinTransaction = algosdk_1["default"].makeApplicationOptInTxnFromObject({
                            from: sender,
                            suggestedParams: params,
                            appIndex: channelAppIndex
                        });
                        return [2 /*return*/, optinTransaction];
                }
            });
        });
    };
    //User Opt-out of channel
    SDK.prototype.userChannelOptout = function (sender, channelAppIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var params, optOutTransaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.getTransactionParams()["do"]()];
                    case 1:
                        params = _a.sent();
                        optOutTransaction = algosdk_1["default"].makeApplicationCloseOutTxnFromObject({
                            from: sender,
                            suggestedParams: params,
                            appIndex: channelAppIndex
                        });
                        return [2 /*return*/, optOutTransaction];
                }
            });
        });
    };
    //Read channel list
    SDK.prototype.getChannelList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var boxResponse, value, chunks, channels, i, index, i, channel, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.getApplicationBoxByName(constants_1.NOTIBOY_APP_INDEX, this.convertToIntArray(constants_1.NOTIBOY_BOX_NAME))["do"]()];
                    case 1:
                        boxResponse = _a.sent();
                        value = boxResponse.value;
                        chunks = [];
                        channels = [];
                        for (i = 0; i < value.length; i += constants_1.MAX_MAIN_BOX_MSG_SIZE) {
                            chunks.push(value.slice(i, i + constants_1.MAX_MAIN_BOX_MSG_SIZE));
                        }
                        index = 0;
                        for (i = 0; i < chunks.length; i++) {
                            if (this.checkIsZeroValue(chunks[i]))
                                continue;
                            else {
                                channel = this.parseMainBoxChunk(chunks[i], index);
                                index += constants_1.MAX_MAIN_BOX_MSG_SIZE;
                                channels.push(channel);
                            }
                        }
                        return [2 /*return*/, channels];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //Get counter
    SDK.prototype.getCounter = function (sender) {
        return __awaiter(this, void 0, void 0, function () {
            var localState, transactionDetails, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.indexer
                                .lookupAccountAppLocalStates(sender)
                                .applicationID(constants_1.NOTIBOY_APP_INDEX)["do"]()];
                    case 1:
                        localState = _a.sent();
                        if (localState["apps-local-states"] == undefined)
                            return [2 /*return*/, [0, 0]];
                        transactionDetails = localState["apps-local-states"][0]["key-value"];
                        return [2 /*return*/, this.readCounter(transactionDetails)];
                    case 2:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [2 /*return*/, [0, 0]];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // read global state
    SDK.prototype.listPublicChannels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var appInfo, channelDetails, i, key, addressList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.indexer.lookupApplications(constants_1.NOTIBOY_APP_INDEX)["do"]()];
                    case 1:
                        appInfo = _a.sent();
                        channelDetails = [];
                        for (i = 0; i < appInfo.application.params["global-state"].length; i++) {
                            key = Buffer.from(appInfo.application.params["global-state"][i].key, "base64").toString("utf-8");
                            if (key === "Creator")
                                continue;
                            addressList = Buffer.from(appInfo.application.params["global-state"][i].value.bytes, "base64");
                            if (addressList.length === 67 &&
                                addressList.slice(66).toString("utf-8") == "v") {
                                channelDetails.push({
                                    channelName: key,
                                    dappAddress: algosdk_1["default"].encodeAddress(addressList.slice(0, 32)),
                                    lsigAddress: algosdk_1["default"].encodeAddress(addressList.slice(33, 65)),
                                    status: "verified"
                                });
                            }
                            else if (addressList.length === 65) {
                                channelDetails.push({
                                    channelName: key,
                                    dappAddress: algosdk_1["default"].encodeAddress(addressList.slice(0, 32)),
                                    lsigAddress: algosdk_1["default"].encodeAddress(addressList.slice(33, 65)),
                                    status: "regular"
                                });
                            }
                        }
                        return [2 /*return*/, channelDetails];
                }
            });
        });
    };
    //Get notifications from a channel
    SDK.prototype.notification = function () {
        return new notifications_1["default"](this.client, this.indexer);
    };
    SDK.prototype.getoptinState = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var accountInfo, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.indexer.lookupAccountByID(address)["do"]()];
                    case 1:
                        accountInfo = _a.sent();
                        if (accountInfo["account"]["apps-local-state"] == undefined)
                            return [2 /*return*/, false];
                        for (i = 0; i < accountInfo["account"]["apps-local-state"].length; i++) {
                            if (accountInfo["account"]["apps-local-state"][i].id === constants_1.NOTIBOY_APP_INDEX) {
                                return [2 /*return*/, true];
                            }
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    return SDK;
}(rpc_1["default"]));
exports["default"] = SDK;
