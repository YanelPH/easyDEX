import { ethers, BigNumber } from "ethers";
import { axios } from "axios";
import Web3Modal from "web3modal";

const bn = require("bignumber.js");
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

const UNISWAP_V3_FACTORY_ADDRESS = "0xEC7cb8C3EBE77BA6d284F13296bb1372A8522c5F";
const NON_FUNGIBLE_MANAGER = "0x4Dd5336F3C0D70893A7a86c6aEBe9B953E87c891";
const artifacts = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
};

export const fetchPoolContract = (signerOrProvider) =>
  new ethers.Contract(
    UNISWAP_V3_FACTORY_ADDRESS,
    artifacts.UniswapV3Factory.abi,
    signerOrProvider
  );

export const fetchPositionContract = (signerOrProvider) =>
  new ethers.Contract(
    NON_FUNGIBLE_MANAGER,
    artifacts.NonfungiblePositionManager.abi,
    signerOrProvider
  );

const encodePriceSqrt = (reserve1, reserve0) => {
  return BigNumber.from(
    new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toString()
  );
};

export const connectingWithPoolContract = async (
  address1,
  address2,
  fee,
  tokenFee1,
  tokenFee2
) => {
  const web3modal = new Web3Modal();
  const connection = await web3modal.connect();
  console.log(connection);
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();

  console.log(signer);

  const createPoolContract = await fetchPositionContract(signer);

  const price = encodePriceSqrt(tokenFee1, tokenFee2);
  console.log(price);
  const transaction = await createPoolContract
    .connect(signer)
    .createAndInitializePoolIfNecessary(address1, address2, fee, price, {
      gasLimit: 30000000,
    });

  await transaction.wait();
  console.log(transaction);

  const factory = await fetchPoolContract(signer);
  const poolAddress = await factory.getPool(address1, address2, fee);

  return poolAddress;
};
