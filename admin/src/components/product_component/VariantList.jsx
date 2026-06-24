import { useState } from "react";
import variantsService from "@/services/variantService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Edit } from "lucide-react";
import { toast } from "react-toastify";
import Spinner from "../common/Spinner";
import Paginate from "../common/Paginate";

export default function VariantList({ product_id, onEdit }) {
  const queryClient = useQueryClient();
  const { getByProduct, remove } = variantsService();

  const dataPerPage = 10;
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["variants", product_id],
    queryFn: () => getByProduct(product_id, { page: 1, limit: 30 }),
    keepPreviousData: true,
  });

  const allVariants = data?.variants || [];

  const sortedVariants = [...allVariants].sort((a, b) => {
    const getAttrValue = (attrs, key) => {
      if (!Array.isArray(attrs)) return "";
      const found = attrs.find(
        (attr) =>
          (attr.name || "").toString().toLowerCase() === key.toLowerCase()
      );
      return found?.value ?? "";
    };

    const colorA = String(
      getAttrValue(a.attributes, "color") || ""
    ).toLowerCase();
    const colorB = String(
      getAttrValue(b.attributes, "color") || ""
    ).toLowerCase();

    return colorA.localeCompare(colorB, "vi", { sensitivity: "base" });
  });

  const variants = sortedVariants.slice(
    page * dataPerPage,
    (page + 1) * dataPerPage
  );

  // Xóa variant
  const { mutate: deleteVariant, isPending } = useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success("Đã xóa biến thể!");
      queryClient.invalidateQueries(["variants", product_id]);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa biến thể này?")) {
      deleteVariant(id);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-4 my-10">
      <div className="flex items-center justify-between gap-1">
        <h2 className="flex text-lg font-semibold">Danh sách biến thể</h2>
        <p className="flex">Tổng số: {allVariants.length}</p>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Ảnh</th>
              <th className="px-3 py-2 text-left font-semibold">Màu</th>
              <th className="px-3 py-2 text-left font-semibold">Size</th>
              <th className="px-3 py-2 text-left font-semibold">Giá bán</th>
              <th className="px-3 py-2 text-left font-semibold">Giá vốn</th>
              <th className="px-3 py-2 text-left font-semibold">Tồn kho</th>
              <th className="px-3 py-2 text-left font-semibold">SKU</th>
              <th className="px-3 py-2 text-left font-semibold">Trạng thái</th>
              <th className="px-3 py-2 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {variants.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="text-center text-gray-500 py-6 bg-amber-50"
                >
                  Chưa có biến thể nào
                </td>
              </tr>
            ) : (
              variants.map((v) => (
                <tr
                  key={v._id}
                  className="border-t hover:bg-gray-50 transition-all"
                >
                  <td className="px-3 py-2">
                    {v.image ? (
                      <img
                        src={v.image}
                        alt="variant"
                        className="h-12 w-12 object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  <td className="px-3 py-2">
                    {(v.attributes &&
                      v.attributes.find(
                        (a) => (a.name || "").toLowerCase() === "color"
                      )?.value) ||
                      "—"}
                  </td>

                  <td className="px-3 py-2">
                    {(v.attributes &&
                      v.attributes.find(
                        (a) => (a.name || "").toLowerCase() === "size"
                      )?.value) ||
                      "—"}
                  </td>

                  <td className="px-3 py-2">{v.price?.toLocaleString()}₫</td>

                  <td className="px-3 py-2">{v.cost?.toLocaleString()}₫</td>

                  <td className="px-3 py-2">{v.stock}</td>

                  <td className="px-3 py-2">{v.sku || "—"}</td>

                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        v.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {v.isActive ? "Đang bán" : "Ngưng"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => onEdit?.(v)}
                        className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Edit size={16} /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(v._id)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {variants && (
        <Paginate
          data={allVariants}
          numberPage={dataPerPage}
          setCurrentPage={setPage}
        />
      )}
    </div>
  );
}
