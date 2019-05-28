var token = artifacts.require('./TokenContract.sol');
var contribution = artifacts.require('./Contribution.sol');

module.exports = function(deployer, network, accounts) {
  deployer.then(async () => {
    const rate = new web3.BigNumber(1000);
    const wallet = accounts[0];
    const tokenTime = await getTimeStamp();

    const contractToken = await deployer.deploy(
      token,
      tokenTime.openingTime,
      tokenTime.closingTime
    );
    // console.log(contractToken, 'icoTime');
    // console.log(tokenTime, 'icoTime');

    const contrib = await deployer.deploy(
      contribution,

      rate,
      wallet,
      token.address
    );
    //  console.log(contrib, 'contrib');
  });

  async function getTimeStamp() {
    return await new Promise((resolve, reject) => {
      web3.eth.getBlock('latest', (err, res) => {
        // console.log(res.timestamp, 'timestamp');
        console.log(err, 'err');
        const openingTime = res.timestamp + 100;

        console.log(openingTime, 'openingTime');

        const closingTime = Math.floor(openingTime + 86400 * 20); // 20 days

        resolve({ openingTime, closingTime });
      });
    });
  }
};
