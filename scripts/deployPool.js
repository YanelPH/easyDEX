//Token addresses
shoaibAddress = "0x0D92d35D311E54aB8EEA0394d7E773Fc5144491a";
rayyanAddress = "0x24EcC5E6EaA700368B8FAC259d3fBD045f695A08";
popUpAddress = "0x876939152C56362e17D508B9DEA77a3fDF9e4083";

//Uniswap contract address
wethAddress = "0xD56e6F296352B03C3c3386543185E9B8c2e5Fd0b";
factoryAddress = "0xEC7cb8C3EBE77BA6d284F13296bb1372A8522c5F";
swapRouterAddress = "0x3C2BafebbB0c8c58f39A976e725cD20D611d01e9";
nftDescriptorAddress = "0x5f246ADDCF057E0f778CD422e20e413be70f9a0c";
positionDescriptorAddress = "0xaD82Ecf79e232B0391C5479C7f632aA1EA701Ed1";
positionManagerAddress = "0x4Dd5336F3C0D70893A7a86c6aEBe9B953E87c891";

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
