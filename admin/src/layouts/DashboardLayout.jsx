import { useState } from "react";
import Header from "../components/header_component/Header";
import Sidebar from "@/components/common/Sidebar";
import Routers from "../Routers";
import Footer from "../components/footer_component/Footer";
import { ToastContainer } from "react-toastify";
import Breadcrumb from "@/components/common/Breadcrumb";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div className="min-h-screen bg-gray-200">
      <div className="flex flex-row">
        <div className="flex">
          {/* desktop */}
          <div className="hidden lg:block bg-indigo-900  w-72 shadow-lg">
            <Sidebar mobi={false} />
          </div>

          {/* mobi */}
          {sidebarOpen && (
            <div className="fixed z-50 w-64 top-0 bg-indigo-800 shadow-lg border-r  lg:hidden">
              <div onClick={() => setSidebarOpen(false)}>
                <Sidebar mobi={true} />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col w-full bg-gray-100">
          <Header toggleSidebar={toggleSidebar} />
          <ToastContainer />
          <div className="flex flex-col px-5 gap-1.5">
            <Breadcrumb />
            <Routers />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
