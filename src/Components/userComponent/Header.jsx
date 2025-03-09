import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import MenuSidebar from "./MenuSideBar";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      // Close sidebar when screen width becomes large (sm breakpoint and above)
      if (window.innerWidth >= 640) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <MenuSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <nav className=" flex justify-between items-center py-4 px-4 sm:px-14">
        {/* 'Menu Button' */}
        <div className=" sm:hidden">
          <button onClick={toggleSidebar}>
            <svg
              width="23"
              height="14"
              viewBox="0 0 23 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.75999 8H20.76C21.0412 8 21.2756 7.90625 21.4631 7.71875C21.6662 7.51562 21.7678 7.27344 21.7678 6.99219C21.7678 6.72656 21.6662 6.5 21.4631 6.3125C21.2756 6.10938 21.0412 6.00781 20.76 6.00781H2.75999C2.47874 6.00781 2.23655 6.10938 2.03343 6.3125C1.84593 6.5 1.75218 6.72656 1.75218 6.99219C1.75218 7.27344 1.84593 7.51562 2.03343 7.71875C2.23655 7.90625 2.47874 8 2.75999 8ZM2.75999 2H20.76C21.0412 2 21.2756 1.90625 21.4631 1.71875C21.6662 1.51563 21.7678 1.27344 21.7678 0.992188C21.7678 0.726562 21.6662 0.5 21.4631 0.3125C21.2756 0.109375 21.0412 0.0078125 20.76 0.0078125H2.75999C2.47874 0.0078125 2.23655 0.109375 2.03343 0.3125C1.84593 0.5 1.75218 0.726562 1.75218 0.992188C1.75218 1.27344 1.84593 1.51563 2.03343 1.71875C2.23655 1.90625 2.47874 2 2.75999 2ZM2.75999 14H20.76C21.0412 14 21.2756 13.9062 21.4631 13.7188C21.6662 13.5156 21.7678 13.2734 21.7678 12.9922C21.7678 12.7266 21.6662 12.5 21.4631 12.3125C21.2756 12.1094 21.0412 12.0078 20.76 12.0078H2.75999C2.47874 12.0078 2.23655 12.1094 2.03343 12.3125C1.84593 12.5 1.75218 12.7266 1.75218 12.9922C1.75218 13.2734 1.84593 13.5156 2.03343 13.7188C2.23655 13.9062 2.47874 14 2.75999 14Z"
                fill="#111111"
              />
            </svg>
          </button>
        </div>

        <Link to="/">
          <div className=" w-36 ">
          <svg width="100%" height="100%" viewBox="0 0 188 42" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M187.837 41.4293H177.026V41.2602L177.138 41.232C177.214 41.2132 177.308 41.1709 177.42 41.1051C177.918 40.842 178.167 40.3204 178.167 39.5405C178.167 38.9109 177.947 38.0839 177.505 37.0597L175.771 33.127H154.938L153.091 37.2993C152.715 38.2014 152.527 38.972 152.527 39.611C152.527 40.0526 152.621 40.4191 152.809 40.7104C153.007 40.9923 153.246 41.1615 153.528 41.2179L153.669 41.2602V41.4293H148.285V41.2602L148.679 41.1474C148.943 41.0816 149.286 40.9125 149.708 40.6399C150.761 39.9728 151.719 38.7793 152.584 37.0597L165.044 8.86844L161.464 0.76347H167.497L183.538 37.0597C184.036 38.037 184.534 38.8122 185.032 39.3854C185.53 39.9587 185.99 40.3815 186.413 40.654C186.836 40.9172 187.179 41.0816 187.442 41.1474L187.837 41.2602V41.4293ZM175.517 32.5632L165.354 9.57322L155.177 32.5632H175.517Z" fill="black"/>
<path d="M146.586 41.4293H135.775V41.2602L135.888 41.232C135.963 41.2132 136.057 41.1709 136.17 41.1051C136.668 40.842 136.917 40.3204 136.917 39.5405C136.917 38.9109 136.696 38.0839 136.254 37.0597L134.521 33.127H113.687L111.841 37.2993C111.465 38.2014 111.277 38.972 111.277 39.611C111.277 40.0526 111.371 40.4191 111.559 40.7104C111.756 40.9923 111.996 41.1615 112.278 41.2179L112.419 41.2602V41.4293H107.034V41.2602L107.429 41.1474C107.692 41.0816 108.035 40.9125 108.458 40.6399C109.51 39.9728 110.469 38.7793 111.333 37.0597L123.794 8.86844L120.213 0.76347H126.246L142.287 37.0597C142.785 38.037 143.283 38.8122 143.781 39.3854C144.279 39.9587 144.74 40.3815 145.163 40.654C145.586 40.9172 145.929 41.0816 146.192 41.1474L146.586 41.2602V41.4293ZM134.267 32.5632L124.104 9.57322L113.927 32.5632H134.267Z" fill="black"/>
<path d="M105.195 41.4011H98.2317L86.3068 25.8396H80.6686V37.7081C80.7532 38.8921 81.0116 39.7848 81.4438 40.3862C81.7634 40.8185 82.0969 41.0863 82.4446 41.1897L82.6279 41.232V41.4011H73.1697V41.232L73.353 41.1897C73.7007 41.0863 74.0343 40.8185 74.3538 40.3862C74.7954 39.7942 75.0585 38.9015 75.1431 37.7081V4.44243C75.0585 3.28659 74.8095 2.41266 74.396 1.82064C74.0671 1.35079 73.7242 1.06418 73.3671 0.960813L73.1697 0.90443V0.735283H93.4815C95.1636 0.735283 96.7611 1.05008 98.274 1.67969C99.7963 2.30929 101.154 3.22081 102.348 4.41424C103.541 5.60766 104.453 6.96554 105.082 8.48787C105.712 10.0102 106.027 11.6077 106.027 13.2804C106.027 14.9625 105.712 16.5647 105.082 18.087C104.453 19.6093 103.541 20.9672 102.348 22.1606C101.154 23.354 99.7963 24.2656 98.274 24.8952C96.7611 25.5248 95.1636 25.8396 93.4815 25.8396H93.2701L105.195 41.4011ZM92.7626 25.2757L92.7908 25.2616C94.1346 24.82 95.3327 24.0259 96.3852 22.8795C97.4471 21.7236 98.2787 20.3282 98.8801 18.6931C99.4909 17.0486 99.7963 15.2679 99.7963 13.3509C99.7963 11.3587 99.4674 9.51685 98.8096 7.82537C98.1612 6.1339 97.2779 4.71964 96.1597 3.5826C95.0414 2.43615 93.7728 1.67499 92.3538 1.29911H81.8667C81.1807 1.82534 80.7814 2.87312 80.6686 4.44243V25.2757H92.7626Z" fill="black"/>
<path d="M50.9624 41.7535C49.4307 41.7535 47.9036 41.5844 46.3813 41.2461C43.7783 40.6352 41.3774 39.5593 39.1785 38.0182C36.9795 36.477 35.1471 34.5835 33.6812 32.3376C32.1682 30.0166 31.1722 27.4746 30.6929 24.7119C30.4768 23.5091 30.3687 22.3063 30.3687 21.1034C30.3687 19.5717 30.5426 18.0494 30.8902 16.5365C31.4917 13.9241 32.5629 11.5184 34.104 9.3195C35.6546 7.11119 37.5481 5.27876 39.7846 3.82222C42.1244 2.31869 44.6663 1.3226 47.4103 0.833949C48.6131 0.627213 49.8112 0.523846 51.0047 0.523846C52.5458 0.523846 54.0775 0.697692 55.5998 1.04538C58.2028 1.6468 60.6085 2.71806 62.8168 4.25918C65.0251 5.7909 66.8528 7.68441 68.3 9.93971C69.8129 12.2608 70.809 14.8027 71.2883 17.5654C71.5044 18.7683 71.6125 19.9711 71.6125 21.1739C71.6125 22.7056 71.4386 24.228 71.0909 25.7409C70.4895 28.3533 69.4135 30.7636 67.863 32.9719C66.3219 35.1708 64.4331 36.9986 62.1966 38.4551C59.8567 39.9587 57.3148 40.9547 54.5709 41.4434C53.368 41.6501 52.1652 41.7535 50.9624 41.7535ZM52.6116 41.0769C53.1754 41.0769 53.7956 41.0111 54.4722 40.8796C54.7823 40.8326 55.0924 40.7715 55.4025 40.6963C57.4511 40.1137 59.2271 39.0049 60.7306 37.3698C62.2436 35.7253 63.4182 33.7002 64.2545 31.2946C65.1003 28.8889 65.5231 26.2765 65.5231 23.4574C65.5231 21.8881 65.3822 20.2812 65.1003 18.6367C64.4801 15.2444 63.3806 12.242 61.8019 9.62961C60.2232 7.01722 58.3391 4.95926 56.1496 3.45573C53.9601 1.9428 51.6625 1.18634 49.2568 1.18634L48.8199 1.20043C47.8238 1.3226 46.8982 1.49174 46.043 1.70788C44.079 2.36567 42.3735 3.51681 40.9263 5.1613C39.4886 6.79639 38.3703 8.79327 37.5716 11.1519C36.7728 13.5106 36.3734 16.0619 36.3734 18.8058C36.3734 20.3752 36.5144 21.9821 36.7963 23.6265C37.4165 27.0189 38.516 30.0213 40.0947 32.6336C41.6734 35.246 43.5528 37.3087 45.7329 38.8216C47.9224 40.3251 50.2153 41.0769 52.6116 41.0769Z" fill="black"/>
<path d="M24.1317 41.4152H14.6735V41.2461L14.8568 41.1897C14.9789 41.1615 15.1293 41.0863 15.3078 40.9641C15.4864 40.842 15.6696 40.654 15.8575 40.4003C16.0455 40.1372 16.2099 39.7895 16.3509 39.3572C16.4918 38.925 16.5858 38.3752 16.6328 37.7081V21.0893L5.24355 4.80891C4.59515 3.95378 3.96085 3.26779 3.34064 2.75095C2.72983 2.23411 2.17071 1.84413 1.66327 1.58102C1.16522 1.3085 0.765846 1.12996 0.46514 1.04538L-1.52588e-05 0.918522V0.749374H11.5161V0.918522L11.4315 0.960809C11.3657 0.989 11.2906 1.04068 11.206 1.11586C11.1308 1.18164 11.0556 1.28031 10.9805 1.41187C10.9147 1.53403 10.8724 1.69378 10.8536 1.89112V2.03207C10.8536 2.20122 10.8771 2.40796 10.9241 2.65228C11.0462 3.2349 11.4174 3.98197 12.0376 4.89348C15.4018 9.70478 18.7706 14.5114 22.1442 19.3133L32.0816 5.11901C32.4481 4.60217 32.73 4.14172 32.9273 3.73764C33.2562 3.07045 33.4207 2.51602 33.4207 2.07436C33.4207 2.02738 33.416 1.9428 33.4066 1.82064C33.4066 1.68908 33.3737 1.55752 33.3079 1.42596C33.2421 1.2944 33.167 1.19104 33.0824 1.11586C32.9978 1.04068 32.9273 0.989 32.8709 0.960809L32.7723 0.918522V0.749374H38.2273V0.918522L37.748 1.04538C37.4285 1.13935 37.0057 1.33199 36.4794 1.6233C35.9532 1.90521 35.3659 2.32808 34.7175 2.89191C34.0785 3.45573 33.4301 4.1981 32.7723 5.11901L22.1583 20.2718V37.7081C22.2053 38.3752 22.2992 38.925 22.4402 39.3572C22.5905 39.7895 22.7597 40.1372 22.9476 40.4003C23.1356 40.654 23.3188 40.842 23.4974 40.9641C23.6759 41.0863 23.8263 41.1615 23.9484 41.1897L24.1317 41.2461V41.4152Z" fill="black"/>
</svg>

          </div>
        </Link>
        <div className=" sm:block hidden">
          <ul className=" flex gap-8">
            <Link to="/collections">
            
            <li className="  hover:text-[#909090]  hover:cursor-pointer ">
            COLLECTIONS
            </li>
            </Link>
            <Link to="/products">
              <li className=" hover:text-[#909090] hover:cursor-pointer">
              NEW ARRIVALS      
                   </li>
            </Link>
          </ul>
        </div>

        <div className="flex sm:gap-5 gap-2">
          {/* "Profile Btn" */}
          <div className=" sm:block hidden">
            <Link to="/login">
            
            <button className=" hover:text-[#909090]">
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16.8927 15.7682C16.0329 14.3137 14.8061 13.1078 13.3338 12.27C11.8614 11.4322 10.1946 10.9914 8.49845 10.9914C6.80225 10.9914 5.13546 11.4322 3.66314 12.27C2.19082 13.1078 0.964024 14.3137 0.104236 15.7682C-0.00102398 15.9568 -0.027822 16.179 0.0295835 16.387C0.0566587 16.493 0.106188 16.592 0.174854 16.6774C0.243521 16.7627 0.329737 16.8325 0.427728 16.8821C0.554141 16.9534 0.697158 16.9903 0.842462 16.9894C0.986554 16.9954 1.12952 16.9616 1.25545 16.8917C1.38138 16.8218 1.48536 16.7185 1.5558 16.5933C2.26752 15.3886 3.2833 14.3898 4.50251 13.6958C5.72172 13.0018 7.10204 12.6367 8.50674 12.6367C9.91144 12.6367 11.2918 13.0018 12.511 13.6958C13.7302 14.3898 14.746 15.3886 15.4577 16.5933C15.5685 16.7806 15.7491 16.9169 15.9603 16.9725C16.1715 17.0281 16.3963 16.9986 16.5858 16.8903C16.6801 16.8403 16.7628 16.7711 16.8285 16.6872C16.8943 16.6034 16.9415 16.5067 16.9673 16.4035C16.998 16.298 17.0072 16.1874 16.9944 16.0783C16.9816 15.9692 16.947 15.8638 16.8927 15.7682Z"></path>
                <path d="M8.49966 10.2C9.83622 10.2002 11.1195 9.67091 12.0732 8.72594C13.027 7.78097 13.5752 6.49588 13.5997 5.14718C13.5997 3.78206 13.0623 2.47286 12.1059 1.50757C11.1495 0.542291 9.85226 0 8.49966 0C7.14705 0 5.84985 0.542291 4.89341 1.50757C3.93698 2.47286 3.39966 3.78206 3.39966 5.14718C3.42416 6.49588 3.97228 7.78097 4.92607 8.72594C5.87987 9.67091 7.1631 10.2002 8.49966 10.2ZM5.09966 5.14718C5.09966 4.2371 5.45787 3.3643 6.09549 2.72078C6.73312 2.07725 7.59792 1.71573 8.49966 1.71573C9.40139 1.71573 10.2662 2.07725 10.9038 2.72078C11.5414 3.3643 11.8997 4.2371 11.8997 5.14718C11.8997 6.05726 11.5414 6.93006 10.9038 7.57359C10.2662 8.21711 9.40139 8.57864 8.49966 8.57864C7.59792 8.57864 6.73312 8.21711 6.09549 7.57359C5.45787 6.93006 5.09966 6.05726 5.09966 5.14718Z"></path>
              </svg>
            </button>
            </Link>
          </div>
          {/* "Search Btn" */}
          <div>
            <button className=" hover:text-[#909090]">
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.9 11.731C11.8 11.731 11.8 11.731 11.9 11.731C11.8 11.8304 11.8 11.8304 11.8 11.8304C11.3 12.3275 10.7 12.7251 9.9 13.0234C9.2 13.3216 8.4 13.4211 7.6 13.4211C6.8 13.4211 6 13.2222 5.3 12.924C4.6 12.6257 4 12.2281 3.4 11.6316C2.9 11.1345 2.4 10.4386 2.1 9.74269C1.8 9.1462 1.7 8.45029 1.7 7.65497C1.7 6.85965 1.9 6.06433 2.2 5.36842C2.5 4.5731 2.9 3.97661 3.4 3.38012C4 2.88304 4.6 2.48538 5.3 2.18713C6 1.88889 6.8 1.69006 7.6 1.69006C8.4 1.69006 9.2 1.88889 9.9 2.18713C10.6 2.48538 11.3 2.88304 11.8 3.47953C12.3 3.97661 12.7 4.67251 13.1 5.36842C13.4 6.06433 13.6 6.76023 13.6 7.65497C13.6 8.45029 13.4 9.24561 13.1 9.94152C12.8 10.538 12.4 11.1345 11.9 11.731ZM16.7 15.4094L13.6 12.3275C14.1 11.6316 14.5 10.9357 14.8 10.1404C15.1 9.34503 15.2 8.45029 15.2 7.55556C15.2 6.46199 15 5.46784 14.6 4.5731C14.2 3.67836 13.7 2.88304 13 2.18713C12.3 1.49123 11.5 0.994152 10.6 0.596491C9.7 0.19883 8.7 0 7.6 0C6.6 0 5.6 0.19883 4.6 0.596491C3.7 0.994152 2.9 1.49123 2.2 2.18713C1.5 2.88304 1 3.67836 0.6 4.67251C0.2 5.56725 0 6.5614 0 7.65497C0 8.64912 0.2 9.64327 0.6 10.6374C1 11.5322 1.6 12.3275 2.3 13.0234C3 13.7193 3.8 14.2164 4.7 14.7134C5.6 15.0117 6.6 15.2105 7.6 15.2105C8.5 15.2105 9.4 15.1111 10.2 14.8129C11 14.5146 11.8 14.117 12.4 13.6199L15.5 16.7018C15.7 16.9006 15.9 17 16.1 17C16.3 17 16.5 16.9006 16.7 16.7018C16.9 16.5029 17 16.3041 17 16.1053C17 15.807 16.9 15.6082 16.7 15.4094Z"></path>
              </svg>
            </button>
          </div>
          {/* "Wishlist Btn" */}
          <Link to="/wishlist">
            <div className=" sm:block hidden relative">
              <button className=" hover:text-[#909090]">
                <svg
                  width="21"
                  height="17"
                  viewBox="0 0 14 13"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.7441 2.26562C11.9993 2.52083 12.1908 2.8125 12.3184 3.14062C12.446 3.45964 12.5098 3.78776 12.5098 4.125C12.5098 4.46224 12.446 4.79492 12.3184 5.12305C12.1908 5.44206 11.9993 5.72917 11.7441 5.98438L7 10.7285L2.25586 5.98438C2.00065 5.72917 1.80924 5.44206 1.68164 5.12305C1.55404 4.79492 1.49023 4.46224 1.49023 4.125C1.49023 3.78776 1.55404 3.45964 1.68164 3.14062C1.80924 2.8125 2.00065 2.52083 2.25586 2.26562C2.51107 2.01042 2.79818 1.81901 3.11719 1.69141C3.44531 1.5638 3.77799 1.5 4.11523 1.5C4.45247 1.5 4.7806 1.5638 5.09961 1.69141C5.41862 1.81901 5.71029 2.01042 5.97461 2.26562L6.58984 2.88086C6.69922 2.99935 6.83594 3.05859 7 3.05859C7.16406 3.05859 7.30078 2.99935 7.41016 2.88086L8.02539 2.26562C8.28971 2.01042 8.58138 1.81901 8.90039 1.69141C9.2194 1.5638 9.54753 1.5 9.88477 1.5C10.222 1.5 10.5501 1.5638 10.8691 1.69141C11.1973 1.81901 11.4889 2.01042 11.7441 2.26562ZM12.5645 1.44531C12.1999 1.07161 11.7806 0.79362 11.3066 0.611328C10.8418 0.429036 10.3678 0.337891 9.88477 0.337891C9.40169 0.337891 8.92773 0.429036 8.46289 0.611328C7.99805 0.79362 7.57878 1.07161 7.20508 1.44531L7 1.65039L6.79492 1.44531C6.42122 1.07161 6.00195 0.79362 5.53711 0.611328C5.07227 0.429036 4.59831 0.337891 4.11523 0.337891C3.63216 0.337891 3.15365 0.429036 2.67969 0.611328C2.21484 0.79362 1.80013 1.07161 1.43555 1.44531C1.06185 1.8099 0.779297 2.22917 0.587891 2.70312C0.405599 3.16797 0.314453 3.64193 0.314453 4.125C0.314453 4.60807 0.405599 5.08659 0.587891 5.56055C0.779297 6.02539 1.06185 6.4401 1.43555 6.80469L6.58984 11.959C6.69922 12.0775 6.83594 12.1367 7 12.1367C7.16406 12.1367 7.30078 12.0775 7.41016 11.959L12.5645 6.80469C12.9382 6.4401 13.2161 6.02539 13.3984 5.56055C13.5898 5.08659 13.6855 4.60807 13.6855 4.125C13.6855 3.64193 13.5898 3.16797 13.3984 2.70312C13.2161 2.23828 12.9382 1.81901 12.5645 1.44531Z"></path>
                </svg>
              </button>
              <span className="absolute -top-1 left-3 bg-[#757575] text-white text-xs font-light rounded-full w-[17px] h-[17px] flex items-center justify-center">
                {2}
              </span>
            </div>
          </Link>

          {/* "Cart Btn" */}
          <Link to="/cart">
            <div className=" relative">
              <button className=" hover:text-[#909090]">
                <svg
                  width="21"
                  height="17"
                  viewBox="0 0 21 17"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14.3699 15.3407C14.1509 15.3407 13.941 15.2535 13.7862 15.0982C13.6314 14.943 13.5444 14.7324 13.5444 14.5128H11.8936C11.8936 15.1715 12.1545 15.8032 12.6189 16.269C13.0832 16.7347 13.7131 16.9964 14.3699 16.9964C15.0266 16.9964 15.6565 16.7347 16.1209 16.269C16.5853 15.8032 16.8462 15.1715 16.8462 14.5128H15.1953C15.1953 14.7324 15.1083 14.943 14.9535 15.0982C14.7987 15.2535 14.5888 15.3407 14.3699 15.3407Z"></path>
                  <path d="M8.5612 15.3407C8.34228 15.3407 8.13233 15.2535 7.97753 15.0982C7.82273 14.943 7.73576 14.7324 7.73576 14.5128H6.07715C6.07715 14.8395 6.14129 15.1629 6.26592 15.4646C6.39055 15.7664 6.57322 16.0406 6.8035 16.2715C7.03378 16.5025 7.30717 16.6857 7.60805 16.8107C7.90893 16.9357 8.23141 17 8.55707 17C8.88274 17 9.20522 16.9357 9.5061 16.8107C9.80698 16.6857 10.0804 16.5025 10.3106 16.2715C10.5409 16.0406 10.7236 15.7664 10.8482 15.4646C10.9729 15.1629 11.037 14.8395 11.037 14.5128H9.38612C9.38612 14.7323 9.29923 14.9428 9.14454 15.098C8.98985 15.2533 8.78003 15.3406 8.5612 15.3407Z"></path>
                  <path d="M19.3299 1.64401C19.2849 1.63633 19.2393 1.63252 19.1937 1.63263H5.9867C5.76778 1.63263 5.55782 1.71985 5.40302 1.8751C5.24823 2.03035 5.16126 2.24092 5.16126 2.46047C5.16126 2.68003 5.24823 2.8906 5.40302 3.04585C5.55782 3.2011 5.76778 3.28832 5.9867 3.28832H18.2192L18.001 4.60149L16.8438 11.5668H6.07595L3.26946 4.60149L1.59537 0.482961C1.50684 0.289212 1.34721 0.13717 1.14972 0.0584856C0.952225 -0.020199 0.732083 -0.0194636 0.535118 0.0605389C0.338153 0.140541 0.179541 0.293646 0.0922992 0.487983C0.00505767 0.682319 -0.00409102 0.902913 0.0667575 1.10384L2.73963 7.68158L4.56385 12.5307C4.6985 12.9389 4.97657 13.2224 5.37794 13.2224H17.5428C17.7383 13.2225 17.9275 13.1531 18.0766 13.0264C18.2258 12.8997 18.3253 12.724 18.3574 12.5307L19.675 4.60149L20.0083 2.59655C20.0443 2.38002 19.993 2.15803 19.8658 1.9794C19.7386 1.80077 19.5458 1.68013 19.3299 1.64401Z"></path>
                </svg>
              </button>
              <span className="absolute -top-1 left-3 bg-[#757575] text-white text-xs font-light rounded-full w-[17px] h-[17px] flex items-center justify-center">
                {2}
              </span>
            </div>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Header;
