import React from "react";
import Image from "next/image";

//Internal Import
import Style from "./TokenList.module.css";
import images from "../../assets";

const TokenList = ({ tokenDate, setOpenBox }) => {
  const data = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className={Style.TokenList}>
      <p
        className={Style.TokenList_close}
        onClick={() => setOpenTokenBox(false)}
      >
        <Image src={images.close} alt="close" width={50} height={50} />
      </p>
      <div className={Style.TokenList_title}>
        <h2>Your Token List</h2>
      </div>
      {data.map((element, index) => (
        <div className={Style.TokenList_box}>
          <div className={Style.TokenList_box_info}>
            <p className={Style.TokenList_box_info_symbol}>Hey</p>
            <p>
              <span>35</span> GOLD COIN
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TokenList;
