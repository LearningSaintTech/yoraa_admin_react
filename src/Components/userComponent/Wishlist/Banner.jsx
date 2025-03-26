import React from "react";
import Banners from "../../../Assets/wishlist/wishlist.png";

const Banner = () => {
  return (
    <div className="relative w-full bg-black flex items-center justify-center overflow-hidden rounded-[2rem]">
      <img
        src={Banners}
        alt="Collections Banner"
        className="w-full h-auto"
      />
    </div>
  );
};

export default Banner;
