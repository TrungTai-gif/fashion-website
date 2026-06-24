import { FileSpreadsheet, FileText } from "lucide-react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";

export default function OrderFeature({
  data = [],
  handleStatusFilterChange,
  statusFilter,
}) {
  const exportExcel = () => {
    const exportData = data.map((order) => ({
      "Mã đơn hàng": order._id,
      "Khách hàng": order.userId?.name || order.shippingAddress?.fullName || "",
      Email: order.userId?.email || "",
      "Tổng tiền": order.totalAmount || 0,
      "Trạng thái": order.status,
      "Phương thức thanh toán":
        order.paymentMethod === "cod" ? "COD" : "Online",
      "Ngày đặt": new Date(order.createdAt).toLocaleDateString("vi-VN"),
    }));

    const sheet = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Đơn hàng");
    XLSX.writeFile(wb, "DonHang.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Danh sách đơn hàng", 14, 15);
    const tableColumn = [
      "Mã ĐH",
      "Khách hàng",
      "Tổng tiền",
      "Trạng thái",
      "PT Thanh toán",
      "Ngày đặt",
    ];
    const tableRows = data.map((order) => [
      order._id?.slice(-8).toUpperCase() || "",
      order.userId?.name || order.shippingAddress?.fullName || "",
      new Intl.NumberFormat("vi-VN").format(order.totalAmount || 0),
      order.status || "",
      order.paymentMethod === "cod" ? "COD" : "Online",
      new Date(order.createdAt).toLocaleDateString("vi-VN") || "",
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("DonHang.pdf");
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between mb-4 gap-1">
        <div className="flex gap-2">
          <button
            onClick={exportExcel}
            className="bg-emerald-500 text-white px-3 py-2 rounded-lg hover:bg-emerald-600 flex items-center gap-1"
          >
            <FileSpreadsheet size={16} /> Xuất Excel
          </button>
          <button
            onClick={exportPDF}
            className="bg-rose-500 text-white px-3 py-2 rounded-lg hover:bg-rose-600 flex items-center gap-1"
          >
            <FileText size={16} /> Xuất PDF
          </button>
        </div>
        <div className="mb-4">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ xử lý</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipping">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        {/* <input
          type="text"
          placeholder="Tìm kiếm đơn hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        /> */}
      </div>
    </>
  );
}
