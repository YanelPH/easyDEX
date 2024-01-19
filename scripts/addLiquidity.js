//Token addresses
shoaibAddress = "0x484242986F57dFcA98EeC2C78427931C63F1C4ce";
rayyanAddress = "0x9DBb24B10502aD166c198Dbeb5AB54d2d13AfcFd";
popUpAddress = "0xF8b299F87EBb62E0b625eAF440B73Cc6b7717dbd";
SHO_RAY = "0x660374c9A56bA2930D7B087BeAca54636cAfff0B";
//Uniswap contract address
wethAddress = "0x82BBAA3B0982D88741B275aE1752DB85CAfe3c65";
factoryAddress = "0x084815D1330eCC3eF94193a19Ec222C0C73dFf2d";
swapRouterAddress = "0x76a999d5F7EFDE0a300e710e6f52Fb0A4b61aD58";
nftDescriptorAddress = "0x02e8910B3B89690d4aeC9fcC0Ae2cD16fB6A4828";
positionDescriptorAddress = "0x564Db7a11653228164FD03BcA60465270E67b3d7";
positionManagerAddress = "0x9abb5861e3a1eDF19C51F8Ac74A81782e94F8FdC";

const artifacts = {
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  Shoaib: require("../artifacts/contracts/Shoaib.sol/Shoaib.json"),
  Rayyan: require("../artifacts/contracts/Rayyan.sol/Rayyan.json"),
  UniswapV3Pool: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
};

const { Contract } = require("ethers");
const { Token } = require("@uniswap/sdk-core");
const { Pool, Position, nearestUsableTick } = require("@uniswap/v3-sdk");

async function getPoolData(poolContract) {
  const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
    poolContract.tickSpacing(),
    poolContract.fee(),
    poolContract.liquidity(),
    poolContract.slot0(),
  ]);

  return {
    tickSpacing: tickSpacing,
    fee: fee,
    liquidity: liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  };
}

async function main() {
  const [owner, signer2] = await ethers.getSigners();
  const provider = waffle.provider;

  const ShoaibContract = new Contract(
    shoaibAddress,
    artifacts.Shoaib.abi,
    provider
  );
  const RayyanContract = new Contract(
    rayyanAddress,
    artifacts.Rayyan.abi,
    provider
  );

  //Approve the signer + add liquidity
  await ShoaibContract.connect(signer2).approve(
    positionManagerAddress,
    ethers.utils.parseEther("1000")
  );
  await RayyanContract.connect(signer2).approve(
    positionManagerAddress,
    ethers.utils.parseEther("1000")
  );

  const poolContract = new Contract(
    SHO_RAY,
    artifacts.UniswapV3Pool.abi,
    provider
  );

  const poolData = await getPoolData(poolContract);

  const ShoaibToken = new Token(31337, shoaibAddress, 18, "Shoaib", "SHO");
  const RayyanToken = new Token(31337, rayyanAddress, 18, "Rayyan", "RAY");

  const pool = new Pool(
    ShoaibToken,
    RayyanToken,
    poolData.fee,
    poolData.sqrtPriceX96.toString(),
    poolData.liquidity.toString(),
    poolData.tick
  );

  //Get Data

  const position = new Position({
    pool: pool,
    liquidity: ethers.utils.parseEther("1"),
    tickLower:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) -
      poolData.tickSpacing * 2,
    tickUpper:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) +
      poolData.tickSpacing * 2,
  });

  //Get Price of the pool
  const { amount0: amount0Desired, amount1: amount1Desired } =
    position.mintAmounts;

  params = {
    token0: shoaibAddress,
    token1: rayyanAddress,
    fee: poolData.fee,
    tickLower:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) -
      poolData.tickSpacing * 2,
    tickUpper:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) +
      poolData.tickSpacing * 2,
    amount0Desired: amount0Desired.toString(),
    amount1Desired: amount1Desired.toString(),
    amount0Min: 0,
    amount1Min: 0,
    recipient: signer2.address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 10,
  };

  const nonfungiblePositionManager = new Contract(
    positionManagerAddress,
    artifacts.NonfungiblePositionManager.abi,
    provider
  );

  const tx = await nonfungiblePositionManager
    .connect(signer2)
    .mint(params, { gasLimit: "1000000" });

  const receipt = await tx.wait();
  console.log(receipt);
}

/*
npx hardhat run --network localhost scripts/addLiquidity.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
