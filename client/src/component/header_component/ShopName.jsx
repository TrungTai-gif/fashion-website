import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const ShopName = () => {
  return (
    <div className=" ">
      <Link className="text-white flex flex-row items-center gap-3" to={"/"}>
        <img src={assets.logo} className="w-15 h-15 rounded-full" alt="" />
        <p className="prata-regular text-xl">FIT ME</p>
      </Link>
    </div>
  );
};

export default ShopName;
