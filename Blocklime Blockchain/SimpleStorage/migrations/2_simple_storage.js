var ss = artifacts.require("./SimpleStorage.sol");

module.exports = function(deployer) {
  deployer.deploy(ss);
};
