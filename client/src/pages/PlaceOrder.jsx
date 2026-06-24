import { useContext, useEffect, useState } from "react";
import CartTotal from "../component/cart_component/CartTotal";
import { toast } from "react-toastify";
import UserCheckout from "../component/order_component/UserCheckout";
import PaymentInfo from "../component/order_component/PaymentInfo";
import { useAuth } from "../store/authStore";
import GuestCheckout from "../component/order_component/GuestCheckout";
import { useMutation } from "@tanstack/react-query";
import { orderService } from "../services/ordersService";
import OTPModal from "../component/common/OTPModal";
import useCartStore from "../store/cartStore";

import {
  validateOrderForm,
  createOrderData,
  formatCartItemsForEmail,
} from "../utils/orderHelpers";
import { ShopContext } from "../context/ShopContext";

const PlaceOrder = () => {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const { user, accessToken } = useAuth();

  const [deliveryFee, setDeliveryFee] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const { cartItems, clearCart, totalAmount } = useCartStore();
  const { navigate } = useContext(ShopContext);
  const { createOrder, getOTP, verifyOTP } = orderService();
  // OTP Modal state
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState(null);

  // Guest form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    addressDetail: "",
    ward: "",
    district: "",
    province: "",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const addOrder = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      toast.success("Đặt hàng thành công!");
      clearCart();
      navigate("/orders");
    },
    onError: (error) => {
      console.error("Order error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Đặt hàng thất bại!";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateOrderForm(formData, cartItems);
    if (!validation.isValid) {
      toast.warning(validation.message);
      return;
    }
    if (accessToken) {
      const orderData = createOrderData({
        user,
        formData,
        cartItems,
        totalAmount,
        paymentMethod,
        delivery_fee: deliveryFee,
        coupon: coupon,
      });

      addOrder.mutate(orderData);
    } else {
      const orderData = createOrderData({
        user: null,
        formData,
        cartItems,
        totalAmount,
        paymentMethod,
        delivery_fee: deliveryFee,
        coupon: coupon,
      });

      // Store order data for later use
      setPendingOrderData(orderData);

      // Send OTP
      const orderItems = formatCartItemsForEmail(cartItems);
      const emailData = {
        email: formData.email,
        customerName: formData.fullName,
        orderCode: "auto generate",
        orderItems: orderItems,
        totalAmount: totalAmount,
      };
      console.log(formData.fullName);

      sendOTPMutation.mutate(emailData);
    }
  };

  // OTP mutations
  const sendOTPMutation = useMutation({
    mutationFn: getOTP,
    onSuccess: (data) => {
      toast.success("Mã OTP đã được gửi đến email của bạn!");
      setShowOTPModal(true);
    },
    onError: (error) => {
      console.error("Send OTP error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Gửi OTP thất bại!";
      toast.error(errorMessage);
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: verifyOTP,
    onSuccess: (data) => {
      // toast.success("Xác thực OTP thành công!");
      // Proceed with guest order
      if (pendingOrderData) {
        addOrder.mutate(pendingOrderData);
      }
    },
    onError: (error) => {
      console.error("Verify OTP error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Mã OTP không đúng!";
      toast.error(errorMessage);
    },
  });

  const handleOTPVerify = async (otpCode) => {
    const verifyData = {
      email: formData.email,
      otp: otpCode,
      type: "order_confirmation",
    };

    verifyOTPMutation.mutate(verifyData);
  };

  const handleOTPResend = async () => {
    const orderItems = formatCartItemsForEmail(cartItems);
    const emailData = {
      email: formData.email,
      customerName: formData.fullName,
      orderCode: "auto generate",
      orderItems: orderItems,
      totalAmount: totalAmount,
    };

    sendOTPMutation.mutate(emailData);
  };

  const handleCloseOTPModal = () => {
    setShowOTPModal(false);
    setPendingOrderData(null);
  };

  return (
    <>
      <OTPModal
        isOpen={showOTPModal}
        onClose={handleCloseOTPModal}
        onVerify={handleOTPVerify}
        email={formData.email}
        isLoading={sendOTPMutation.isPending}
        onResendOTP={handleOTPResend}
      />

      <form
        onSubmit={handleSubmit}
        className="mx-5 mb-20 md:mx-auto flex flex-col sm:flex-row justify-center gap-10 md:gap-20 pt-5 sm:pt-14 min-h-[80vh] max-w-6xl "
      >
        {accessToken ? (
          <UserCheckout form={formData} setForm={setFormData} />
        ) : (
          <GuestCheckout form={formData} setForm={setFormData} />
        )}

        {/* Right side - Cart Total & Payment */}
        <div className="w-full sm:max-w-[400px]">
          <div className="mb-8 ">
            <CartTotal
              setParentCoupon={(e) => setCoupon(e)}
              setParentDelivery={(e) => setDeliveryFee(e)}
            />
          </div>
          <PaymentInfo
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
          <button
            type="submit"
            disabled={addOrder.isPending || cartItems.length === 0}
            className={`w-full text-center text-white py-3 px-6 rounded-md font-medium transition-colors ${
              addOrder.isPending || cartItems.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {addOrder.isPending ? "Đang xử lý..." : "ĐẶT HÀNG"}
          </button>

          {cartItems.length === 0 && (
            <p className="text-center text-red-500 text-sm mt-2">
              Giỏ hàng trống
            </p>
          )}
        </div>
      </form>
    </>
  );
};

export default PlaceOrder;
