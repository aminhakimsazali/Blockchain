const ApprovalContract = artifacts.require('../../contracts/ApprovalContract.sol');

  contract('ApprovalContract', function(accounts) {

    it('initiates contract', async function() {
      const contract = await ApprovalContract.deployed();
      const approver = await contract.approver.call();
      assert.equal(approver, 0x4fB38e2bb044Ea2556f00Dc4DC8361565f57D4c8, "approvers don't match");
    });
    it('takes a deposit', async function () {
      const contract = await ApprovalContract.deployed();
      //account[0] is receiver. value is 1 eth.
      await contract.deposit(accounts[0], { value: 1e+18, from: accounts[1] });
      assert.equal(web3.eth.getBalance(contract.address), 1e+18, "amount did not match");
    });
    it('makes the transaction when approved, approver: ' + accounts[2], async function () {
      const contract = await ApprovalContract.deployed();
      await contract.deposit(accounts[0], { value: 1e+18, from: accounts[1] });
      await contract.approve({ from: 0x4fB38e2bb044Ea2556f00Dc4DC8361565f57D4c8 });
      assert.equal(web3.eth.getBalance(contract.address), 0, "didn't transfer ether");
    });

  });
