/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "mumbai",
  networks: {
    matic: {
      url: `https://rpc-mainnet.maticvigil.com/v1/${process.env.MATICVIGIL_API_KEY}`,
      chainId: 137,
      accounts: [process.env.ACCOUNT_KEY],
      ethscan: "https://explorer-mainnet.maticvigil.com"
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com/v1/${process.env.MATICVIGIL_API_KEY}`,
      chainId: 80001,
      accounts: [process.env.ACCOUNT_KEY],
      ethscan: "https://explorer-mumbai.maticvigil.com"
    }
  },
  namedAccounts: {
    deployer: 0,
    tester: 1,
    others: "from:2"
  },
  solidity: "0.8.4",
};
