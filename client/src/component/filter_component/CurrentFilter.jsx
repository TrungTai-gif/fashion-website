import { useMemo } from "react";
import { X } from "lucide-react";
import Title from "../common/Title";
import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "../../services/categoriesService";

const CurrentFilter = ({ filters, setFilters, onClearAll }) => {
  const { getAllCategories } = categoriesService();
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const catNameById = useMemo(() => {
    const map = new Map();
    (categories || []).forEach((c) => map.set(c._id || c.id || c.slug, c.name));
    return map;
  }, [categories]);

  const chips = [];
  if (filters?.category)
    chips.push({
      key: "category",
      label: catNameById.get(filters.category) || "Danh mục",
    });
  if (filters?.price)
    chips.push({
      key: "price",
      label: { 1: "< 200k", 2: "< 500k", 3: "< 1tr", 4: ">= 1tr" }[
        filters.price
      ],
    });
  if (filters?.color) chips.push({ key: "color", label: filters.color });
  if (filters?.size) chips.push({ key: "size", label: filters.size });

  const removeChip = (key) => {
    setFilters && setFilters((prev) => ({ ...prev, [key]: null }));
  };

  return (
    <div className="flex-1 flex flex-col gap-2">
      {chips.length > 0 ? (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          <div className="text-xl text-black">Bộ lọc hiện tại</div>
          {chips.map((c, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200 text-sm"
            >
              {c.label}
              <button
                aria-label={`Remove ${c.key}`}
                onClick={() => removeChip(c.key)}
                className="ml-1 hover:text-pink-900"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          <button
            onClick={onClearAll}
            className="ml-1 text-sm text-gray-600 underline hover:text-gray-800"
          >
            Xoá tất cả
          </button>
        </div>
      ) : (
        <Title text1={"ALL"} text2={"COLLECTION"} />
      )}
    </div>
  );
};

export default CurrentFilter;
