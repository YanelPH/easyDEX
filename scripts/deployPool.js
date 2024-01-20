//Token addresses
shoaibAddress = "0xF8b299F87EBb62E0b625eAF440B73Cc6b7717dbd";
rayyanAddress = "0xEb0fCBB68Ca7Ba175Dc1D3dABFD618e7a3F582F6";
popUpAddress = "0xaE2abbDE6c9829141675fA0A629a675badbb0d9F";

//Uniswap contract address
wethAddress = "0x76a999d5F7EFDE0a300e710e6f52Fb0A4b61aD58";
factoryAddress = "0x02e8910B3B89690d4aeC9fcC0Ae2cD16fB6A4828";
swapRouterAddress = "0x564Db7a11653228164FD03BcA60465270E67b3d7";
nftDescriptorAddress = "0x9abb5861e3a1eDF19C51F8Ac74A81782e94F8FdC";
positionDescriptorAddress = "0x484242986F57dFcA98EeC2C78427931C63F1C4ce";
positionManagerAddress = "0x9DBb24B10502aD166c198Dbeb5AB54d2d13AfcFd";

const artifacts = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
};

const { Contract, BigNumber } = require("ethers");
const bn = require("bignumber.js");
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

const MAINNET_URL =
  "https://eth-mainnet.g.alchemy.com/v2/mCgRbSNJIhTJv5tiqIkrfcqzLHjOoz0F";

const provider = new ethers.providers.JsonRpcProvider(MAINNET_URL);

//const provider = waffle.provider;

function encodePriceSqrt(reserve1, reserve0) {
  return BigNumber.from(
    new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toString()
  );
}

const nonfungiblePositionManager = new Contract(
  positionManagerAddress,
  artifacts.NonfungiblePositionManager.abi,
  provider
);

const factory = new Contract(
  factoryAddress,
  artifacts.UniswapV3Factory.abi,
  provider
);

async function deployPool(token0, token1, fee, price) {
  const [owner] = await ethers.getSigners();
  await nonfungiblePositionManager
    .connect(owner)
    .createAndInitializePoolIfNecessary(token0, token1, fee, price, {
      gasLimit: 5000000,
    });
  const poolAddress = await factory.connect(owner).getPool(token0, token1, fee);
  return poolAddress;
}

async function main() {
  const shoRay = await deployPool(
    shoaibAddress,
    rayyanAddress,
    500,
    encodePriceSqrt(1, 1)
  );
  console.log("SHO_RAY=", `"${shoRay}"`);
}

/*
npx hardhat run --network localhost scripts/deployPool.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
