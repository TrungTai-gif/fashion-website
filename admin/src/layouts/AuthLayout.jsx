import { useState } from "react";

import { ToastContainer } from "react-toastify";
import { Footer } from "@components/footer_component";
import LoginPage from "@/pages/LoginPage";

const AuthLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("Overview");
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <>
      <ToastContainer />
      <LoginPage />
      <Footer />
    </>
  );
};

export default AuthLayout;
