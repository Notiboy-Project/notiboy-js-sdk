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
var algosdk_1 = require("algosdk");
var mocha_1 = require("mocha");
var chai_1 = require("chai");
var index_js_1 = require("../src/index.js");
var client = new algosdk_1.Algodv2('', 'https://testnet-api.algonode.cloud', '');
var indexer = new algosdk_1.Indexer('', 'https://testnet-idx.algonode.cloud', '');
var sdk = new index_js_1["default"](client, indexer);
(0, mocha_1.describe)("Testing notiboy functions", function () {
    (0, mocha_1.it)("Prepares creation of logic sig", function () {
        return __awaiter(this, void 0, void 0, function () {
            var txns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(5000);
                        return [4 /*yield*/, sdk.createLogicSig('vcs')];
                    case 1:
                        txns = _a.sent();
                        chai_1.assert.isNotNull(txns, "Not creating logic sig");
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, mocha_1.it)("Prepares optin transactions", function () {
        return __awaiter(this, void 0, void 0, function () {
            var txns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sdk.optin('dapp1', 'HZ57J3K46JIJXILONBBZOHX6BKPXEM2VVXNRFSUED6DKFD5ZD24PMJ3MVA', 'AD5J43O3N6UPEUFYOZHT6WBUXDOK66MMGL3JHQV77Y2EAEZJVLRCINWYBI', 'dapp')];
                    case 1:
                        txns = _a.sent();
                        chai_1.assert.equal(txns.length, 2, "Not returning two transactions");
                        chai_1.assert.isNotNull(txns[0].group, "Not grouping the two transaction");
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, mocha_1.it)("Fund logic sig with minimum balance", function () {
        return __awaiter(this, void 0, void 0, function () {
            var txn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sdk.provideBasicLsigBalance('2K3YHO443GBX2BTEF2B7R7ZXEUCNVE3GWETOTTVCV42SGSJ2TL5HLNG5DM', 'J754XZKT7PYJUE2HYTP4PXLZ5SNZ2MITOV3HOVBB3GGLFGA7H6QCSVE3U4')];
                    case 1:
                        txn = _a.sent();
                        chai_1.assert.isNotNull(txn, "Not returning a transaction");
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, mocha_1.it)("Prepares receiving list of public channels", function () {
        return __awaiter(this, void 0, void 0, function () {
            var listPublicChannels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sdk.listPublicChannels()];
                    case 1:
                        listPublicChannels = _a.sent();
                        chai_1.assert.isNotNull(listPublicChannels, "The app id does not exist or the channel details are not fetched properly.");
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, mocha_1.it)("Prepares send public notifications", function () {
        return __awaiter(this, void 0, void 0, function () {
            var txns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sdk.notification().sendPublicNotification('5OQOYHJ6BYPWFBUTFTN4JA5GJEAJUNA2P65DPNTN5OUGSFFO47NHRZR6HU', 'J754XZKT7PYJUE2HYTP4PXLZ5SNZ2MITOV3HOVBB3GGLFGA7H6QCSVE3U4', 'Karol', 'Testing Notification')];
                    case 1:
                        txns = _a.sent();
                        chai_1.assert.equal(txns.length, 2, "Not returning two transactions");
                        chai_1.assert.isNotNull(txns[0].group, "Not grouping the two transaction");
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, mocha_1.it)("Prepares receiving Public Notifications", function () {
        return __awaiter(this, void 0, void 0, function () {
            var notifications;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(5000);
                        return [4 /*yield*/, sdk.notification().getPublicNotification('5OQOYHJ6BYPWFBUTFTN4JA5GJEAJUNA2P65DPNTN5OUGSFFO47NHRZR6HU')];
                    case 1:
                        notifications = _a.sent();
                        chai_1.assert.isNotNull(notifications, "The local state is not fetched proporly. Either there is no notifications or notifications not fetched properly.");
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, mocha_1.it)("Prepares optin transactions for user (Personal Notification)", function () {
        return __awaiter(this, void 0, void 0, function () {
            var txns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sdk.optin('', 'AD5J43O3N6UPEUFYOZHT6WBUXDOK66MMGL3JHQV77Y2EAEZJVLRCINWYBI', '', 'user')];
                    case 1:
                        txns = _a.sent();
                        chai_1.assert.equal(txns.length, 2, "Not returning two transactions");
                        chai_1.assert.isNotNull(txns[0].group, "Not grouping the two transaction");
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, mocha_1.it)("Prepares sending personal notifications", function () {
        return __awaiter(this, void 0, void 0, function () {
            var txns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sdk.notification().sendPersonalNotification('2K3YHO443GBX2BTEF2B7R7ZXEUCNVE3GWETOTTVCV42SGSJ2TL5HLNG5DM', 'AD5J43O3N6UPEUFYOZHT6WBUXDOK66MMGL3JHQV77Y2EAEZJVLRCINWYBI', 'vcs', 'J754XZKT7PYJUE2HYTP4PXLZ5SNZ2MITOV3HOVBB3GGLFGA7H6QCSVE3U4', 'Testing Notification')];
                    case 1:
                        txns = _a.sent();
                        chai_1.assert.equal(txns.length, 2, "Not returning two transactions");
                        chai_1.assert.isNotNull(txns[0].group, "Not grouping the two transaction");
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, mocha_1.it)("Prepares receiving personal notification", function () {
        return __awaiter(this, void 0, void 0, function () {
            var notifications;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(5000);
                        return [4 /*yield*/, sdk.notification().getPersonalNotification('74R7OIQ5SZZBSPDDICD4Y2HF3HOD5ZMDPXKYEHLMAVIUSBLPYRNP2G2YPY')];
                    case 1:
                        notifications = _a.sent();
                        chai_1.assert.isNotNull(notifications, "The local state is not fetched proporly. Either there is no notifications or notifications not fetched properly.");
                        return [2 /*return*/];
                }
            });
        });
    });
});
