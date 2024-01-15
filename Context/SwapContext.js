import React, { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import Web3Modal from "web3modal";

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
    // "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "0xae246e208ea35b3f23de72b697d47044fc594d5f",
    "0x82bbaa3b0982d88741b275ae1752db85cafe3c65",
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
  const singleSwapToken = async () => {
    try {
      let singleSwapToken;
      let weth;
      let dai;

      singleSwapToken = await connectingWithSingleSwapToken();
      weth = await connectingWithIWTHToken();
      dai = await connectingWithDAIToken();

      const amountIn = 10n ** 18n;
      await weth.deposit({ value: amountIn });
      await weth.approve(singleSwapToken.address, amountIn);
      //Swap
      await singleSwapToken.swapExactInputSingle(amountIn, {
        gasLimit: 300000,
      });
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
      }}
    >
      {children}
    </SwapTokenContext.Provider>
  );
};
