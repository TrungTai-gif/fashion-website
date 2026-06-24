import { FileSpreadsheet, FileText } from "lucide-react";
import { IoMdAdd } from "react-icons/io";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Link } from "react-router-dom";

export default function ProductFeature({
  data = [],
  searchTerm,
  setSearchTerm,
}) {
  const exportExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Khách hàng");
    XLSX.writeFile(wb, "KhachHang.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Danh sách khách hàng", 14, 15);
    const tableColumn = [
      "Họ tên",
      "Email",
      "Địa chỉ",
      "Ngày sinh",
      "Giới tính",
      "SĐT",
    ];
    const tableRows = data.map((u) => [
      u.name || "",
      u.email || "",
      u.address || "",
      u.dob ? new Date(u.dob).toLocaleDateString("vi-VN") : "",
      u.gender || "",
      u.phone || "",
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("NewData.pdf");
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <div className="flex gap-2">
          <Link
            to={"/products/add"}
            className="bg-indigo-500 text-white px-2 py-1 rounded-lg hover:bg-indigo-600 flex items-center gap-1"
          >
            <IoMdAdd size={16} /> Thêm
          </Link>
          <button
            onClick={exportExcel}
            className="bg-emerald-500 text-white px-2 py-1 rounded-lg hover:bg-emerald-600 flex items-center gap-1"
          >
            <FileSpreadsheet size={16} /> Xuất Excel
          </button>
          <button
            onClick={exportPDF}
            className="bg-rose-500 text-white px-2 py-1 rounded-lg hover:bg-rose-600 flex items-center gap-1"
          >
            <FileText size={16} /> Xuất PDF
          </button>
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1 w-60 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
    </>
  );
}
