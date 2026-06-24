import Navbar from "./Navbar";
import SearchBar from "./SearchBar";
import ShopName from "./ShopName";
import { MdOutlineMail } from "react-icons/md";
import { FaPhoneFlip } from "react-icons/fa6";
import Feature from "./Feature";

const Header = () => {
  return (
    <>
      <div className="bg-gray-800 px-15 flex flex-row gap-5 py-3 text-gray-200">
        <div className="flex flex-row items-center gap-2">
          <MdOutlineMail />

          <span>TrungTai@gmail.com</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <FaPhoneFlip />
          <span>+84 386 659 641</span>
        </div>
      </div>
      <div className="flex flex-row bg-black md:px-15 lg:px-35 pt-5  items-center">
        <div className="w-1/4">
          <ShopName />
        </div>

        <div className="w-1/2 md:px-10">
          <SearchBar />
        </div>
        <div className="w-1/4">
          <Feature />
        </div>
      </div>
      <Navbar />
    </>
  );
};

export default Header;
