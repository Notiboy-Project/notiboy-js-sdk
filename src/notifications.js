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
//Defined the methods for notifications
var algosdk_1 = require("algosdk");
var rpc_1 = require("./rpc");
var constants_1 = require("./constants");
var Notification = /** @class */ (function (_super) {
    __extends(Notification, _super);
    function Notification() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Send Public Notification
    Notification.prototype.sendPublicNotification = function (sender, channelAppIndex, notification) {
        return __awaiter(this, void 0, void 0, function () {
            var note, appArgs, foreignApps, params, notificationTransaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        note = this.encodeString(notification);
                        appArgs = [
                            this.encodeString(constants_1.APP_ARG_PUB),
                        ];
                        foreignApps = [channelAppIndex];
                        return [4 /*yield*/, this.client.getTransactionParams()["do"]()];
                    case 1:
                        params = _a.sent();
                        notificationTransaction = algosdk_1["default"].makeApplicationNoOpTxnFromObject({
                            from: sender,
                            suggestedParams: params,
                            appIndex: constants_1.NOTIBOY_APP_INDEX,
                            appArgs: appArgs,
                            foreignApps: foreignApps,
                            note: note
                        });
                        return [2 /*return*/, notificationTransaction];
                }
            });
        });
    };
    // Send Personal Notification
    Notification.prototype.sendPersonalNotification = function (sender, receiver, channelAppIndex, channelName, notification, channelBoxIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var note, boxNameArray, boxes, appArgs, foreignApps, accounts, params, notificationTransaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        note = this.encodeString(notification);
                        boxNameArray = algosdk_1["default"].decodeAddress(receiver).publicKey;
                        boxes = [
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray },
                            { appIndex: 0, name: boxNameArray }
                        ];
                        appArgs = [
                            this.encodeString(constants_1.APP_ARG_PVT),
                            this.encodeString(channelName),
                            algosdk_1["default"].bigIntToBytes(channelBoxIndex, 8) //passing the index of the channel details stored in the notiboy box
                        ];
                        foreignApps = [channelAppIndex];
                        accounts = [receiver];
                        return [4 /*yield*/, this.client.getTransactionParams()["do"]()];
                    case 1:
                        params = _a.sent();
                        notificationTransaction = algosdk_1["default"].makeApplicationNoOpTxnFromObject({
                            from: sender,
                            suggestedParams: params,
                            appIndex: constants_1.NOTIBOY_APP_INDEX,
                            appArgs: appArgs,
                            accounts: accounts,
                            foreignApps: foreignApps,
                            note: note,
                            boxes: boxes
                        });
                        return [2 /*return*/, notificationTransaction];
                }
            });
        });
    };
    //Read Public notifications
    Notification.prototype.getPublicNotification = function (sender) {
        return __awaiter(this, void 0, void 0, function () {
            var localState, transactionDetails, error_1;
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
                            return [2 /*return*/, []];
                        transactionDetails = localState["apps-local-states"][0]["key-value"];
                        return [2 /*return*/, this.getLocalState(transactionDetails)];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //Read Personal Notifications
    Notification.prototype.getPersonalNotification = function (sender) {
        return __awaiter(this, void 0, void 0, function () {
            var boxName, boxResponse, value, chunks, notifications, i, index, i, notification, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        boxName = algosdk_1["default"].decodeAddress(sender).publicKey;
                        return [4 /*yield*/, this.client.getApplicationBoxByName(constants_1.NOTIBOY_APP_INDEX, Buffer.from(boxName))["do"]()];
                    case 1:
                        boxResponse = _a.sent();
                        value = boxResponse.value;
                        chunks = [];
                        notifications = [];
                        //splitting the box data into chunks
                        for (i = 0; i < value.length; i += constants_1.MAX_USER_BOX_MSG_SIZE) {
                            chunks.push(value.slice(i, i + constants_1.MAX_USER_BOX_MSG_SIZE));
                        }
                        index = 0;
                        for (i = 0; i < chunks.length; i++) {
                            if (this.checkIsZeroValue(chunks[i], index))
                                continue;
                            else {
                                notification = this.parseUserBoxChunk(chunks[i]);
                                notifications.push(notification);
                            }
                            index += 1;
                        }
                        return [2 /*return*/, notifications];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Notification;
}(rpc_1["default"]));
exports["default"] = Notification;
