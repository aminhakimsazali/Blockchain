var result = artifacts.require("./StudentCert.sol");

module.exports = function(deployer) {
  //address here is taken from ganache. To set the owner of the contract
  deployer.deploy(result);
};
