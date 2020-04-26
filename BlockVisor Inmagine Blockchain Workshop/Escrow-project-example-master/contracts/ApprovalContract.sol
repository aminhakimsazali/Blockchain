pragma solidity ^0.4.24;

contract ApprovalContract {

  address public sender;
  address public receiver;
  //we can do something here like hardcode and approver addreesss
  //this would be like escrow agent address
  address constant public approver = 0x4fB38e2bb044Ea2556f00Dc4DC8361565f57D4c8 ;

  constructor() public{
    // tbd
    // we could set approver here
    //for example with have a comjpany with many agents
  }

  function deposit(address _receiver) external payable {
    require(msg.value > 0);
    sender = msg.sender;
    receiver = _receiver;
  }

  function viewApprover() external pure returns(address) {
    return(approver);
  }

  function approve() external payable {
    require(msg.sender == approver);
    receiver.transfer(address(this).balance);
  }

  function getBalance() returns(uint){
    return (address(this).balance);
  }

}
