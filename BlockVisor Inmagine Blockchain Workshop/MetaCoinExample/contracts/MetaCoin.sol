pragma solidity ^0.4.18;

import "./ConvertLib.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract MetaCoin {
	//global state variable
	mapping (address => uint) balances;

	//event declaration
	//indexed keyword attaches our data to a transaction
	//we use uint256 which is default
	//we use uint8 if its a small int
	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	//its our initial function that runs on contract migration
	constructor() public {
		// msg.sender = owner;
		balances[tx.origin] = 10000;
	}

	//core function
	function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
		//checking if the sender has enough coin to transfer
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		//here is where we emit our event
		emit Transfer(msg.sender, receiver, amount);
		return true;
	}
	//we can test if some address has ether
	function getBalanceInEth(address addr) public view returns(uint){
		//using ConvertLib to convert from Weigh
		return ConvertLib.convert(getBalance(addr),2);
	}

	function getBalance(address addr) public view returns(uint) {
		return balances[addr];
	}
}
