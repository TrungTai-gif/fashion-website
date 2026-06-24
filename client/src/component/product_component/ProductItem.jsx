import { Link } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState } from "react";
import AddCartModal from "./AddCartModal";
export default function ProductItem({ product }) {
  const [showModal, setShowModal] = useState(false);
  if (product)
    return (
      <>
        <div className="group hover:border border-gray-300 hover:shadow pb-3">
          <Link
            className="text-gray-700 cursor-pointer block"
            to={`/product/${product.slug}`}
          >
            {/* Ảnh sản phẩm */}
            <div className="overflow-hidden max-h-64 bg-gray-100 flex items-center justify-center min-h-40">
              <img
                className="w-full h-full object-cover hover:scale-110 transition ease-in-out duration-300"
                src={
                  product.image ||
                  (Array.isArray(product.images) && product.images[0]) ||
                  (Array.isArray(product.allImages) && product.allImages[0]) ||
                  "https://placehold.co/300x300?text=No+Image"
                }
                alt={product.name}
                onError={(e) => {
                  e.target.src = "https://placehold.co/300x300?text=No+Image";
                }}
              />
            </div>

            {/* Tên sản phẩm */}
            <p className="pt-3 px-2 text-md truncate group-hover:text-pink-700 transition-colors">
              {product.name}
            </p>
            {showModal && (
              <AddCartModal product={product} setShowModal={setShowModal} />
            )}
            {/* Giá + Giỏ hàng */}
            <div className="flex justify-between items-center mt-1 mx-2">
              <p className="text-md font-bold text-pink-900">
                {product.displayPrice}
              </p>
              <FaCartPlus
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
                className="text-gray-500 text-xl hover:text-pink-600 transition-colors cursor-pointer"
              />
            </div>
          </Link>
        </div>
      </>
    );
}
