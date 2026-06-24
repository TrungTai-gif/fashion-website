import { useContext, useEffect } from "react";
import { ShopContext } from "../../context/ShopContext";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

import { IoMdCart } from "react-icons/io";
import { useAuth } from "../../store/authStore";
import ChatProvider from "../chat_component/ChatProvider";
import { useState } from "react";

const Feature = () => {
  const { totalQuantity, navigate } = useContext(ShopContext);
  const { logout, accessToken, user } = useAuth();
  return (
    <>
      <div className="flex flex-row justify-end w-full items-center gap-6 ">
        {/* <IoSearch className="hidden" /> */}
        {/* /account */}
        <div className="relative group text-white">
          {accessToken ? (
            <button type="button">
              <FaUser className="text-2xl cursor-pointer hover:scale-110" />
            </button>
          ) : (
            <Link to="/login">
              <FaUser className="text-2xl cursor-pointer hover:scale-110" />
            </Link>
          )}

          {/* thêm container hover ổn định */}
          {accessToken && (
            <div className="absolute right-0 top-full mt-2 z-30 w-40 rounded bg-slate-100 text-gray-700 shadow-lg opacity-0 invisible scale-95 translate-y-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0">
              {/* vùng đệm vô hình để tránh mất hover */}
              <div className="absolute -top-2 left-0 w-full h-2"></div>

              <button
                onClick={() => navigate("/profile")}
                className="block w-full text-left py-2 px-4 hover:text-pink-600"
              >
                My Profile
              </button>
              <button
                onClick={() => navigate("/orders")}
                className="block w-full text-left py-2 px-4 hover:text-pink-600"
              >
                Orders
              </button>
              <button
                onClick={() => {
                  (logout(), navigate("/login"));
                }}
                className="block w-full text-left py-2 px-4 hover:text-pink-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* cart */}
        <Link to="/cart" className="relative text-white">
          <IoMdCart className="text-2xl" />

          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-orange-500 text-white aspect-square rounded-full text-[8px] ">
            {totalQuantity}
          </p>
        </Link>

        {user && <ChatProvider />}
      </div>
    </>
  );
};

export default Feature;
