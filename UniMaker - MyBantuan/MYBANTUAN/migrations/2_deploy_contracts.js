var Zakat = artifacts.require("./SmartZakat.sol");

module.exports = function(deployer) {
  deployer.deploy(Zakat);
};