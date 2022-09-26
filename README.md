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
npm build
```

#### Node.js

To run the mocha tests in Node.js, run:

```
npm test
```
## License

notiboy-js-sdk is licensed under an GNU General Public License v3.0. See the [LICENSE](https://github.com/Notiboy-Project/notiboy-js-sdk/blob/main/LICENSE) file for details.