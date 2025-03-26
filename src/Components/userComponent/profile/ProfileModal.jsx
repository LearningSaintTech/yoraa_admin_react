import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../../slice/profileSlice"; // Adjust the path as needed
import profileBg from "../../../Assets/profileBg.png";

const ProfileModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.profile.user); // Get user from Redux

  // Handle logout
  const handleLogout = () => {
    dispatch(setUser(null)); // Clear user data
    navigate("/login"); // Redirect to login page
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-[350px] h-full flex flex-col shadow-lg">
        {/* Header */}
        <div className="flex   p-4 border-b border-gray-200">
          <button onClick={onClose} className="text-gray-600  hover:text-gray-800">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* User Info Section with Background Image */}
        <div
          className=" text-white px-2 py-16 flex items-center relative overflow-hidden"
          style={{
            backgroundImage: `url(${profileBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderRadius:"20px",
            margin:"18px"
          }}
        >
          <img
            src={
              user?.imageUrl ||
              "https://via.placeholder.com/50" // Default placeholder if no image
            }
            alt="Profile"
            className="w-14 h-14 rounded-full border-2 border-white object-cover z-10"
          />
          <div className="ml-4 z-10">
            <h3 className="text-xl font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              {user?.name || "JOHN SMITH"}
            </h3>
            <p className="text-sm text-gray-200 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              Style Preference Here
            </p>
          </div>
          {/* Large "Y" Letter for Design */}
          
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-3">
          <Link to="/update-profile" onClick={onClose}>
            <button className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors">
              UPDATE PROFILE
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full bg-white border border-gray-300 py-3 rounded-md font-medium text-gray-900 hover:bg-gray-100 transition-colors"
          >
            LOG OUT
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2 flex-1">
          {[
            { label: "TRACK ORDERS", link: "/allOrders", icon: "M9 17v-2h6v2m-6 0H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4m-6 0h6" },
            { label: "RETURN/REFUND ORDER", link: "/return-refund", icon: "M3 10h10a8 8 0 018 8v2M3 10l6 6m0-12l-6 6" },
            { label: "EXCHANGE ORDER", link: "/exchange", icon: "M3 10h10a8 8 0 018 8v2M3 10l6 6m0-12l-6 6" },

            { label: "CONTACT US", link: "/contact-us", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
            { label: "INVITE A FRIEND", link: "/invite-friend", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v2h5m-2-8h14M5 12a5 5 0 110-10 5 5 0 010 10zm14 0a5 5 0 110-10 5 5 0 010 10z" },
            { label: "REFUND", link: "/refund", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.686 1M12 8c-1.11 0-2.08.402-2.686 1m-2.686 7C7.92 16.598 9.11 17 10 17m4-2c.89 0 2.08-.402 2.686-1M4 12h16" },
            { label: "TERMS & CONDITIONS", link: "/terms-conditions", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
          ].map((item, index) => (
            <Link to={item.link} key={index} onClick={onClose}>
              <div className="flex items-center justify-between text-gray-700 hover:text-black py-2 border-b border-gray-200 last:border-b-0">
                <span className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5" // Increased stroke width for sharpness
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={item.icon}
                    />
                  </svg>
                  <span className="text-sm font-medium tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">
                    {item.label}
                  </span>
                </span>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5" // Increased stroke width for sharpness
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;