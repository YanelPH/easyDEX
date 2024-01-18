// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: {
//     compilers: [
//       {
//         version: "0.7.6",
//         settings: {
//           evmVersion: "istanbul",
//           optimizer: {
//             enabled: true,
//             runs: 1000,
//           },
//         },
//       },
//     ],
//   },
//   networks: {
//     hardhat: {
//       forking: {
//         url: "https://eth-mainnet.g.alchemy.com/v2/mCgRbSNJIhTJv5tiqIkrfcqzLHjOoz0F",
//       },
//     },
//   },
// };
require("dotenv").config();

require("@nomiclabs/hardhat-waffle");
module.exports = {
  solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 5000,
        details: { yul: false },
      },
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/mCgRbSNJIhTJv5tiqIkrfcqzLHjOoz0F",
        accounts: [`0x${process.env.NEXT_PUBLIC_PRIVATE_KEY}`],
      },
    },
  },
};
