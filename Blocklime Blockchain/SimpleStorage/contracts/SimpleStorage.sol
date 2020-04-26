pragma solidity ^0.4.8;

contract SimpleStorage{
	uint storedData;
	uint  public cgpa;

	function set(uint x) public {
		storedData = x;
	}

	function get() public view returns (uint){
		return storedData;
	}


}