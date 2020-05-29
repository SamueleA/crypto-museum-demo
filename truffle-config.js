const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = process.env.MNEMONIC_ROPSTEN;
const infuraAccessKey = process.env.INFURA_ACCESS_KEY

module.exports = {
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    develop: { // default with truffle unbox is 7545, but we can use develop to test changes, ex. truffle migrate --network develop
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777"
    },
    ropsten: {
      network_id: "3",
      provider: () => { 
        return new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraAccessKey}`);
       },
    }
  },
  compilers: {
    solc: {
      version: "0.6.2",
    },
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  }
};
