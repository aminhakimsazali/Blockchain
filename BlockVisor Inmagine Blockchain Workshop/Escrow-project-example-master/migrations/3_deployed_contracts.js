
var ApprovalContract = artifacts.require('./ApprovalContract.sol')

module.exports = function (deployer) {
  deployer.deploy(ApprovalContract)
}
