import { useState } from "react";
import BrandModel from "./BrandModel";
import { brandsService } from "../../services/brandsService";
import { useMutation, useQuery } from "@tanstack/react-query";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const Brands = () => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [brand, setBrand] = useState(null);

  const { getAllBrands, deleteBrand } = brandsService();

  const {
    isLoading,
    data: brands,
    error,
    refetch,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
    select: (data) => (Array.isArray(data) ? [...data].reverse() : []),
    retry: 1,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteBrand,
    onSuccess: (res) => {
      toast.success("Đã xóa thương hiệu!");
      refetch();
    },
    onError: (err) => {
      console.log(err.response.data);
      toast.error(err?.message || "Xóa thất bại");
    },
  });

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-red-500">{error.message}</div>;

  return (
    <div className="bg-white w-full rounded-lg border border-gray-100 shadow-sm">
      {/* Modal */}
      {showModal && (
        <BrandModel
          setShowModal={setShowModal}
          editing={editing}
          brand={brand}
          refetch={refetch}
        />
      )}

      {/* Header */}
      <div className="bg-gray-600 rounded-t-lg p-3   flex flex-wrap-reverse items-center mb-6">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          Thương hiệu
        </h2>
        <button
          onClick={() => {
            setShowModal(true);
            setEditing(false);
            setBrand(null);
          }}
          className="flex ml-20 items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          <span>Thêm</span>
        </button>
      </div>

      {/* Empty state */}
      {!brands.length && (
        <div className="text-center text-gray-400 py-10 text-sm">
          Chưa có thương hiệu nào.
        </div>
      )}
      {isPending && <Spinner />}

      {/* Brand list */}
      <div className="flex flex-wrap justify-center gap-5 px-5">
        {brands.map((b) => (
          <div
            key={b._id}
            className="group w-30 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
          >
            {/* Brand image */}
            <div className="h-20 overflow-clip  flex items-center justify-center bg-gray-50">
              {b.image ? (
                <img
                  src={b.image}
                  alt={b.name}
                  className="w-full object-contain"
                />
              ) : (
                <div className="text-gray-400 text-sm">Không có ảnh</div>
              )}
            </div>

            {/* Info */}
            <div className="p-2 flex flex-col justify-between ">
              <div>
                <div className="text-lg font-semibold text-gray-900 truncate">
                  {b.name}
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {b.description || "Không có mô tả"}
                </p>
              </div>

              <div className="flex   justify-end items-center mt-3 text-sm">
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditing(true);
                      setBrand(b);
                      setShowModal(true);
                    }}
                    className="text-gray-600 hover:text-blue-600"
                    title="Sửa"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => mutate(b._id)}
                    className="text-gray-600 hover:text-red-500"
                    title="Xóa"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands;
