module.exports = {
  networks: {
    development: {
    host: "127.0.0.1",
    port: 8545,
    network_id: "*" // match any network
    },
  },
  test: {
    provider: function() {
      return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/");
    },
    network_id: '*',
  },


};
