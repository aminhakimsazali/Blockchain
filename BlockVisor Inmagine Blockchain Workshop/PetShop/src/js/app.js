App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },//end init

  initWeb3: function() {
    //Is there an injected web3 instance
    if(type of web3 !== 'undefined'){
      App.web3Provider = web3.currentProvider;
    }else{
      //If no injected web3 instance is deteced, fall back to ganache
       App.web3Provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:8545");
    }
    web3 = new Web3(App.web3Provider);
    //Testing
    var coinbase = web3.eth.coinbase;
    var balance = web3.eth.getBalance(coinbase);
    console.log("Coinbase: " + coinbase);
    console.log("Balance: " + balance;
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.sol', function(data){
      //Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      //Seth the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      //use our contract to retrieve an mark the adopted pets
      return App.markAdopted();

    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    var adoptionInstance;


    App.contracts.Adoption.deployed().then(function(instance){
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function(adopters){
      for (var i = 0; i < adopters.length; i++) {
        if(adopters[i] !== '0x0')
          $('.panel-pet').eq(i).find('button').text('Sucess').attr('disabled',true);
      }
    }).catch(function(err){
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  }

  var account = accounts[0];

  App.contracts.Adoption.deployed().then(function(instance) {
    adoptionInstance = instance;

    // Execute adopt as a transaction by sending account
    return adoptionInstance.adopt(petId, {from: account});
  }).then(function(result) {
    return App.markAdopted();
  }).catch(function(err) {
    console.log(err.message);
  });
});

    })
  }

};

$(function() {
  $(window).load(function() {
    App.init();
    initWeb3();
  });
});
