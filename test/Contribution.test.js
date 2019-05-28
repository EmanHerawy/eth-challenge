const { ether } = require('openzeppelin-solidity/test/helpers/ether');
const {
  advanceBlock
} = require('openzeppelin-solidity/test/helpers/advanceToBlock');
const time = require('openzeppelin-solidity/test/helpers/time');
const expectEvent = require('openzeppelin-solidity/test/helpers/expectEvent');

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();
const tokenContract = artifacts.require('TokenContract');
const contributionContract = artifacts.require('Contribution');
contract('TokenContract', ([_, deployer, owner, wallet, investor]) => {
  const amount = ether(4);
  let openingTime;
  let closingTime;
  let token;
  let contribution;
  const rate = new BigNumber(1);

  //let afterClosingTime;

  before(async () => {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
    await advanceBlock();
  });
  beforeEach(async () => {
    openingTime = (await time.latest()) + time.duration.days(20);
    closingTime = openingTime + time.duration.days(20);
    token = await tokenContract.new(openingTime, closingTime, {
      from: owner
    });
    contribution = await contributionContract.new(rate, wallet, token.address, {
      from: owner
    });
    await token.addMinter(contribution.address, { from: owner });
  });
  it('should create token with correct parameters', async () => {
    should.exist(token);
    should.exist(contribution);

    (await token.openingTime()).should.be.bignumber.equal(openingTime);
    (await token.closingTime()).should.be.bignumber.equal(closingTime);
  });
  describe('userDonation function check', () => {
    it('should accept a wallet address and return the amount', async () => {
      // using buytoken function as it does all the required functionalitiy
      await contribution.buyTokens(investor, {
        value: amount,
        from: investor
      });
      (await contribution.userDonation(investor)).should.be.bignumber.equal(
        amount
      );
    });
    it('emits a Donate event', async function() {
      const { logs } = await contribution.buyTokens(investor, {
        value: amount,
        from: investor
      });
      const timestamp = await time.latest();

      expectEvent.inLogs(logs, 'Donate', {
        donator: investor,
        value: amount,
        timestamp: timestamp
      });
    });
  });
});
