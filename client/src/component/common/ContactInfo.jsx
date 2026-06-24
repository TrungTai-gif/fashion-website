import { useState } from "react";
import { RiArrowDropDownFill } from "react-icons/ri";
import { FaPhoneAlt } from "react-icons/fa";

import { FaFacebook } from "react-icons/fa";
const ContactInfo = () => {
  const [visible, setVisible] = useState(true);
  const handleClick = () => {
    setVisible(!visible);
  };
  return (
    <>
      <div className="gap-3 flex flex-col fixed z-10  top-[70%] right-3  overflow-hidden  transition-all duration-300 ease-linear">
        <div
          onClick={handleClick}
          className={`${visible ? "rotate-180" : "flex"}
                   hover:scale-110 cursor-pointer mr-1 rounded-full mb-2 justify-center p-1 `}
        >
          <RiArrowDropDownFill className="w-12 h-12 rounded-full border border-gray-50 " />
        </div>
        {visible && (
          <>
            <div className="border flex items-center w-13 h-13 justify-center hover:bg-red-400 border-gray-50 rounded-full bg-red-600">
              <FaPhoneAlt className="w-6 h-6 text-white" />
            </div>
            <div className=" border flex items-center hover:bg-blue-400 border-gray-50 w-13 h-13 justify-center rounded-full bg-blue-600">
              <FaFacebook className="w-10 h-10 text-white" />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ContactInfo;
