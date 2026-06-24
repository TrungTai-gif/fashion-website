import { useParams } from "react-router-dom";
import { useState } from "react";

import { productService } from "@/services/productService";

import { useQuery } from "@tanstack/react-query";

import VariantList from "./VariantList";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "../common/Spinner";
import VariantEditModal from "./VariantEditModal";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const { getProductBySlug } = productService();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
  });
  const queryClient = useQueryClient();

  return (
    <div className="p-6 mb-20">
      {isLoading && <Spinner />}
      {product && (
        <>
          <div className="flex sm:flex-row flex-col gap-6 items-start">
            <div className="max-w-64 flex h-auto bg-gray-100 rounded overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-2">{product.shortDescription}</p>
              <p className="mb-2 text-sm">{product.longDescription}</p>
              <div className="flex gap-3 text-sm text-gray-700">
                <div className="font-bold">
                  Thương hiệu: {product.brand?.name || "Chưa có thương hiệu"}
                </div>
                <div className="font-bold">
                  Danh mục: {product.category?.name || "Chưa có danh mục"}
                </div>
              </div>
              <div className="mt-2 text-sm  text-gray-600">
                Tags:{" "}
                {product.tags && product.tags.length
                  ? product.tags.map((t) => t.name || t).join(", ")
                  : "-"}
              </div>
              <div className="mt-3 text-sm flex flex-col gap-2 ">
                <div className="flex">
                  Đang bán: {product.isActive ? "Yes" : "No"}
                </div>
                <div className="flex">
                  Sản phẩm nổi bật: {product.isFeatured ? "Yes" : "No"}
                </div>
                <div className="flex">Slug: {product.slug}</div>
                <div className="flex">
                  Ngày tạo: {new Date(product.createdAt).toLocaleString()}
                </div>
                <div className="flex">
                  Cập nhật: {new Date(product.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* <div className="flex justify-between items-center my-5">
        <h2 className="text-lg font-semibold">Danh sách biến thể</h2>
        <button
          onClick={() => {
            setEditing(null);
            setShowVariantModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} /> Thêm mới
        </button>
      </div> */}
      {product && (
        <VariantList
          product_id={product._id}
          onEdit={(variant) => {
            setEditing(variant);
            setShowVariantModal(true);
          }}
        />
      )}

      {showVariantModal && (
        <VariantEditModal
          variant={editing}
          onClose={() => setShowVariantModal(false)}
          onSaved={() => {
            queryClient.invalidateQueries(["variants"]);
            setShowVariantModal(false);
          }}
        />
      )}
    </div>
  );
}
