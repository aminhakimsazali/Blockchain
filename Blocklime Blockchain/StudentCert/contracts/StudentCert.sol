pragma solidity ^0.4.24;

contract StudentCert{
    
    struct details{
        string name;
        string course;
        string matric_num;
        string dob;
        string graddate;
        int gpa;

    }
    
    struct semester{
        int gpa;
        int courseWork;
    }

    event logAddedStudent (uint ic, string name, string course, string matric_num, string dob, int gpa, string graddate);
    
    mapping(uint => details) public Student;
    mapping (uint => bool) public exist;
    
    //create a array of user that can write 
    mapping(address => bool) public UniversityAdmin;

    //golbal ic number
    uint public ic;
    
    //counter for  number of student
    uint public studentsCount;
    
    //address of owner is only one. User 1.
    address owner ;

    
    //run skali sahaja
    constructor() public{
        owner = msg.sender;        
    }
    
    function setIC(uint _ic) public{
        ic=_ic;
    }
    function addStudent(
        //list of variable in details
        uint _ic,
        string _name,
        string _course,
        string _matric_num,
        string _dob,
        int _gpa,
        string _graddate) public {
        require(UniversityAdmin[msg.sender] || msg.sender == owner, "Invalid user");
        // require(!exist[_ic], "The user do not exist");
        // .addStudent( 123, 'name', 'Solidity', 'ballot','2018-01-01',4,'2018-10-10')
        
        Student[_ic] = details(_name,_course,_matric_num, _dob,_graddate, _gpa);
        exist[_ic] = true;
        studentsCount++;
        emit logAddedStudent(_ic, _name, _course, _matric_num, _dob, _gpa, _graddate);
        
    }
    
    function getDetails(uint _ic) public returns (string, string, string, string, int) {
        // return (Student[_ic].name, Student[_ic].course, Student[_ic].matric_num,Student[_ic].dob,Student[_ic].gpa );
        
        
    }

    function getName(uint _ic) public returns (string){
        return (Student[_ic].name);
    }
    
    function addUniAddress(address _address) public{
    	require(msg.sender == owner);
        UniversityAdmin[_address] = true;
    }
    
    
}
