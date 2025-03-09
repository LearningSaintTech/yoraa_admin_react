import React, { useState } from "react";
import { Link } from 'react-router-dom';

const Footer = () => {
  const [isShow, setIsShow] = useState({
    social: false,
    brand: false,
    cservices: false,
  });

  return (
    <>
      <div className=" mt-[50px] sm:hidden block">
        <div className=" flex flex-col my-8 mx-4 bg-black rounded-xl">
          <div className=" flex flex-col text-white font-light px-3 py-2  gap-4">
            <div
              onClick={() =>
                setIsShow((prev) => ({ ...prev, social: !prev.social }))
              }
              className=" flex justify-between cursor-pointer items-center"
            >
              <h3 className=" text-sm">SOCIAL</h3>
              <div>
                <svg
                  width="46"
                  height="46"
                  viewBox="0 0 46 46"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="22.24"
                    y="28.8521"
                    width="12"
                    height="1"
                    transform="rotate(-90 22.24 28.8521)"
                    fill="white"
                  />
                  <rect
                    x="16.74"
                    y="23.3521"
                    width="1"
                    height="12"
                    transform="rotate(-90 16.74 23.3521)"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
            {isShow.social && (
              <Link
                className=" text-xs text-[#999]"
                to="mailto:contact@yoraa.in"
              >
                contact@yoraa.in
              </Link>
            )}
            <hr className="h-px  mr-3 bg-white  " />
          </div>

          <div className=" flex flex-col text-white font-light p-3 gap-4">
            <div
              onClick={() =>
                setIsShow((prev) => ({ ...prev, brand: !prev.brand }))
              }
              className=" flex justify-between cursor-pointer items-center"
            >
              <h3 className=" text-sm">BRAND</h3>
              <div>
                <svg
                  width="46"
                  height="46"
                  viewBox="0 0 46 46"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="22.24"
                    y="28.8521"
                    width="12"
                    height="1"
                    transform="rotate(-90 22.24 28.8521)"
                    fill="white"
                  />
                  <rect
                    x="16.74"
                    y="23.3521"
                    width="1"
                    height="12"
                    transform="rotate(-90 16.74 23.3521)"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
            {isShow.brand && (
              <ul className=" flex flex-col gap-3 text-xs text-[#999]">
                <Link to="/about-us">
                  <li>About Us</li>
                </Link>
                <Link to="/contact-us">
                  <li>Contact Us</li>
                </Link>

                <Link to="https://yoraa.app/">
                  <li>Terms & Conditions</li>
                </Link>
                <Link to="https://www.yoraa.co/">
                  <li>Privacy Policy</li>
                </Link>
              </ul>
            )}
            <hr className="h-px  mr-3 bg-white  " />
          </div>

          <div className=" flex flex-col text-white font-light p-3 gap-4">
            <div
              onClick={() =>
                setIsShow((prev) => ({ ...prev, cservices: !prev.cservices }))
              }
              className=" flex justify-between cursor-pointer items-center"
            >
              <h3 className=" text-sm">CLIENT SERVICES</h3>
              <div>
                <svg
                  width="46"
                  height="46"
                  viewBox="0 0 46 46"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="22.24"
                    y="28.8521"
                    width="12"
                    height="1"
                    transform="rotate(-90 22.24 28.8521)"
                    fill="white"
                  />
                  <rect
                    x="16.74"
                    y="23.3521"
                    width="1"
                    height="12"
                    transform="rotate(-90 16.74 23.3521)"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
            {isShow.cservices && (
              <ul className=" flex flex-col gap-3 text-xs text-[#999] ">
                <Link to="/refund-cancel">
                  <li>Refund And Cancel Policy</li>
                </Link>
                <li>Payment Policy</li>

                <Link to="/shipping-and-delivery">
                  <li>Shipping And Delivery Policy</li>
                </Link>
                <li>FAQs</li>
                <li>Track Order</li>
                <li>Exchange & Returns</li>
                <Link to="/remove-account">
                  <li>Delete Account</li>
                </Link>
              </ul>
            )}
            <hr className="h-px  mr-3 bg-white  " />
          </div>
          <div>
            <p className=" py-4 text-white w-full font-light text-center text-xs">
              © 2025 YORA. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* "Large Screen Footer" */}
      <div className=" hidden sm:block">
        <div className=" grid sm:grid-cols-3  mx-7 my-8 bg-black  rounded-l-2xl rounded-r-2xl">
          <div className=" min-h-64  col-span-1 rounded-l-2xl">
            <div className=" flex flex-col text-white font-light ml-6 mt-8 gap-4">
              <h3 className=" text-sm">SOCIAL</h3>
              <Link
                className=" text-xs text-[#999]"
                to="mailto:contact@yoraa.in"
              >
                contact@yoraa.in
              </Link>
            </div>
          </div>
          <div className=" min-h-64 bg-black  col-span-1">
            <div className=" flex flex-col text-white font-light ml-6 mt-8 gap-4">
              <h3 className=" text-sm">BRAND</h3>

              <ul className=" flex flex-col gap-3 text-xs text-[#999]">
                <Link to="/about-us">
                  <li>About Us</li>
                </Link>
                <Link to="/contact-us">
                  <li>Contact Us</li>
                </Link>

                <Link to="https://yoraa.app/">
                  <li>Terms & Conditions</li>
                </Link>
                <Link to="https://www.yoraa.co/">
                  <li>Privacy Policy</li>
                </Link>
              </ul>
            </div>
          </div>
          <div className=" min-h-64 bg-black col-span-1 rounded-r-2xl">
            <div className=" flex flex-col text-white font-light ml-6 mt-8 gap-4 ">
              <h3 className=" text-sm">CLIENT SERVICES</h3>

              <ul className=" flex flex-col gap-3 text-xs text-[#999] ">
                <Link to="/refund-cancel">
                  <li>Refund And Cancel Policy</li>
                </Link>
                <li>Payment Policy</li>
                <Link to="/shipping-and-delivery">
                  <li>Shipping And Delivery Policy</li>
                </Link>
                <li>FAQs</li>
                <li>Track Order</li>
                <li>Exchange & Returns</li>
                <Link to="/remove-account">
                  <li>Delete Account</li>
                </Link>
              </ul>
            </div>
          </div>

          <div className=" py-3 col-span-3 ">
            <hr className="h-px  mx-10 bg-white " />
            <p className=" py-4 pt-6 text-white w-full font-light text-center text-xs">
              © 2025 YORA. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;