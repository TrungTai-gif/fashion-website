import { Routes, Route } from "react-router-dom";
import OverView from "./pages/OverViewPage";
import OrderPage from "./pages/OrderPage";
import Customers from "./pages/Customers";
import Inbox from "./pages/Inbox";
import CategoryBrandManager from "./pages/CategoriesAndBrand";
import ProfilePage from "./pages/ProfilePage";
import ProductPage from "./pages/ProductPage";
import AddProductForm from "./components/product_component/AddProductForm";
import ProductDetailPage from "./components/product_component/ProductDetailPage";
import OrderDetail from "./components/order_component/OrderDetail";
import DashboardPage from "./components/overview_component/DashboardPage";
import { CouponAndShippingPage } from "./pages";

const Routers = () => {
  return (
    <>
      <Routes>
        <Route path="/overview" element={<DashboardPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/products/add" element={<AddProductForm />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/delivery" element={<CouponAndShippingPage />} />
        <Route path="/categories" element={<CategoryBrandManager />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/*" element={<DashboardPage />} />
      </Routes>
    </>
  );
};

export default Routers;
