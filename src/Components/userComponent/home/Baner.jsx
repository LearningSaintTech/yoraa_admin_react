import React from "react";
import fireflyImage from "../../../Assets/home/banner.svg";
import appStore from "../../../Assets/home/Apple.svg";
import googlePlay from "../../../Assets/home/Playstore.svg";

const Baner = () => {
    return (
        <div className="relative min-h-screen mx-[48px] flex items-center">
            <img
                className="absolute top-0 left-0 w-full rounded-lg h-full object-cover"
                alt="Firefly"
                src={fireflyImage}
            />


            <div className="relative z-10 text-white  max-w-[50%] pl-20">
                <h1 className="text-4xl tracking-wider
 font-bold mb-6 font-raleway leading-tight">
                    DOWNLOAD APP &<br />GET THE VOUCHER!
                </h1>
                <p className="text-xl font-light text-gray-50 opacity-25 mb-8">
                    Get <span className="font-normal ">30% off</span> for first transaction using<br />
                    <span className="font-medium">YORAA mobile app</span> for now.
                </p>

                <div className="flex gap-4 mt-6">
                    <a
                        href="https://www.apple.com/app-store/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white border border-white rounded-lg"
                    >
                        <img src={appStore} alt="App Store" className="w-6 h-auto" />
                        <div className="text-left">
                            <p className="text-xs uppercase">Download on the</p>
                            <p className="text-lg font-semibold">App Store</p>
                        </div>
                    </a>

                    <a
                        href="https://play.google.com/store"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white border border-white rounded-lg"
                    >
                        <img src={googlePlay} alt="Google Play" className="w-6 h-auto" />
                        <div className="text-left">
                            <p className="text-xs uppercase">Get it on</p>
                            <p className="text-lg font-semibold">Google Play</p>
                        </div>
                    </a>
                </div>

            </div>
        </div>
    );
};

export default Baner;