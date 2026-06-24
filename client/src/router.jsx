import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Collection from "./pages/Collection";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Register from "./pages/Register";
import { Routes, Route, Navigate } from "react-router-dom";
import Product from "./pages/Product";
import ProfilePage from "./pages/ProfilePage";
import { useAuth } from "./store/authStore";
import ForgotPasswordForm from "./component/common/ForgotPasswordForm";
const Router = () => {
  const { accessToken } = useAuth();
  return (
    <Routes>
      <Route
        path="/login"
        element={!accessToken ? <Login /> : <Navigate to={"/home"} />}
      />
      <Route
        path="/register"
        element={!accessToken ? <Register /> : <Navigate to={"/home"} />}
      />

      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/home" element={<Home />} />
      <Route path="/collection" element={<Collection />} />
      <Route path="/product/:slug" element={<Product />} />
      <Route
        path="/orders"
        element={accessToken ? <Orders /> : <Navigate to={"/home"} />}
      />
      <Route path="/profile" element={<ProfilePage />} />

      <Route path="/place-order" element={<PlaceOrder />} />
      <Route path="/forgot-password" element={<ForgotPasswordForm />} />
    </Routes>
  );
};

export default Router;
