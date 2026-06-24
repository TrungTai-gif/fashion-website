import { useState } from "react";
import Paginate from "../common/Paginate";

import ProductFeature from "./ProductFeature";
import ProductTable from "./ProductTable";
import { searchService } from "@/services/searchService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function ProductManagement({ data = [] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const dataPerPage = 8;

  const filtered = data.filter((u) =>
    (u.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayed = filtered.slice(
    currentPage * dataPerPage,
    (currentPage + 1) * dataPerPage
  );

  const { syncSearch } = searchService();
  const sycnData = useMutation({
    mutationFn: syncSearch,
    onSuccess: () => {
      toast.success("Đã đồng bộ dữ liệu tìm kiếm cho hệ thống.");
    },
    onError: (err) => {
      toast.error("Đã có lỗi xảy ra!", err.response.data);
    },
  });

  return (
    <div className=" border  border-gray-200 rounded-lg p-3 bg-white mb-20">
      <ProductFeature
        data={filtered}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Bảng dữ liệu */}
      <ProductTable displayed={displayed} />

      {/* Phân trang */}
      <Paginate
        data={filtered}
        numberPage={dataPerPage}
        setCurrentPage={setCurrentPage}
      />
      <div className="mb-10">
        {sycnData.isPending ? (
          <button className="px-2 text-black bg-gray-500 border rounded-2xl">
            Đang xử lí
          </button>
        ) : (
          <button
            onClick={() => sycnData.mutate()}
            className="px-2 text-white bg-indigo-600 border border-gray-400 hover:bg-indigo-700 rounded-2xl"
          >
            Đồng bộ dữ liệu tìm kiếm
          </button>
        )}
      </div>
    </div>
  );
}
