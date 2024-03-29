import React from "react";
import Image from "next/image";

//Internal Import
import Style from "./PoolConnect.module.css";
import images from "../../assets";

const PoolConnect = ({ setClosePool, getAllLiquidity, account }) => {
  console.log(getAllLiquidity);

  let tokenList = [];
  for (let i = 0; i < getAllLiquidity.length; i++) {
    if (i % 2 == 1) tokenList.push(getAllLiquidity[i]);
  }
  console.log("TOTOTO", tokenList);
  return (
    <div className={Style.PoolConnect}>
      <div className={Style.PoolConnect_box}>
        <div className={Style.PoolConnect_box_header}>
          <h2>Pool</h2>
          <p onClick={() => setClosePool(true)}>+ New Position</p>
        </div>

        {!account ? (
          <div className={Style.PoolConnect_box_Middle}>
            <Image src={images.wallet} alt="wallet" height={80} width={80} />
            <p>Your active V3 liquidity positions will appear here.</p>
            <button>Connect Wallet</button>
          </div>
        ) : (
          <div className={Style.PoolConnect_box_liquidity}>
            <div className={Style.PoolConnect_box_liquidity_header}>
              <p>Your position {tokenList.length}</p>
            </div>
            {tokenList.map((element, index) => (
              <div className={Style.PoolConnect_box_liquidity_box}>
                <div className={Style.PoolConnect_box_liquidity_list}>
                  <p>
                    <small className={Style.mark}>
                      {element.poolExample.token0.name}
                    </small>{" "}
                    <small className={Style.mark}>
                      {element.poolExample.token1.name}
                    </small>{" "}
                    <span className={(Style.paragraph, Style.hide)}>
                      {element.poolExample.token0.name} /
                      {element.poolExample.token1.name}
                    </span>{" "}
                    <span className={Style.paragraph}>{element.fee}</span>{" "}
                  </p>
                  <p className={Style.highlight}>In Range</p>
                </div>
                <div className={Style.PoolConnect_box_liquidity_list_info}>
                  <p>
                    <small>Min: 0.999</small>{" "}
                    <span>
                      {element.poolExample.token0.name} per {""}{" "}
                      {element.poolExample.token1.name}
                    </span>
                    {""} <span>--------</span> <small>Max: 1.000</small>
                    {""}
                    <span className={Style.hide}>
                      {element.poolExample.token0.name} per {""}{" "}
                      {element.poolExample.token1.name}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={Style.PoolConnect_box_info}>
          <div className={Style.PoolConnect_box_info_left}>
            <h5>Learn about providing liquidity</h5>
            <p>Check out our v3 LP walkthrough and migrade guide</p>
          </div>
          <div className={Style.PoolConnect_box_info_right}>
            <h5>Top pools</h5>
            <p>Explore Uniswap Analyrics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolConnect;
