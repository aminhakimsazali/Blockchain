var TaskMaster = artifacts.require("./TaskMaster.sol");
// var BigNumber = require('big-number');

contract("TaskMaster", function(accounts){
  var TaskMasterInstance;

  it("Test Balance for owner", function() {

    return TaskMaster.deployed().then(function(instance) {
      TaskMasterInstance = instance;

      return TaskMasterInstance.owner;
    }).then(function (owner_address) {
      return TaskMasterInstance.getBalance(owner_address).call;

    }).then(function(owner_balance) {
      assert.equal(owner_balance, 10000, "Owner has 10000 token");
    });
  });//end it()
});//end contract("TaskMaster")
