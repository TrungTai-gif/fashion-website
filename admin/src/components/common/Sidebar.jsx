import { MdDeliveryDining } from "react-icons/md";
import { assets } from "../../assets/assets";
import { Link, useLocation } from "react-router-dom";

import { FaChevronCircleLeft } from "react-icons/fa";
import { GrOverview } from "react-icons/gr";
import { FaProductHunt } from "react-icons/fa";
import { FaUsersViewfinder } from "react-icons/fa6";
import { useAuth } from "@/store/authStore";
import { MdOutlineRateReview } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
const Sidebar = ({ mobi }) => {
  const { user } = useAuth();

  const location = useLocation();
  const isActive = (path) => {
    return location.pathname === path;
  };

  const getLinkClass = (path) => {
    const baseClass =
      "flex items-center p-3 text-gray-300 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:text-white group transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg";
    const activeClass =
      "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg ";

    return isActive(path) ? `${baseClass} ${activeClass}` : baseClass;
  };

  return (
    <div>
      <aside
        id="sidebar-multi-level-sidebar"
        className="relative w-72 h-screen transition-transform   sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className=" px-3 ">
          {mobi && (
            <div className="flex absolute top-0 left-60">
              <FaChevronCircleLeft className="w-8 h-8 cursor-pointer text-yellow-400 hover:text-yellow-500 hover:scale-110 transition-all duration-300 rounded-2xl" />
            </div>
          )}
          <div className="flex gap-2 text-white border-gray-600 border-b flex-col justify-center items-center py-5">
            <div className="flex border-blue-300 border-4  mb-5 rounded-full overflow-clip md:w-18  md:h-18 w-15 h-15">
              <img src={assets.user_img} alt="" />
            </div>
            <p className="text-md"> {user.email}</p>
            <p className="text-sm">Chào mừng bạn trở lại</p>
          </div>

          <div className="flex flex-row p-4 items-center gap-2 bg-amber-400 my-3 rounded-xl text-black">
            <div className="flex  rounded-full overflow-clip w-8 h-8">
              <img src={assets.logo} alt="" />
            </div>

            <p className="flex items-center text-xl uppercase font-bold">
              FIT ME
            </p>
          </div>

          <ul className="space-y-2 font-medium text-gray-200">
            {/* overview */}
            <li>
              <Link to="/" className={getLinkClass("/")}>
                <GrOverview
                  className={`w-5 h-5 transition-all duration-300 group-hover:text-white ${
                    isActive("/") ? "text-white" : "text-gray-300"
                  }`}
                />

                <span className="ms-3">Bảng điều khiển</span>
              </Link>
            </li>
            {/* products */}
            <li>
              <Link to="/products" className={getLinkClass("/products")}>
                <FaProductHunt
                  className={`shrink-0 w-5 h-5 transition-all duration-300 group-hover:text-white ${
                    isActive("/products") ? "text-white" : "text-gray-300"
                  }`}
                />

                <span className="flex-1 ms-3 whitespace-nowrap">
                  Quản lí sản phẩm
                </span>
              </Link>
            </li>
            {/* category and brand */}
            <li>
              <Link to="/categories" className={getLinkClass("/categories")}>
                <svg
                  className={`w-5 h-5 transition-all duration-300 group-hover:text-white ${
                    isActive("/categories") ? "text-white" : "text-gray-300"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentColor"
                >
                  <path d="m260-520 220-360 220 360H260ZM700-80q-75 0-127.5-52.5T520-260q0-75 52.5-127.5T700-440q75 0 127.5 52.5T880-260q0 75-52.5 127.5T700-80Zm-580-20v-320h320v320H120Zm580-60q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm-500-20h160v-160H200v160Zm202-420h156l-78-126-78 126Zm78 0ZM360-340Zm340 80Z" />
                </svg>
                <span className="ms-3">Danh mục và thương hiệu</span>
              </Link>
            </li>
            <li>
              <Link to="/orders" className={getLinkClass("/orders")}>
                <svg
                  className={`shrink-0 w-5 h-5 transition-all duration-300 group-hover:text-white ${
                    isActive("/orders") ? "text-white" : "text-gray-300"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 21"
                >
                  <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                </svg>
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                  Quản lý đơn hàng
                </span>
              </Link>
            </li>
            <li>
              <Link to={"/delivery"} className={getLinkClass("/delivery")}>
                <MdDeliveryDining
                  className={`shrink-0 w-5 h-5 transition-all duration-300 group-hover:text-white ${
                    isActive("/delivery") ? "text-white" : "text-gray-300"
                  }`}
                />

                <span className="flex-1 ms-3 whitespace-nowrap">
                  Coupon & Vận chuyển
                </span>
              </Link>
            </li>
            <li>
              <Link to={"/customers"} className={getLinkClass("/customers")}>
                <FaRegUser
                  className={`shrink-0 w-5 h-5 transition-all duration-300 group-hover:text-white ${
                    isActive("/customers") ? "text-white" : "text-gray-300"
                  }`}
                />

                <span className="flex-1 ms-3 whitespace-nowrap">
                  Quản lý khách hàng
                </span>
              </Link>
            </li>
            {/* reviwe */}
            <li>
              <Link to={"/inbox"} className={getLinkClass("/inbox")}>
                <MdOutlineRateReview
                  className={`shrink-0 w-5 h-5 transition-all duration-300 group-hover:text-white ${
                    isActive("/inbox") ? "text-white" : "text-gray-300"
                  }`}
                />

                <span className="flex-1 ms-3 whitespace-nowrap">Tin nhắn</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
