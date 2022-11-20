import {Algodv2, Indexer} from 'algosdk'
import { describe, it } from "mocha";
import { assert } from "chai";
import SDK from '../src/index.js';

const client=new Algodv2('', 'https://testnet-api.algonode.cloud', '');
const indexer=new Indexer('', 'https://testnet-idx.algonode.cloud', '');

const sdk = new SDK(client, indexer);

describe("Testing notiboy functions", function() {

    it("Prepares creation of logic sig", async function(){
        this.timeout(5000);
        const txns = await sdk.createLogicSig('vcs');
        assert.isNotNull(txns, "Not creating logic sig")
    })
    
    it("Prepares optin transactions for channel creator", async function() {
        const txns = await sdk.optin('dapp1', 'HZ57J3K46JIJXILONBBZOHX6BKPXEM2VVXNRFSUED6DKFD5ZD24PMJ3MVA','AD5J43O3N6UPEUFYOZHT6WBUXDOK66MMGL3JHQV77Y2EAEZJVLRCINWYBI','dapp');
        assert.equal(txns.length, 2, "Not returning two transactions");
        assert.isNotNull(txns[0].group, "Not grouping the two transaction");
    }); 

    it("Fund logic sig with minimum balance", async function(){
        const txn = await sdk.provideBasicLsigBalance('2K3YHO443GBX2BTEF2B7R7ZXEUCNVE3GWETOTTVCV42SGSJ2TL5HLNG5DM','J754XZKT7PYJUE2HYTP4PXLZ5SNZ2MITOV3HOVBB3GGLFGA7H6QCSVE3U4')
        assert.isNotNull(txn, "Not returning a transaction");
    });

    it("Prepares receiving list of public channels", async function() {
        const  listPublicChannels = await sdk.listPublicChannels();
        assert.isNotNull(listPublicChannels, "The app id does not exist or the channel details are not fetched properly.")
    });

    it("Prepares send public notifications", async function() {
        const txns = await sdk.notification().sendPublicNotification('5OQOYHJ6BYPWFBUTFTN4JA5GJEAJUNA2P65DPNTN5OUGSFFO47NHRZR6HU', 'J754XZKT7PYJUE2HYTP4PXLZ5SNZ2MITOV3HOVBB3GGLFGA7H6QCSVE3U4','Karol','Testing Notification');
        assert.equal(txns.length, 2, "Not returning two transactions");
        assert.isNotNull(txns[0].group, "Not grouping the two transaction");
    });

    it("Prepares receiving Public Notifications", async function() {
        this.timeout(5000);
        const  notifications = await sdk.notification().getPublicNotification('5OQOYHJ6BYPWFBUTFTN4JA5GJEAJUNA2P65DPNTN5OUGSFFO47NHRZR6HU');
        assert.isNotNull(notifications, "The local state is not fetched proporly. Either there is no notifications or notifications not fetched properly.")
    });

    it("Prepares optin transactions for user (Personal Notification)", async function() {
        const txns = await sdk.optin('','AD5J43O3N6UPEUFYOZHT6WBUXDOK66MMGL3JHQV77Y2EAEZJVLRCINWYBI','AD5J43O3N6UPEUFYOZHT6WBUXDOK66MMGL3JHQV77Y2EAEZJVLRCINWYBI','user');
        assert.equal(txns.length, 2, "Not returning two transactions");
        assert.isNotNull(txns[0].group, "Not grouping the two transaction");
    });

    it("Prepares sending personal notifications", async function() {
        const txns = await sdk.notification().sendPersonalNotification('2K3YHO443GBX2BTEF2B7R7ZXEUCNVE3GWETOTTVCV42SGSJ2TL5HLNG5DM','AD5J43O3N6UPEUFYOZHT6WBUXDOK66MMGL3JHQV77Y2EAEZJVLRCINWYBI', 'vcs', 'J754XZKT7PYJUE2HYTP4PXLZ5SNZ2MITOV3HOVBB3GGLFGA7H6QCSVE3U4','Testing Notification');
        assert.equal(txns.length, 2, "Not returning two transactions");
        assert.isNotNull(txns[0].group, "Not grouping the two transaction");
    });

    it("Prepares receiving personal notification", async function() {
        this.timeout(5000);
        const notifications = await sdk.notification().getPersonalNotification('74R7OIQ5SZZBSPDDICD4Y2HF3HOD5ZMDPXKYEHLMAVIUSBLPYRNP2G2YPY');
        assert.isNotNull(notifications, "The local state is not fetched proporly. Either there is no notifications or notifications not fetched properly.")
    });

    it("Prepares checks optin state of address", async function() {
        const optinState = await sdk.getoptinState('HL65SEX7ERMP25UJQ4JZ6MNRCDSBILTVFDGZJXL4HYT4VUCXPJ2RQBJLMI');
        assert.isNotNull(optinState, "Optin state not properly fetched.")
    });
    
});
