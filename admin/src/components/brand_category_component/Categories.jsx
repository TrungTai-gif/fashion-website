import { useState } from "react";
import { categoriesService } from "../../services/categoriesService";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../common/Spinner";
import CategoryModel from "./CategoryModel";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Plus } from "lucide-react";

const Categories = () => {
  const [editing, setEditing] = useState(false);
  const [category, setCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { getAllCategories, deleteCategory } = categoriesService();

  const {
    isLoading,
    data: categories,
    error,
    refetch,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    select: (data) => (Array.isArray(data) ? [...data].reverse() : []),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60,
    retry: 1,
  });

  const handleDelete = async (id) => {
    const res = await deleteCategory(id);
    if (res && res.success) {
      toast.success("Đã xóa danh mục!");
      refetch();
    } else {
      toast.error(res?.message || "Xóa thất bại");
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-red-500">{error.message}</div>;

  return (
    <>
      {showModal && (
        <CategoryModel
          refetch={refetch}
          setShowModal={setShowModal}
          editing={editing}
          category={category}
        />
      )}

      <div className="bg-white min-w-64 md:min-w-90  rounded-lg border border-gray-100 shadow-sm">
        {/* Header */}
        <div className="bg-gray-300 rounded-t-lg p-3  flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
            Danh mục sản phẩm
          </h2>
          <button
            onClick={() => {
              setShowModal(true);
              setEditing(false);
              setCategory(null);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
          >
            <Plus size={16} />
            <span>Thêm</span>
          </button>
        </div>

        {/* Empty state */}
        {(!categories || categories.length === 0) && (
          <div className="text-center text-gray-400 py-10 text-sm">
            Chưa có danh mục nào.
          </div>
        )}

        {/* Category list */}
        <div className="flex flex-col px-3 gap-2 group">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center bg-indigo-200 justify-between gap-4 py-2 hover:bg-indigo-300  rounded-lg transition"
            >
              <div className="min-w-10 px-2">
                <div className="text-md font-medium text-gray-900 truncate">
                  {cat.name}
                </div>
                {cat.description && (
                  <div className="text-xs text-gray-500 truncate mt-0.5">
                    {cat.description}
                  </div>
                )}
              </div>
              <div className="flex items-center mr-2 text-sm">
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditing(true);
                      setCategory(cat);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-700 hover:scale-115"
                    title="Sửa"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="text-red-600 hover:text-red-500 hover:scale-115"
                    title="Xóa"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Categories;
