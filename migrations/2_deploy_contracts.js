const CryptoMuseum = artifacts.require("CryptoMuseum");

module.exports = function(deployer) {
  deployer.deploy(CryptoMuseum);
};
