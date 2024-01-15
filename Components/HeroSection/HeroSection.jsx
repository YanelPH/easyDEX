import React, { useState, useContext } from "react";
import Image from "next/image";

//Internal Import
import Style from "./HeroSection.module.css";
import images from "../../assets";
import { Token, SearchToken } from "../index";

//Context
import { SwapTokenContext } from "../../Context/SwapContext";
import { connectWallet } from "../../Utils/appFeatures";

const HeroSection = ({ tokenData }) => {
  //USESTATE
  const [openSetting, setOpenSetting] = useState(false);
  const [openToken, setOpenToken] = useState(false);
  const [openTokensTwo, setOpenTokensTwo] = useState(false);

  const { singleSwapToken, connectWallet, account, ether, dai } =
    useContext(SwapTokenContext);

  //Token 1
  const [tokenOne, setTokenOne] = useState({
    name: "",
    images: "",
  });
  //Token2
  const [tokenTwo, setTokenTwo] = useState({
    name: "",
    images: "",
  });
  //JSX
  return (
    <div className={Style.HeroSection}>
      <div className={Style.HeroSection_box}>
        <div className={Style.HeroSection_box_heading}>
          <p>Swap</p>
          <div className={Style.HeroSection_box_heading_img}>
            <Image
              src={images.close}
              alt="image"
              width={50}
              height={50}
              onClick={() => setOpenSetting(true)}
            />
          </div>
        </div>
        <div className={Style.HeroSection_box_input}>
          <input type="text" placeholder="0" />
          <button onClick={() => setOpenToken(true)}>
            <Image
              src={tokenOne.images || images.etherlogo}
              width={20}
              height={20}
              alt="ether"
            />
            {tokenOne.name || "ETH"}
            <small>{ether.slice(0, 7)}</small>
          </button>
        </div>
        <div className={Style.HeroSection_box_input}>
          <input type="text" placeholder="0" />
          <button onClick={() => setOpenTokensTwo(true)}>
            <Image
              src={tokenTwo.images || images.etherlogo}
              width={20}
              height={20}
              alt="ether"
            />
            {tokenTwo.name || "ETH"}
            <small>{dai.slice(0, 7)}</small>
          </button>
        </div>
        {account ? (
          <button
            className={Style.HeroSection_box_btn}
            onClick={() => singleSwapToken()}
          >
            Swap
          </button>
        ) : (
          <button
            className={Style.HeroSection_box_btn}
            onClick={() => connectWallet()}
          >
            Connect Wallet
          </button>
        )}
      </div>

      {openSetting && <Token setOpenSetting={setOpenSetting} />}

      {openToken && (
        <SearchToken
          openToken={setOpenToken}
          tokens={setTokenOne}
          tokenData={tokenData}
        />
      )}
      {openTokensTwo && (
        <SearchToken
          openToken={setOpenTokensTwo}
          tokens={setTokenTwo}
          tokenData={tokenData}
        />
      )}
    </div>
  );
};

export default HeroSection;
