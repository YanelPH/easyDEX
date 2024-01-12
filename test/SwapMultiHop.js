const { expect } = require("chai");
const { ethers } = require("hardhat");

const DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";
const WETH9 = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

//writing test

describe("SwapMultiHop", () => {
  let swapMultiHop;
  let accounts;
  let weth;
  let dai;
  let usdc;

  before(async () => {
    accounts = await ethers.getSigners(1);

    const SwapMultiHop = await ethers.getContractFactory("SwapMultiHop");
    swapMultiHop = await SwapMultiHop.deploy();

    await swapMultiHop.deployed();

    weth = await ethers.getContractAt("IWETH", WETH9);
    dai = await ethers.getContractAt("IERC20", DAI);
    usdc = await ethers.getContractAt("IERC20", USDC);

    console.log("SwapMultiHop Address:", swapMultiHop.address);
    console.log("WETH Address:", weth.address);
    console.log("DAI Address:", dai.address);
    console.log("USDC Address:", usdc.address);
  });

  it("swapExactInputMultihop", async () => {
    const amountIn = 10n ** 18n;
    // Deposit WETH
    console.log("Depositing WETH...");
    await weth.deposit({ value: amountIn });
    console.log("WETH deposited.");

    console.log("Approving for Swap...");
    await weth.approve(swapMultiHop.address, amountIn);
    console.log("Approval complete.");
    //SWAP
    console.log("Swapping...");
    await swapMultiHop.swapExactInputMultihop(amountIn);
    console.log("Swap complete.");
    console.log("DAI Balance:", await dai.balanceOf(accounts[0].address));

    // console.log(weth);
    // console.log(dai);
    // console.log(usdc);
    // console.log(accounts);
    // console.log(SwapMultiHop);
  });
  it("swapExactOutputMultihop", async () => {
    const wethAmountInMax = 10n ** 18n;
    const daiAmountOut = 100n * 10n ** 18n;

    //DEPOSIT WETH
    console.log("Depositing WETH...");
    await weth.deposit({ value: wethAmountInMax });
    console.log("WETH deposited.");

    console.log("Approving for Swap...");
    await weth.approve(swapMultiHop.address, wethAmountInMax);
    console.log("Approval complete.");

    // SWAP
    console.log("Swapping...");
    await swapMultiHop.swapExactOutputMultihop(daiAmountOut, wethAmountInMax);
    console.log("Swap complete.");
    console.log(accounts[0].address);
    //   console.log(accounts[1].address);
    console.log("Dai balance", await dai.balanceOf(accounts[0].address));
    //   console.log("Dai balance", await dai.balanceOf(accounts[1].address));
  });
});
