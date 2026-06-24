import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { NavLink, Link } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
const Navbar = () => {
  const {
    showSearch,
    setShowSearch,
    getCartCount,
    token,
    setToken,
    setCartItems,
    navigate,
  } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);

  const logout = () => {
    setToken("");
    setCartItems([]);
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div className="flex bg-black  items-center justify-center pt-3 pb-5 font-medium">
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        {/* category */}
        {/* <div className="group relative text-white">
          <p>Danh muục</p>
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 text-gray-700 bg-slate-100 rounded">
              <p className="cursor-pointer hover:text-pink-600">My Profile</p>
              <p
                // onClick={() => navigate("/orders")}
                className="cursor-pointer hover:text-pink-600"
              >
                Orders
              </p>
              <p
                // onClick={logout}
                className="cursor-pointer hover:text-pink-500"
              >
                Logout
              </p>
            </div>
          </div>
        </div> */}
        <NavLink
          to="/home"
          className="flex flex-col items-center gap-1  text-white"
        >
          <li>TRANG CHỦ</li>
          <hr className="w-2/4 border-none h-[1.5px] bg-pink-600 hidden  text-white" />
        </NavLink>

        <NavLink
          to="/collection"
          className="flex flex-col items-center  text-white gap-1"
        >
          <li>BỘ SƯU TẬP</li>
          <hr className="w-2/4 border-none h-[1.5px] bg-pink-600  hidden" />
        </NavLink>

        <NavLink
          to="/about"
          className="flex flex-col items-center gap-1  text-white"
        >
          <li>CHÚNG TÔI</li>
          <hr className="w-2/4 border-none h-[1.5px] bg-pink-600 hidden" />
        </NavLink>
        <NavLink
          to="/contact"
          className="flex flex-col items-center gap-1  text-white"
        >
          <li>LIÊN HỆ</li>
          <hr className="w-2/4 border-none h-[1.5px] bg-pink-600 hidden" />
        </NavLink>
      </ul>

      {/* sidebar menu for small screen */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all duration-300 ease-linear sm:hidden ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col gap-2 text-sm text-gray-700">
          <div
            onClick={() => setVisible(false)}
            className="flex flex-row items-center gap-4 p-3 cursor-pointer"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>

          <NavLink
            onClick={() => setVisible(false)}
            to="/home"
            className="py-2 pl-6 border bg-gray-400 hover:bg-gray-300 hover:text-black"
          >
            HOME
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            to="/collection"
            className="py-2 pl-6 border bg-gray-400 hover:bg-gray-300  hover:text-black"
          >
            COLLECTION
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            to="/about"
            className="py-2 pl-6 border bg-gray-400 hover:bg-gray-300 hover:text-black"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            to="/contact"
            className="py-2 pl-6 border bg-gray-400 hover:bg-gray-300 hover:text-black "
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
