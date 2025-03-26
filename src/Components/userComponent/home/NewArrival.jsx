import React from "react";
import { FaTruck, FaExchangeAlt, FaHeadset, FaTshirt } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import bgImage from "../../../../src/Assets/home/newArrival.png";
import bgImage2 from "../../../../src/Assets/home/newArrival2.png";
import bgImage3 from "../../../../src/Assets/home/newArrival3.png";
import onlineMeeting from "../../../Assets/home/online-meeting.png";
import fastDelivery from "../../../Assets/home/fast-delivery.png";
import transfer from "../../../Assets/home/transfer.png";
import customerSupport from "../../../Assets/home/customer-support.png";

const NewArrivals = () => {
  const images = [bgImage, bgImage2, bgImage3];

  const settings = {
    dots: true, // Enable carousel indicators
    arrows: false,
    infinite: true,
    speed: 1000, // Transition speed in milliseconds
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // 3 seconds per slide
    cssEase: "linear",
    ltr: true, // Left-to-right flow as in your code
    appendDots: (dots) => (
      <div style={{ position: "absolute", bottom: "50px", width: "100%", textAlign: "center" }}>
        <ul style={{ margin: "0px", padding: "0" }}> {dots} </ul>
      </div>
    ),
    customPaging: (i) => (
      <button
        className="custom-dot"
        style={{
          width: "8px",
          height: "8px",
          background: "white",
          border: "1px solid #d1d1d1",
          borderRadius: "50%",
          margin: "0 4px",
          cursor: "pointer",
          padding: "0",
          outline: "none",
          transition: "background 0.3s ease",
        }}
      />
    ),
  };

  return (
    <div className="w-full  mt-10 pb-10">
      <div className="relative w-full flex justify-center overflow-hidden">
        <Slider {...settings} className="w-full">
          {images.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`New Arrivals ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </Slider>

        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="400"
            height="40"
            viewBox="0 0 512 60"
            fill="#F5F5F5"
            className=""
          >
            <path d="M106.932 60C94.8639 60 83.0759 56.3606 73.108 49.5572L0.499997 2.28882e-05L512 5.29807e-07L446.467 48.2991C436.155 55.8997 423.68 60 410.87 60L106.932 60Z" />
          </svg>
          <h2 className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-xl font-light">
            NEW ARRIVALS
          </h2>
        </div>

        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="400"
            height="40"
            viewBox="0 0 512 60"
            fill="#F5F5F5"
            className=""
          >
            <path d="M405.068 -4.07893e-06C417.136 -3.92495e-06 428.924 3.63936 438.892 10.4428L511.5 60L-2.62268e-06 60L65.5327 11.7008C75.8451 4.10029 88.3195 -8.12026e-06 101.13 -7.95681e-06L405.068 -4.07893e-06Z" />
          </svg>
          <button className="absolute top-4 left-1/2 transform -translate-x-1/2 text-lg transition">
            EXPLORE
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center sm:flex-row justify-center gap-3 mt-16">
        <div className="flex flex-col w-80 gap-2">
          <div className="flex justify-center mb-1">
            <img className="object-cover" src={onlineMeeting} alt="onlineMeeting" />
          </div>
          <h2 className="text-center text-lg font-light">VIRTUAL APPOINTMENT</h2>
          <p className="text-center text-sm font-light text-gray-500">
            Book your personal styling session with <br /> our head stylist. Set
            up a one-on-one <br /> appointment for fashion advice.
          </p>
        </div>

        <div className="flex flex-col w-80 gap-2">
          <div className="flex justify-center mb-1">
            <img className="object-cover" src={fastDelivery} alt="fastDelivery" />
          </div>
          <h2 className="text-center text-lg font-light">GLOBAL SHIPPING</h2>
          <p className="text-center text-sm font-light text-gray-500">
            We offer fast and reliable free shipping <br />
            options both within India, ensuring your <br />
            order reaches you in a timely manner.
          </p>
        </div>
        <div className="flex flex-col w-80 gap-2">
          <div className="flex justify-center mb-1">
            <img className="object-cover" src={transfer} alt="transfer" />
          </div>
          <h2 className="text-center text-lg font-light">RISK-FREE PURCHASE</h2>
          <p className="text-center text-sm font-light text-gray-500">
            We offer 4 days to exchange or return <br />
            your product, ensuring a seamless <br />
            shopping experience for our valued <br />
            customers.
          </p>
        </div>
        <div className="flex flex-col w-80 gap-2">
          <div className="flex justify-center mb-1">
            <img className="object-cover" src={customerSupport} alt="customerSupport" />
          </div>
          <h2 className="text-center text-lg font-light">ONLINE ASSISTANCE</h2>
          <p className="text-center text-sm font-light text-gray-500">
            Our friendly and knowledgeable customer <br />
            support team is available to assist you <br />
            with any queries.
          </p>
        </div>
      </div>

      <style jsx global>{`
        /* Hide all default dot elements except the custom ones */
       .slick-dots li button:before {
    font-size: 0px !important; /* Hides default dots */
  }
        .slick-dots li button {
          display: none !important;
        }
        .slick-dots li .custom-dot {
          display: inline-block !important; 
        }
        .slick-dots li.slick-active .custom-dot {
          background: #000 !important; // Darker fill for active dot
          border: none !important; // Remove border for active dot
        }
      `}</style>
    </div>
  );
};

export default NewArrivals;