import React, { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import Web3Modal from "web3modal";
import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";

//INTERNAL Import
import {
  checkIfWalletConnected,
  connectWallet,
  connectingWithBooToken,
  connectingWithLifeToken,
  connectingWithSingleSwapToken,
  connectingWithIWTHToken,
  connectingWithDAIToken,
} from "../Utils/appFeatures";

import { IWETHABI } from "./constants";
import ERC20 from "./ERC20.json";

import { getPrice } from "../Utils/fetchingPrice";
import { swapUpdatePrice } from "../Utils/swapUpdatePrice";

export const SwapTokenContext = React.createContext();

export const SwapTokenContextProvider = ({ children }) => {
  //UseState
  const [account, setAccount] = useState("");
  const [ether, setEther] = useState("");
  const [networkConnect, setNetworkConnect] = useState("");
  const [weth9, setWeth9] = useState("");
  const [dai, setDai] = useState("");

  const [tokenData, setTokenData] = useState([]);

  const addToken = [
    "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
    "0x50327c6c5a14DCaDE707ABad2E27eB517df87AB5",
    "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    "0x582d872A1B094FC48F5DE31D3B73F2D9bE47def1",
    "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
  ];

  //FetchDAta
  const fetchingData = async () => {
    try {
      //Get user accoutn
      const userAccount = await checkIfWalletConnected();
      setAccount(userAccount);

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
      //console.log(network);

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
          tokenddress: element,
        });

        //console.log(tokenData);
      });

      //weth Balance
      const wethContract = await connectingWithIWTHToken();
      const wethBal = await wethContract.balanceOf(userAccount);
      const wethToken = BigNumber.from(wethBal).toString();
      const convertwethTokenBal = ethers.utils.formatEther(wethToken);
      setWeth9(convertwethTokenBal);

      //DAI Balance
      const daiContract = await connectingWithDAIToken();
      const daiBal = await daiContract.balanceOf(userAccount);
      const daiToken = BigNumber.from(daiBal).toString();
      const convertdaiTokenBal = ethers.utils.formatEther(daiToken);
      setDai(convertdaiTokenBal);

      //console.log(dai, weth9);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchingData();
  }, []);

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

      console.log(amountIn);

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
      }}
    >
      {children}
    </SwapTokenContext.Provider>
  );
};
