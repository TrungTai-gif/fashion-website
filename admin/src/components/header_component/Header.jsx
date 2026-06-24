import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { AiOutlineMenuFold } from "react-icons/ai";
import { BsMoonStarsFill } from "react-icons/bs";
import { ShopContext } from "@/context/ShopContext";
import { authService } from "@/services/authService";
const Header = ({ toggleSidebar }) => {
  const { logout } = useContext(ShopContext);
  const { logout: logoutApi } = authService();
  const refreshToken = localStorage.getItem("refreshToken");

  const handleLogout = async () => {
    if (refreshToken) {
      await logoutApi(refreshToken);
    }
    logout();
  };

  return (
    <div className="sticky top-0 z-5  bg-indigo-900  px-2 ">
      <div className="flex items-center justify-between px-2 sm:px-5 lg:px-10 ">
        {/* Desktop Logo */}
        <div className="flex text-gray-200 items-center space-x-4">
          <div className="flex lg:hidden items-center space-x-5">
            <button onClick={toggleSidebar} className="p-2">
              <AiOutlineMenuFold className="w-8 h-8" />
            </button>
          </div>
          {/* <div className="inline-flex items-center gap-1 cursor-pointer">
            <img
              className=" w-15 sm:w-10 hidden lg:block border rounded-full"
              src={assets.logo}
              alt=""
            />
            <p className="text-2xl text-pink-600 font-bold">FIT ME</p>
          </div> */}
        </div>

        <div className="flex items-center justify-between ">
          <div className="flex items-center space-x-5 ml-6">
            <Link>
              <BsMoonStarsFill className="text-gray-300 w-5 h-5" />
            </Link>
            <Link to={"/profile"}>
              <CgProfile className="text-gray-300 w-7 h-7" />
            </Link>
            <Link
              to={"/login"}
              onClick={handleLogout}
              className="flex items-center p-3 bg-yellow-500 text-white  hover:bg-red-500   transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
              <svg
                className="shrink-0 w-5 h-5 transition-all duration-300 group-hover:text-white text-gray-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
