App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  owner : '0x0',
  isAgency : false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }


    return App.initContract();
  },

  initContract: function() {
    $.getJSON("SmartZakat.json", function(zakat) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.SmartZakat = TruffleContract(zakat);
      // Connect provider to interact with contract
      App.contracts.SmartZakat.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {

    App.contracts.SmartZakat.deployed().then(function(instance) {



      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.addAgencyEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("Agency is added ", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });

    App.contracts.SmartZakat.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.UserAdded({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("User is added", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });//end UserAdded Event listen

    App.contracts.SmartZakat.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.transferFundEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("Fund is transfered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });//end UserAdded Event listen
  },

  render: function() {
    // App.verificationAgency();
    var zakatInstance;
    var loader = $("#loader");
    var content = $("#content");


    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);



      }
    });

  },

  transferFund: function() {
    var ic = parseInt($('#ic-no').val());
    var value = $('#value').val();
    var date = $('#date').val();
    App.contracts.SmartZakat.deployed().then(function(instance) {
      console.log(typeof(ic))
      return instance.setFund(ic, App.account ,value, date, { from: App.account });
    }).catch(function(err) {
      console.error(err);
    });
  },

  addAgency: function() {
    var addr = $('#AgAddress').val();
    var name = $('#AgName').val();
    App.contracts.SmartZakat.deployed().then(function(instance) {
      return instance.AddAgency(name, addr, { from: App.account });
    }).catch(function(err) {
      console.error(err);
    });
  },

  addUser: function() {
    var ic = $('#UserIc').val();
    var name = $('#UserName').val();
    App.contracts.SmartZakat.deployed().then(function(instance) {
      return instance.AddUser(ic, name, { from: App.account });
    }).catch(function(err) {
      console.error(err);
    });
  },

  getAgencyDetails : function(){

    var Address = $('#AgencyAddress').val();
    App.contracts.SmartZakat.deployed().then(function(instance) {
      return instance.getAgency(Address);
    }).then(function(detail){
      console.log("Detail : " + detail);
      console.log("Detail Name:  " + detail[0]);
      console.log("Detail Address" + detail[1]);
      console.log("Detail Code" + detail[2]);

    });
  },

  verificationRecipient : function(){
    var ic = $('#VerifyIC').val();
    ic = parseInt(ic);
    console.log("IC: " + ic);
    console.log("Type of: " + typeof(ic));
    App.contracts.SmartZakat.deployed().then(function(instance) {
      return instance.verify(ic);
    }).then(function(verification){
      alert("The user is  " + verification);
      console.log(verification);
    }).catch(function(err){
      console.log(err);
    });
  },

  getUserDetails: function(){
    var icDetail = $('#icDetail').val();

    App.contracts.SmartZakat.deployed().then(function(instance) {
      return instance.getUserDetails(icDetail);
    }).then(function(detail){

      console.log("_agencyAddress: " + detail[0]);
      console.log("_AgencyName: " + detail[1]);
      console.log("_Name: " + detail[2]);
    });
  },

  transferFund: function() {
      var ic = parseInt($('#ic').val());
      var value = $('#value').val();
      //var date = $('#date').val();
      var currentdate = new Date();
      var datetime = "Last Sync: " + currentdate.getDate() + "/"+(currentdate.getMonth()+1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
      App.contracts.SmartZakat.deployed().then(function(instance) {
        return instance.transFund(ic, App.account ,value, datetime, { from: App.account });
      }).catch(function(err) {
        console.error(err);
      });
    },

  // getUserFund : function(){
  //
  //   var icforFund = $('#icforFund').val();
  //   console.log("IC " + icforFund);
  //   var countFundReceived;
  //   var zakatInstance;
  //   App.contracts.SmartZakat.deployed().then(function(instance) {
  //     var object = instance.user.call(icforFund);
  //     zakatInstance = instance;
  //
  //     return object;
  //   }).then(function(object){
  //
  //     console.log("Object " + object)
  //     console.log("Count: " + object[5])
  //     countFundReceived = object[5];
  //     return countFundReceived;
  //
  //   }).then(function(counter){
  //     // console.log("Fund at 0: " + zakatInstance.getFund(icforFund,0))
  //     for (var i = 0; i < counter; i++) {
  //       const promise = new Promise((resolve, reject)=> {
  //           console.log("Fund " + zakatInstance.getFund(icforFund,i));
  //           // console.log(zakatInstance.getFund(icforFund,0));
  //           var detail =  zakatInstance.getFund(icforFund,i);
  //           console.log("Object " + detail)
  //       })
  //
  //
  //
  //       .then(function(object){
  //           console.log("Object " + object)
  //           console.log("Object " + object[0]);
  //           console.log("Object " + object[1]);
  //           console.log("Object " + object[2]);
  //       });
  //     }//end for loop
  //   }).catch(function(err){
  //     console.log(err);
  //   });
  // },


  verificationAgency : function(){
    // var AgencyAddress = $('#AgencyAddress').val();

    var AgencyAddress = App.account;

    App.contracts.SmartZakat.deployed().then(function(instance) {
      return instance.verificationAgency(AgencyAddress);
    }).then(function(verification){
      alert("The user is  " + verification);
      isAgency = verification;
      console.log(verification);
    }).catch(function(err){
      console.log(err);
    });
  },



};


$(function() {
  $(window).load(function() {
    App.init();
  });
});
