var student;

var studentName = document.getElementById('name');

App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  ic: 0,
  named : " " ,
  course : " ",
  matric_num : null,
  dob :null,
  graddate : null,
  cgpa : 0,


  init: function() {
    return App.initWeb3();
    console.log("init", document.getElementById('name'));
  },

  //initialise web3
  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    console.log("Web3 init");
    return App.initContract();
  },

  //intialize the contract
  initContract: function() {
    $.getJSON("StudentCert.json", function(studentcert) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.StudentCert = TruffleContract(studentcert);
      // Connect provider to interact with contract
      App.contracts.StudentCert.setProvider(App.web3Provider);

      // App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  // listenForEvents: function() {
  //   App.contracts.StudentCert.deployed().then(function(instance) {
  //     // Restart Chrome if you are unable to receive this event
  //     // This is a known issue with Metamask
  //     // https://github.com/MetaMask/metamask-extension/issues/2393
  //     instance.votedEvent({}, {
  //       fromBlock: 0,
  //       toBlock: 'latest'
  //     }).watch(function(error, event) {
  //       console.log("event triggered", event)
  //       // Reload when a new vote is recorded
  //       App.render();
  //     });
  //   });
  // },

  render: function() {
    var studentcertInstance;
    var ic = $("#ic")
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // App.retrieveData();
// //Load students data
// App.contracts.StudentCert.deployed().then(function(instance) {
//        studentcertInstance = instance;

//      }).then(function())


//     // Load contract data
//     App.contracts.StudentCert.deployed().then(function(instance) {
//       studentcertInstance = instance;
//       // return electionInstance.candidatesCount();

//     }).then(function(candidatesCount) {
//       var candidatesResults = $("#candidatesResults");
//       candidatesResults.empty();

//       var candidatesSelect = $('#candidatesSelect');
//       candidatesSelect.empty();

//       for (var i = 1; i <= candidatesCount; i++) {
//         electionInstance.candidates(i).then(function(candidate) {
//           var id = candidate[0];
//           var name = candidate[1];
//           var voteCount = candidate[2];

//           // Render candidate Result
//           var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
//           candidatesResults.append(candidateTemplate);

//           // Render candidate ballot option
//           var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
//           candidatesSelect.append(candidateOption);
//         });
//       }
//       return electionInstance.voters(App.account);
//     }).then(function(hasVoted) {
//       // Do not allow a user to vote
//       if(hasVoted) {
//         $('form').hide();
//       }
//       loader.hide();
//       content.show();
//     }).catch(function(error) {
//       console.warn(error);
//     });
  },

  addStudent: function() {
    console.log("Function is triggered");
    App.ic = $('#ic').val();
    App.course = $('#course').val();
    App.named = $('#name').val();
    App.matric_num = $('#matric_num').val();
    App.dob = $('#dob').val();
    App.graddate = $('#graddate').val();
    App.cgpa = $('#cgpa').val();

    console.log("IC :", App.ic);
    console.log("course :", App.course);
    console.log("name ", App.named);
    console.log("CGPA :", App.cgpa);



    App.contracts.StudentCert.deployed().then(function(instance) {
        instance.addStudent( 123, 'name', 'Solidity', 'ballot','2018-01-01',4,'2018-10-10');
        console.log("IC 123: " ,instance.Student.call(123));
        instance.addStudent(App.ic,
          App.named,
          App.course,
          App.matric_num,
           App.dob,
           App.cgpa,
           App.graddate);
        console.log("IC : " ,instance.Student.call(App.ic))
    }).catch(function(err) {
      console.error(err);
    });

  },

  retrieveData : function(){
    App.ic = $('#ic').val();
    console.log("Retriving Data", App.ic);


    App.contracts.StudentCert.deployed()
    .then(function(instance) {
      return studentcertInstance = instance;
    }).then(function(data){
      // var student = studentcertInstance.Student[App.ic];

      // var struct;

      struct = data.Student.call(App.ic)

      console.log("Data ", struct );
// console.log('student.name', student, student.getDetails(980607))

// student.addStudent( 123,
//         'name',
//         'Solidity',
//         'ballot',
//         '2018-01-01',
//         4,
//         '2018-10-10')

//     // App.name = 'student.name';
//     // App.course = student.course;
//     // App.matric_num = student.matric_num;
//     // App.dob = student.dob;
//     // App.graddate = student.graddate;
//     // App.cgpa = student.cgpa;
//     // console.log("CGPA: " + cgpa )

//     }).then(results => {


//       console.log(student)
//      console.log(student.Student.call(123).then(results => {
//       console.log('results', results)
//      }))

    })
  }

  // $("#addSt").click( function(){

  //   console.log("Function is triggered")
  //   var ic = $('#ic').val()
  //   var course = $('#course').val()
  //   var name = $('#name').val()
  //   var matric_num = $('#matric_num').val()
  //   var dob = $('#dob').val()
  //   var graddate = $('#graddate').val()
  //   var cgpa = $('#cgpa').val()


  //   App.contracts.StudentCert.deployed().then(function(instance) {
  //       return instance.ic = ic;
  //   }.then(function(result) {
  //     return instance.addStudent(string _name,string _course,
  //       string _matric_num,string _dob,int _gpa,string _graddate)
  //     // Wait for votes to update
  //     $("#content").hide();
  //     $("#loader").show();
  //   }).catch(function(err) {
  //     console.error(err);
  //   }));



  };





//end declaration App

//declare application when page is load.
$(function() {
  $(window).ready(function() {
    App.init();

  });
});
