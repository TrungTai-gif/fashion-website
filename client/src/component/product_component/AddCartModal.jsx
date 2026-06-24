import { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { productService } from "../../services/productService";

import Spinner from "../common/Spinner";
import ProductCartItem from "./ProductCartItem";

const AddCartModal = ({ product, setShowModal }) => {
  const { getProductBySlug } = productService();
  const { data: productData, isLoading } = useQuery({
    queryKey: ["product", product?.slug],
    queryFn: () => getProductBySlug(product.slug),
    enabled: !!product?.slug,
  });

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-30 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl pb-10 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowModal(false);
          }}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X size={24} />
        </button>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <Spinner />
          </div>
        ) : productData ? (
          <>
            <ProductCartItem product={productData} />
          </>
        ) : (
          <div className="p-6 text-center text-gray-500">
            Không tìm thấy sản phẩm
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCartModal;
