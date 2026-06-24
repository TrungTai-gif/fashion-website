// src/components/Breadcrumb.jsx
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const routeNameMap = {
    customers: "Quản lý khách hàng",
    categories: "Danh mục và thương hiệu",
    orders: "Quản lý đơn hàng",
    products: "Sản phẩm",
    add: "Thêm mới",
    edit: "Chỉnh sửa",
    dashboard: "Bảng điều khiển",
    settings: "Cài đặt hệ thống",
  };

  return (
    <nav className="text-sm my-3">
      <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border-l-4 border-yellow-400 shadow-sm">
        {/* Breadcrumb bên trái */}
        <ul className="flex items-center flex-wrap text-blue-700 font-medium">
          <li>
            <Link
              to="/"
              className="hover:underline hover:text-blue-800 transition-colors"
            >
              Trang chủ
            </Link>
          </li>

          {pathnames.map((name, index) => {
            const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
            const isLast = index === pathnames.length - 1;

            const label =
              routeNameMap[name] || decodeURIComponent(name.replace(/-/g, " "));

            return (
              <li key={routeTo} className="flex items-center">
                <ChevronRight size={16} className="mx-1 text-blue-500" />
                {isLast ? (
                  <span className="text-blue-900">{label}</span>
                ) : (
                  <Link
                    to={routeTo}
                    className="hover:underline hover:text-blue-800 transition-colors"
                  >
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Thời gian bên phải */}
        <div className="text-xs sm:text-sm text-gray-600 font-medium ml-4">
          {formatTime(currentTime)}
        </div>
      </div>
    </nav>
  );
}
