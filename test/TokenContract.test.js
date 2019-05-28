const {
  advanceBlock
} = require('openzeppelin-solidity/test/helpers/advanceToBlock');
const shouldFail = require('openzeppelin-solidity/test/helpers/shouldFail');
const time = require('openzeppelin-solidity/test/helpers/time');
const expectEvent = require('openzeppelin-solidity/test/helpers/expectEvent');

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

const tokenContract = artifacts.require('TokenContract');
contract('TokenContract', ([_, deployer, owner, wallet, investor]) => {
  const amount = 100;
  let openingTime;
  let closingTime;
  let token;

  before(async () => {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
    await advanceBlock();
  });
  beforeEach(async () => {
    openingTime = (await time.latest()) + time.duration.days(20);
    closingTime = openingTime + time.duration.days(20);
    console.log(openingTime, 'openingTime');
    console.log(openingTime, 'openingTime');

    token = await tokenContract.new(openingTime, closingTime, {
      from: owner
    });
    await token.mint(investor, amount, {
      from: owner
    });
  });

  it('should create token with correct parameters', async () => {
    should.exist(token);

    (await token.openingTime()).should.be.bignumber.equal(openingTime);
    (await token.closingTime()).should.be.bignumber.equal(closingTime);
  });

  it('should not transfer before start time ', async () => {
    await shouldFail.reverting(
      token.transfer(owner, amount, { from: investor })
    );
  });

  it('can transfer  in opening time ', async () => {
    await time.increaseTo(openingTime);
    token.transfer(owner, amount, { from: investor });
    (await token.balanceOf(owner)).should.be.bignumber.equal(amount);
  });

  it('should not transfer  after closig time ', async () => {
    await time.increaseTo(closingTime + time.duration.days(1));
    await shouldFail.reverting(
      token.transfer(owner, amount, { from: investor })
    );
  });
  it('emits a TransferInValidTime event', async function() {
    await time.increaseTo(openingTime);

    const { logs } = await token.transfer(owner, amount, { from: investor });
    const timestamp = await time.latest();
    expectEvent.inLogs(logs, 'TransferInValidTime', {
      from: investor,
      to: owner,
      value: amount,
      timestamp: timestamp
    });
  });
});
