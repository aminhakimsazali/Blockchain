import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import taskMasterArtifacts from '../../build/contracts/TaskMaster.json'

var TaskMaster = contract(taskMasterArtifacts);
var ownerAccount;
var account;

window.TaskMasterApp = {
  setWeb3Provider: function() {
    TaskMaster.setProvider(web3.currentProvider);
  },

  updateTransactionStatus: function(statusMessage) {
    document.getElementById("transactionStatus").innerHTML = statusMessage;
  },

  // getBalanceByAccount: function (address){
  //   var self = this;
  //
  //   TaskMaster.deployed()
  //   .then(function(taskMasterInstance)){
  //
  //   }
  // }

  refreshAccountBalance: function() {
    var self = this;

    TaskMaster.deployed()
      .then(function(taskMasterInstance) {

        return taskMasterInstance.getBalance(account);
        // return taskMasterInstance.getBalance.call(ownerAccount, {
        //   from: ownerAccount
        // }


      }).then(function(value) {
        document.getElementById("accountBalance").innerHTML = value;
        console.console.log(value);
        // document.getElementById("accountBalance").innerHTML = value.valueOf();
        document.getElementById("accountBalance").style.color = "white";
      }).catch(function(e) {
        console.log(e);
        self.updateTransactionStatus("Error getting account balance; see console.");
      });
  },

  getAccounts: function () {
    var self = this;

    // web3.eth.getCoinbase(function(err, account) {
    //   if (err === null) {
    //     App.account = account;
    //     $("#accountAddress").html("Your Account: " + account);
    //   }
    // }

    web3.eth.getCoinbase(function(err,account){
      if(err==null){
        TaskMasterApp.account = account;
        console.log("Account : " + account);
      }
    });

    web3.eth.getAccounts(function(error, accounts) {
      if (error != null) {
        alert("Sorry, something went wrong. We couldn't fetch your accounts.");
        return;
      }

      if (!accounts.length) {
        alert("Sorry, no errors, but we couldn't get any accounts - Make sure your Ethereum client is configured correctly.");
        return;
      }

      ownerAccount = account;
      self.refreshAccountBalance();
    });
  },

  rewardDoer: function() {
    var self = this;

    var todoCoinReward = +document.getElementById("todoCoinReward").value;
    var doer = document.getElementById("doer").value;

    this.updateTransactionStatus("Transaction in progress ... ");

    TaskMaster.deployed()
      .then(function(taskMasterInstance) {
        return taskMasterInstance.reward(doer, todoCoinReward, {
          from: ownerAccount
        });
      }).then(function() {
        self.updateTransactionStatus("Transaction complete!");
        self.refreshAccountBalance();
      }).catch(function(e) {
        console.log(e);
        self.updateTransactionStatus("Error sending reward - see console.");
      });
  }
};

window.addEventListener('load', function() {
  window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  TaskMasterApp.setWeb3Provider();
  TaskMasterApp.getAccounts();
});
