import { useState } from "react";
import { assets } from "../../assets/assets";
// import EditProduct from "../products/EditProduct";
import { toast } from "react-toastify";
const ActionButton = ({}) => {
  const [showEditModal, setShowEditModal] = useState(true);
  const handleEdit = (e) => {
    e.preventDefault();
    toast.success("edit here");
  };

  const handleDelete = (e) => {
    e.preventDefault();
    toast.success("deletede");
  };
  return (
    <>
      <div className="relative flex items-center justify-end">
        <div className="group/action relative">
          <button className="p-2 rounded-full hover:bg-gray-100 transition w-10 h-10 flex items-center justify-center">
            <img src={assets.more_vert} alt="Actions" className="w-6 h-6" />
          </button>
          {/* Dropdown menu chỉ hiển thị khi hover vào nút more_vert */}
          <div
            id="dropdownDivider"
            className="z-20 absolute right-0 top-8 min-w-[9rem] bg-white border border-gray-200 rounded-lg shadow-lg group-hover/action:block hidden animate-fadeIn"
          >
            <ul className="py-2 text-sm text-gray-700">
              <li onClick={handleEdit} className="cursor-pointer">
                <span className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 transition rounded">
                  Edit
                </span>
              </li>

              <li onClick={handleDelete} className="cursor-pointer">
                <span className="block px-4 py-2 hover:bg-red-50 hover:text-red-600 transition rounded">
                  Delete
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActionButton;
