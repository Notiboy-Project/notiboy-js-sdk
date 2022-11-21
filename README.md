# notiboy-js-sdk
 The official JavaScript library for sending, receiving and storing on-chain notifications on algorand blockchain via notiboy smart contract.

## Installation
### [Node.js](https://nodejs.org/en/download/)
```
npm install notiboy-js-sdk
```
## Quick Start
```javascript
import sdk from "notiboy-js-sdk";
const client = new algosdk.Algodv2(token, server, port);
const indexer = new algosdk.Indexer(token, server, port);
const notiBoy = new sdk(client, indexer);
```
## SDK Development
### Building

To build a new version of the library, run:

```
npm run build
```
#### Node.js

To run the mocha tests in Node.js, run:
```
npm run test
```
#### Example
Example implementation of the SDK can be seen in this vue.js [webApp](https://github.com/Notiboy-Project/notiboy-webapp/blob/main/src/store/index.js)

## License
notiboy-js-sdk is licensed under an MIT License. See the [LICENSE](https://github.com/Notiboy-Project/notiboy-js-sdk/blob/main/LICENSE) file for details.