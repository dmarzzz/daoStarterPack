const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const mnemonic = 'lol some1 stole 3.9 Matic from';

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    matic: {
      provider: () => new HDWalletProvider(mnemonic, `https://rpc-mainnet.maticvigil.com/v1/d0071806c43878ac7796ff1066e17bd81e45be68`),
      network_id: 137,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
    }
  }
}
