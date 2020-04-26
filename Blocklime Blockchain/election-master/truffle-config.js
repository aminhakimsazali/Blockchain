module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      from: '0x4fB38e2bb044Ea2556f00Dc4DC8361565f57D4c8' // Match any network id
    }
  }
};
