import Web3 from "web3";
import CryptoMuseum from "./contracts/CryptoMuseum.json";

const options = {
  web3: {
    block: false,
    // customProvider: new Web3("ws://localhost:7545"),
    // fallback: {
    //   type: 'ws',
    //   url: 'ws://127.0.0.1:7545'
    // },
  },
  contracts: [CryptoMuseum],
  events: {
    SimpleStorage: ["StorageSet"],
  },
};

export default options;
