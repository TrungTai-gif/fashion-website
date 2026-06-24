import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { TbLockExclamation } from "react-icons/tb";
import DeleteConfirmModal from "../common/DeleteConfirmModal";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "../common/Spinner";
import { productService } from "@/services";
import EditProductForm from "./EditProductForm";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
const ProductTable = ({ displayed }) => {
  const { deleteProduct } = productService();
  const [showConfrim, setShowConfirm] = useState(false);
  const [product_id, setProduct_id] = useState("");
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries("products");
      }
      setShowConfirm(false);
      toast.success("Xóa thành công!");
    },
    onError: () => {
      toast.error("Xóa thất bại!");
    },
  });

  return (
    <div className="overflow-x-auto rounded-t-xl border border-gray-300 shadow-md bg-white">
      {isPending && (
        <>
          <div className=" absolute m-auto flex justify-center bg-black/20 afixed z-40 inset-0">
            <Spinner />
          </div>
        </>
      )}
      {/*  xác nhận block sản phảm */}
      {showConfrim && (
        <DeleteConfirmModal
          title="Xóa sản phẩm"
          message="Bạn có thực sự muốn khóa sản phẩm không!"
          onClose={() => {
            setShowConfirm(false);
            setProduct_id("");
          }}
          onConfirm={() => mutate({ id: product_id })}
        />
      )}
      {/* Show edit product */}
      {showModal && (
        <EditProductForm
          product={editingProduct}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
            queryClient.invalidateQueries("products");
          }}
        />
      )}
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="p-3 text-left">Ảnh</th>
            <th className="p-3 text-left">Tên sản phẩm</th>
            <th className="p-3 text-left">Mô tả ngắn</th>
            <th className="p-3 text-left">Thương hiệu</th>
            <th className="p-3 text-left">Trạng thái</th>
            <th className="p-3 text-left">Nổi bật</th>
            <th className="p-3 text-left">Ngày tạo</th>
            <th className="p-3 text-center">Tính năng</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((p) => (
            <tr
              key={p._id}
              className={`hover:bg-blue-50 transition duration-150 ${
                !p.isActive && "bg-gray-300"
              }`}
            >
              {/* Ảnh sản phẩm */}
              <td className="px-2 py-1 border">
                <img
                  src={
                    p.image || "https://via.placeholder.com/60x60?text=No+Image"
                  }
                  alt={p.name}
                  className="w-14 h-14 object-cover rounded-lg border"
                />
              </td>
              {/* Tên sản phẩm */}
              <td className="px-2 py-1 border font-medium text-gray-900">
                <Link
                  className="hover:text-blue-600 cursor-pointer"
                  to={`/products/${p.slug}`}
                >
                  {p.name}
                </Link>
              </td>

              {/* Mô tả ngắn */}
              <td className="px-2 py-1 border text-gray-600">
                {p.shortDescription?.length > 60
                  ? p.shortDescription.slice(0, 60) + "..."
                  : p.shortDescription || "—"}
                <p>{p.displayPrice}</p>
              </td>

              {/* Thương hiệu */}
              <td className="px-2 py-1 border">
                {p.brand?.name || p.brand || "—"}
              </td>

              {/* Kích hoạt */}
              <td className="px-2 py-1 border">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    p.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {p.isActive ? "Hiển thị" : "Ẩn"}
                </span>
              </td>

              {/* Nổi bật */}
              <td className="px-2 py-1 border">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    p.isFeatured
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {p.isFeatured ? "Có" : "Không"}
                </span>
              </td>

              {/* Ngày tạo */}
              <td className="px-2 py-1 border">
                {new Date(p.createdAt).toLocaleDateString("vi-VN")}
              </td>

              {/* Nút xóa */}
              <td className="  px-2 py-1 text-center border gap-2">
                <button
                  onClick={() => {
                    setShowConfirm(true);
                    setProduct_id(p._id);
                  }}
                  className=" inline-flex items-center gap-1 bg-red-500 text-white mr-2 px-2 py-1 rounded-lg hover:bg-red-600 transition"
                >
                  <FaTrashAlt size={16} />
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(p);
                    setShowModal(true);
                  }}
                  className="inline-flex items-center gap-1 bg-blue-500 text-white  mr-2 px-2 py-1 rounded-lg hover:bg-blue-600 transition"
                >
                  <CiEdit size={16} />
                </button>
              </td>
            </tr>
          ))}

          {displayed.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                Không tìm thấy sản phẩm
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
