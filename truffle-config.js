const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();
require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "56", // Match any network id
      gas: 10000000, //from ganache-cli output
    },
    bscTestnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      confirmations: 0,
      timeoutBlocks: 20000000000,
      skipDryRun: true,
      networkCheckTimeout: 999999,
      gas: 10000000,
    },
    bsc: {
      provider: () => new HDWalletProvider(mnemonic, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 0,
      timeoutBlocks: 20000000000,
      networkCheckTimeout: 999999,
      skipDryRun: true,
      gas: 10000000,
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "^0.6.12",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
