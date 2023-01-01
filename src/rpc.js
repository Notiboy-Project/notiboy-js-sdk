"use strict";
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
//Defined basic RPC methods
var algosdk_1 = require("algosdk");
var base32 = require("hi-base32");
var RPC = /** @class */ (function () {
    function RPC(client, indexer) {
        this.client = client;
        this.indexer = indexer;
    }
    RPC.prototype.convertToIntArray = function (arg) {
        return new Uint8Array(Buffer.from(arg));
    };
    RPC.prototype.convertToString = function (arg) {
        return new TextDecoder().decode(arg);
    };
    RPC.prototype.convertToArrayBuffer = function (arg) {
        var args = [];
        args.push([Buffer.from(arg)]);
        return args;
    };
    RPC.prototype.encodeUint = function (arg) {
        return algosdk_1["default"].encodeUint64(arg);
    };
    RPC.prototype.encodeString = function (arg) {
        return new Uint8Array(Buffer.from(arg, "utf8"));
    };
    RPC.prototype.base32EncodeArrayBuffer = function (arg) {
        return base32.encode(Buffer.from(arg, "base64"));
    };
    RPC.prototype.decodeNote = function (note) {
        return Buffer.from(note, "base64").toString("utf-8");
    };
    //Create noop transactions
    RPC.prototype.createNoopTransactions = function (txns, address, params, appIndex, boxes, foreignApps) {
        var txnsArray = [];
        for (var i = 0; i < txns; i++) {
            txnsArray.push(algosdk_1["default"].makeApplicationNoOpTxnFromObject({
                from: address,
                suggestedParams: params,
                appIndex: appIndex,
                note: this.encodeString("noop ".concat(i)),
                boxes: boxes,
                foreignApps: foreignApps
            }));
        }
        return txnsArray;
    };
    //Read Global State Key for 
    RPC.prototype.readGlobalStateKey = function (appId, key) {
        return __awaiter(this, void 0, void 0, function () {
            var appInfo, globalState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.indexer.lookupApplications(appId)["do"]()];
                    case 1:
                        appInfo = _a.sent();
                        if (appInfo['params']['global-state']) {
                            globalState = appInfo['params']['global-state'];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //Get transaction ids from local state
    RPC.prototype.getLocalState = function (transactionDetails) {
        var publicNotifications = [];
        for (var j = 0; j < transactionDetails.length; j++) {
            // converting key into array buffer
            var bufferKey = Buffer.from(transactionDetails[j].key, "base64");
            var finalKey = void 0;
            // checking for "index" string to keep it as is
            var convertToString = bufferKey.toString("utf-8");
            if (convertToString == "index" || convertToString == "msgcount" || convertToString == "whoami") {
                finalKey = convertToString;
                continue;
            }
            else {
                // other key values are converted into number
                finalKey = algosdk_1["default"].decodeUint64(bufferKey, "mixed");
                var publicNotification = Buffer.from(transactionDetails[j].value.bytes, "base64").toString();
                console.log(publicNotification);
                var PublicNotification = {
                    index: finalKey,
                    notification: publicNotification
                };
                publicNotifications.unshift(PublicNotification);
            }
        }
        return publicNotifications;
    };
    RPC.prototype.readCounter = function (transactionDetails) {
        var counter = [0, 0];
        for (var j = 0; j < transactionDetails.length; j++) {
            // converting key into array buffer
            var bufferKey = Buffer.from(transactionDetails[j].key, "base64");
            var finalKey = void 0;
            var convertToString = bufferKey.toString("utf-8");
            if (convertToString == "msgcount") {
                finalKey = convertToString;
                console.log(finalKey);
                var value = transactionDetails[j].value.bytes;
                console.log(value.length);
                counter = [Number(algosdk_1["default"].bytesToBigInt(value.slice(0, 8))), Number(algosdk_1["default"].bytesToBigInt(value.slice(9, 17)))];
            }
        }
        return counter;
    };
    RPC.prototype.checkIsZeroValue = function (byteData, index) {
        var data = this.convertToString(byteData);
        console.log(data, ":");
        var check = data.replace(/^0+/, '').replace(/0+$/, '').trim();
        if (check == "") {
            return true;
        }
        else {
            // console.log(index,":",check,":",check.length,":")
            return false;
        }
    };
    RPC.prototype.parseMainBoxChunk = function (chunk, index) {
        var chunkItems = [this.convertToString(chunk.slice(0, 10)).replace(/^:+/, ''), Number(algosdk_1["default"].bytesToBigInt(chunk.slice(10, 18))), this.convertToString(chunk.slice(18))];
        return {
            channelName: chunkItems[0],
            appIndex: chunkItems[1],
            channelIndex: index,
            verificationStatus: chunkItems[2]
        };
    };
    RPC.prototype.parseUserBoxChunk = function (chunk) {
        var chunkItems = [Number(algosdk_1["default"].bytesToBigInt(chunk.slice(0, 8))), Number(algosdk_1["default"].bytesToBigInt(chunk.slice(8, 16))),
            this.convertToString(chunk.slice(16)).replace(/0+$/, '')];
        return {
            appIndex: chunkItems[0],
            notification: chunkItems[2],
            timeStamp: chunkItems[1]
        };
    };
    //Get channel details from global state
    RPC.prototype.getTransactionDetails = function (transactionDetails) {
        var channelDetails = [];
        for (var j = 0; j < transactionDetails.length; j++) {
            // converting key into array buffer
            var bufferKey = Buffer.from(transactionDetails[j].key, "base64");
            // checking for "index" string to keep it as is
            var convertToString = bufferKey.toString("utf-8");
            if (convertToString === "index" || convertToString === "msgcount")
                continue;
            var decodedAppName = Buffer.from(transactionDetails[j].value.bytes, "base64")
                .slice(32)
                .toString();
            var decodedTxid = this.base32EncodeArrayBuffer(transactionDetails[j].value.bytes.slice(0, 43));
            for (var i = decodedTxid.length - 1; i >= 0; i--) {
                if (decodedTxid[i] == "=") {
                    decodedTxid = decodedTxid.slice(0, -1);
                }
                else {
                    channelDetails.push({
                        decodedTxid: decodedTxid,
                        decodedAppName: decodedAppName
                    });
                    break;
                }
            }
        }
        return channelDetails;
    };
    return RPC;
}());
exports["default"] = RPC;
