import { useState, useMemo } from "react";
import { MdFilterList } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight } from "lucide-react";
import { categoriesService } from "../../services/categoriesService";
import FilterSection from "./FilterSection";
const Filter = ({ filters, setFilters, onClear }) => {
  const { getAllCategories } = categoriesService();
  const [open, setOpen] = useState(true);
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });
  const categoryOptions = useMemo(
    () =>
      (categories || []).map((c) => ({
        value: c._id || c.id || c.slug,
        name: c.name,
      })),
    [categories]
  );
  const colors = [
    { value: "Trắng", name: "Trắng", color: "#fff" },
    { value: "Đen", name: "Đen", color: "#000" },
    { value: "Xanh navy", name: "Xanh navy", color: "#1E3A8A" },
    { value: "Xanh dương", name: "Xanh dương", color: "#3B82F6" },
    { value: "Xanh lá", name: "Xanh lá", color: "#22C55E" },
    { value: "Xám", name: "Xám", color: "#808080" },
    { value: "Hồng", name: "Hồng", color: "#FFC0CB" },
    { value: "Đỏ", name: "Đỏ", color: "#FF0000" },
  ];

  const sizes = [
    { value: "XS", name: "XS" },
    { value: "S", name: "S" },
    { value: "M", name: "M" },
    { value: "L", name: "L" },
    { value: "XL", name: "XL" },
  ];

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div
        className="inline-flex items-center gap-1 font-bold text-pink-600 mb-3 w-full cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <MdFilterList className="text-2xl" /> Filter
        {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </div>

      {open && (
        <div className=" w-42 md:w-64 ">
          <FilterSection
            title="Màu sắc"
            name="color"
            options={colors}
            type="radio"
            selectedValue={filters?.color || null}
            onChange={handleChange}
          />
          <FilterSection
            title="Danh mục"
            name="category"
            options={categoryOptions}
            type="radio"
            selectedValue={filters?.category || null}
            onChange={handleChange}
          />
          <FilterSection
            title="Giá"
            name="price"
            options={[
              { value: "1", name: "Dưới 200k" },
              { value: "2", name: "Dưới 500k" },
              { value: "3", name: "Dưới 1tr" },
              { value: "4", name: "Trên 1tr" },
            ]}
            type="radio"
            selectedValue={filters?.price || null}
            onChange={handleChange}
          />
          <FilterSection
            title="Size"
            name="size"
            options={sizes}
            type="radio"
            selectedValue={filters?.size || null}
            onChange={handleChange}
          />

          <button
            onClick={() => onClear && onClear()}
            className="my-6 w-full border border-black py-2 rounded-full hover:bg-black hover:text-white transition-colors duration-200"
          >
            Xoá bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default Filter;
