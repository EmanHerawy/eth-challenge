module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      // gasPrice: 2000000000,
      // gas: 6000000,
      network_id: '5777'
    },

    solc: {
      optimizer: {
        version: '0.4.24',
        enabled: true,
        runs: 200
      }
    }
  }
};
