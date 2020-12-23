pragma solidity ^0.4.24;

contract SmartZakat{

    //list of details on a fund send to a user
    struct Fund{
        address sender;
        string Agency;
        uint value;
        string date;
    }

    //Agency Details
    struct Agency{
        string AgencyName;
        address Agency_address;
        uint AgencyCode;
    }

    //list of variables for user
    struct userDetails{

        string UniqueID;
        uint IC;
        string name;
        address AgencyAddress;
        string AgencyName;
        uint countFundReceived;

        //mapping every fund receive
        // mapping(address => UserFund) receivedFund;
    }

    Fund[1000] public money;

    /*function getMoney(uint[] indexes)
        public  
        returns (address[], string[], uint[], string[])
    {
        address[] memory addrs = new address[](indexes.length);
        string[] memory aggen = new string[](indexes.length);
        uint[] memory amount = new uint[](indexes.length);
        string[] memory date = new string[](indexes.length);

        for (uint i = 0; i < indexes.length; i++) {
            Fund storage fund = money[indexes[i]];
            addrs[i] = fund.addrs;
            aggen[i] = fund.aggen;
            amount[i] = fund.amount;
            date[i] = fund.date;
        }
        return (addrs, aggen, amount, date);
    }*/

    event UserAdded(uint _IC, string Name, address _Owner, string AgencyName );
    event transferFundEvent (uint Recipient, address From, uint Amount, string Date);
    event addUserEvent(uint _IC, string Name, address _Owner, string AgencyName );
    event addAgencyEvent(string Name, address Address);



    //Address of owner
    address public owner;
    uint AgencyCode = 0;

    constructor() public {
        owner = msg.sender;
    }

    //map the UniqueID with the userDetails
    mapping(uint => userDetails) public user;

    //mapping address to agency details
    mapping(address => Agency) public ListAgency;
    //mapping ic with every Fund.
    //first uint is IC, second uint is fund counter
    mapping(uint => mapping(uint => Fund)) public UserFund;
    // mapping(uint => Fund) public UserFund;





    //Add Authority which they can add people
    function AddAgency(string _AgencyName, address new_Agency) public isOwner {
        ListAgency[new_Agency].Agency_address = new_Agency;
        ListAgency[new_Agency].AgencyName = _AgencyName;
        ListAgency[new_Agency].AgencyCode = ++AgencyCode;

        emit addAgencyEvent(_AgencyName, new_Agency);

    }

    function getAgency(address _agencyAddress) isOwner public view returns  (
        string _AgencyName,
        address _Agency_address,
        uint _AgencyCode
        ){

        _AgencyName = ListAgency[_agencyAddress].AgencyName;
        _Agency_address = ListAgency[_agencyAddress].Agency_address;
        _AgencyCode = ListAgency[_agencyAddress].AgencyCode;
    }

    function verificationAgency(address agencyAddress) public view returns (bool _verify){
        if(ListAgency[agencyAddress].Agency_address != 0x0){
            _verify =  true;
        }else{
            _verify = false;
        }
    }

    //Add userDetails
    //only Agency can add user, owner cannot add
    function AddUser(

        uint _IC,
        string _name

        ) public isUserNotExist(_IC)  isAgency(msg.sender) {

        user[_IC].IC = _IC;
        user[_IC].AgencyAddress = msg.sender;
        user[_IC].AgencyName = ListAgency[msg.sender].AgencyName;
        user[_IC].name = _name;

        emit UserAdded(user[_IC].IC, user[_IC].name, msg.sender, ListAgency[msg.sender].AgencyName);

    }

    //return every single details that are map on them
    //only Authority agency can call this function
    function getUserDetails(uint _IC) isAgency(msg.sender) public view returns (

        address _agencyAddress,
        string _AgencyName,
        string _Name
        ){

        _agencyAddress = user[_IC].AgencyAddress;
        _AgencyName = ListAgency[_agencyAddress].AgencyName;
        _Name = user[_IC].name;


    }

    function getFund(uint _IC, uint index) public view returns(
      address sender, 
      string AgencyName,
      uint value,
      string date
    ){
        sender = UserFund[_IC][index].sender;
        AgencyName = UserFund[_IC][index].Agency;
        value = UserFund[_IC][index].value;
        date = UserFund[_IC][index].date;
    }

    function verify(uint _IC) public view returns (bool _verify){
        if(user[_IC].IC != 0){
            return true;
        }else {
            return false;
        }
    }

    //Only Agency can setFund, which is the fund from the agency itself
    //Only Agency can setFund, which is the fund from the agency itself
    function transFund(
        uint _IC,
        address _sender,
        uint _value,
        string _date
        ) isAgency(msg.sender) isUserExist(_IC)  public {

        //check the sender and the one that call the function is the same person
        require(msg.sender == _sender);

        uint count = user[_IC].countFundReceived;

        UserFund[_IC][count].sender = msg.sender;
        UserFund[_IC][count].Agency = ListAgency[msg.sender].AgencyName;
        UserFund[_IC][count].value = _value;
        UserFund[_IC][count].date = _date;

        user[_IC].countFundReceived++;

        emit transferFundEvent(_IC, msg.sender, _value, _date);

    }

    // function getListAgency() public;
    // function getAllUserDetail() public;


    //Verify the the one that call the function is the owner
    modifier isOwner(){
        require(msg.sender == owner);
        _;
    }

    //Verify the the one that call the
    //function is one of the agency
    modifier isAgency(address agency_address){
        require(ListAgency[agency_address].Agency_address == msg.sender);
        _;
    }

    //To make sure the user is exist
    modifier isUserExist(uint _IC){
        require(user[_IC].IC != 0);
        _;
    }

    modifier isUserNotExist(uint _IC){
        require(user[_IC].IC != _IC );
        _;
    }



}
