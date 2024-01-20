import React, { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import Web3Modal from "web3modal";
import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";

//INTERNAL Import
import {
  checkIfWalletConnected,
  connectWallet,
  connectingWithBooToken,
  connectingWithLIfeToken,
  connectingWithSingleSwapToken,
  connectingWithIWTHToken,
  connectingWithDAIToken,
  connectingWithUserStorageContract,
  connectingWithMultiHopContract,
} from "../Utils/appFeatures";

import { IWETHABI } from "./constants";
import ERC20 from "./ERC20.json";

import { getPrice } from "../Utils/fetchingPrice";
import { swapUpdatePrice } from "../Utils/swapUpdatePrice";
import { addLiquidityExternal } from "../Utils/addLiquidity";
import { getLiquidityData } from "../Utils/checkLiquidity";
import { connectingWithPoolContract } from "../Utils/deployPool";

export const SwapTokenContext = React.createContext();

export const SwapTokenContextProvider = ({ children }) => {
  //UseState
  const [account, setAccount] = useState("");
  const [ether, setEther] = useState("");
  const [networkConnect, setNetworkConnect] = useState("");
  const [weth9, setWeth9] = useState("");
  const [dai, setDai] = useState("");

  const [tokenData, setTokenData] = useState([]);
  const [getAllLiquidity, setGetAllLiquidity] = useState([]);

  const addToken = [
    "0xF8b299F87EBb62E0b625eAF440B73Cc6b7717dbd",
    "0xEb0fCBB68Ca7Ba175Dc1D3dABFD618e7a3F582F6",
    "0xaE2abbDE6c9829141675fA0A629a675badbb0d9F",
    // "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    // "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    // "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    // "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    // "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    // "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
    // "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    // "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    // "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
    // "0xe044814c9eD1e6442Af956a817c161192cBaE98F",
    // "0xaB837301d12cDc4b97f1E910FC56C9179894d9cf",
    // "0x4ff1f64683785E0460c24A4EF78D582C2488704f",
  ];

  //FetchDAta
  const fetchingData = async () => {
    try {
      //GET USER ACCOUNT
      const userAccount = await checkIfWalletConnected();
      setAccount(userAccount);
      console.log("TESSST");
      //Create Provider
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      //check balance
      const balance = await provider.getBalance(userAccount);
      const convertBal = BigNumber.from(balance).toString();
      const ethValue = ethers.utils.formatEther(convertBal);
      setEther(ethValue);

      //GET NETWORKNAME
      const network = await provider.getNetwork();
      setNetworkConnect(network.name);
      console.log(network);
      console.log(userAccount);
      //ALLTOKEN BALANCE AND DAta
      addToken.map(async (element, index) => {
        //Get contract
        const contract = new ethers.Contract(element, ERC20.abi, provider);
        //GETTING Balance of Token
        const userBalance = await contract.balanceOf(userAccount);
        const tokenLeft = BigNumber.from(userBalance).toString();
        const convertTokenBal = ethers.utils.formatEther(tokenLeft);

        //GET NAme and symbol
        const symbol = await contract.symbol();
        const name = await contract.name();

        tokenData.push({
          name: name,
          symbol: symbol,
          tokenBalance: convertTokenBal,
          tokenAddress: element,
        });
      });

      // //GET LIQUIDITY
      const userStorageData = await connectingWithUserStorageContract();
      const userLiquidity = await userStorageData.getAllTransactions();
      console.log(userLiquidity);

      userLiquidity.map(async (element, index) => {
        const liquidityData = await getLiquidityData(
          element.poolAddress,
          element.tokenAddress0,
          element.tokenAddress1
        );
        getAllLiquidity.push(liquidityData);
        console.log(getAllLiquidity);
      });
      // //weth Balance
      // const wethContract = await connectingWithIWTHToken();
      // const wethBal = await wethContract.balanceOf(userAccount);
      // const wethToken = BigNumber.from(wethBal).toString();
      // const convertwethTokenBal = ethers.utils.formatEther(wethToken);
      // setWeth9(convertwethTokenBal);

      // //DAI Balance
      // const daiContract = await connectingWithDAIToken();
      // const daiBal = await daiContract.balanceOf(userAccount);
      // const daiToken = BigNumber.from(daiBal).toString();
      // const convertdaiTokenBal = ethers.utils.formatEther(daiToken);
      // setDai(convertdaiTokenBal);

      //console.log(dai, weth9);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  //CREATE AND ADD LIQUIDITY
  const createLiquidityAndPool = async ({
    tokenAddress0,
    tokenAddress1,
    fee,
    tokenPrice1,
    tokenPrice2,
    slippage,
    deadline,
    tokenAmountOne,
    tokenAmountTwo,
  }) => {
    try {
      console.log(
        tokenAddress0,
        tokenAddress1,
        fee,
        tokenPrice1,
        tokenPrice2,
        slippage,
        deadline,
        tokenAmountOne,
        tokenAmountTwo
      );
      //CREATE POOL
      const createPool = await connectingWithPoolContract(
        tokenAddress0,
        tokenAddress1,
        fee,
        tokenPrice1,
        tokenPrice2,
        {
          gasLimit: 500000,
        }
      );

      const poolAddress = createPool;
      console.log(poolAddress);

      //CREATE LIQUIDITY
      const info = await addLiquidityExternal(
        tokenAddress0,
        tokenAddress1,
        poolAddress,
        fee,
        tokenAmountOne,
        tokenAmountTwo
      );
      console.log(info);

      //ADD DATA
      const userStorageData = await connectingWithUserStorageContract();

      const userLiqudity = await userStorageData.addToBlockchain(
        poolAddress,
        tokenAddress0,
        tokenAddress1
      );
    } catch (error) {
      console.log(error);
    }
  };
  //SINGLE SSWAP TOKEN
  const singleSwapToken = async ({ token1, token2, swapAmount }) => {
    console.log(
      token1.tokenAddress.tokenAddress,
      token2.tokenAddress.tokenAddress,
      swapAmount
    );
    try {
      let singleSwapToken;
      let weth;
      let dai;

      singleSwapToken = await connectingWithSingleSwapToken();
      weth = await connectingWithIWTHToken();
      dai = await connectingWithDAIToken();

      const decimals0 = 18;
      const inputAmount = swapAmount;
      const amountIn = ethers.utils.parseUnits(
        inputAmount.toString(),
        decimals0
      );

      console.log("TETETETE3", amountIn);

      await weth.deposit({ value: amountIn });
      await weth.approve(singleSwapToken.address, amountIn);
      //Swap
      const transaction = await singleSwapToken.swapExactInputSingle(
        token1.tokenAddress.tokenAddress,
        token2.tokenAddress.tokenAddress,
        amountIn,
        {
          gasLimit: 300000,
        }
      );
      await transaction.wait();
      console.log(transaction);

      const balance = await dai.balanceOf(account);
      const transferAmount = BigNumber.from(balance).toString();
      const ethValue = ethers.utils.formatEther(transferAmount);
      setDai(ethValue);
      console.log("Dai Balance:", ethValue);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SwapTokenContext.Provider
      value={{
        account,
        weth9,
        dai,
        networkConnect,
        ether,
        connectWallet,
        tokenData,
        singleSwapToken,
        getPrice,
        swapUpdatePrice,
        createLiquidityAndPool,
        getAllLiquidity,
      }}
    >
      {children}
    </SwapTokenContext.Provider>
  );
};
