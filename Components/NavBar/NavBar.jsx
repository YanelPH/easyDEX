import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";

//Internal Import
import Style from "./NavBar.module.css";
import images from "../../assets";
import { Model, TokenList } from "../index";

//Context
import { SwapTokenContext } from "../../Context/SwapContext";

const NavBar = () => {
  const { ether, account, networkConnect, connectWallet, tokenData } =
    useContext(SwapTokenContext);
  const menuItems = [
    {
      name: "Swap",
      link: "/",
    },
    {
      name: "Tokens",
      link: "/",
    },
    {
      name: "Pools",
      link: "/",
    },
  ];

  //UseState
  const [openModel, setOpenModel] = useState(false);
  const [openTokenBox, setOpenTokenBox] = useState(false);
  //const [account, setAccount] = useState(false);

  return (
    <div className={Style.NavBar}>
      <div className={Style.NavBar_box}>
        <div className={Style.NavBar_box_left}>
          {/* LOGO Image */}
          <div className={Style.NavBar_box_left_img}>
            <Image src={images.uniswap} alt="logo" width={50} height={50} />
          </div>
          {/* MENU ITEMS */}
          <div className={Style.NavBar_box_left_menu}>
            {menuItems.map((element, index) => (
              <Link key={index + 1} href={{ pathname: `${element.name}` }}>
                <p className={Style.NavBar_box_left_menu_item}>
                  {element.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
        {/* MIDDLE SECTION */}
        <div className={Style.NavBar_box_middle}>
          <div className={Style.NavBar_box_middle_search}>
            <div className={Style.NavBar_box_middle_search_img}>
              <Image src={images.search} alt="search" width={20} height={20} />
            </div>
            {/* INPUT SECTION */}
            <input type="text" placeholder="Search Tokens" />
          </div>
        </div>
        {/* RIGHT SECTION */}
        <div className={Style.NavBar_box_right}>
          <div className={Style.NavBar_box_right_box}>
            <div className={Style.NavBar_box_right_box_img}>
              <Image src={images.ether} alt="NetWork" height={30} width={30} />
            </div>
            <p>{networkConnect}</p>
          </div>

          {account ? (
            <button onClick={() => setOpenTokenBox(true)}>
              {account.slice(0, 20)}..
            </button>
          ) : (
            <button onClick={() => setOpenModel(true)}>Connect</button>
          )}

          {openModel && (
            <Model setOpenModel={setOpenModel} connectWallet={connectWallet} />
          )}
        </div>
      </div>
      {/* TOKENLIST COMPONENT*/}
      {openTokenBox && (
        <TokenList tokenDate={tokenData} setOpenTokenBox={setOpenTokenBox} />
      )}
    </div>
  );
};

export default NavBar;
