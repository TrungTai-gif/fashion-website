import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import useCartStore from "../../store/cartStore";
import { deliveryService } from "../../services/deliveryService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { couponService } from "../../services/couponService";
import { useAuth } from "../../store/authStore";

const CartTotal = ({ setParentCoupon, setParentDelivery }) => {
  const { totalAmount } = useCartStore();
  const { user, accessToken } = useAuth();
  const { getAllDeliveries } = deliveryService();
  const location = useLocation();
  const { currency, navigate } = useContext(ShopContext);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const { data: deliveries } = useQuery({
    queryKey: ["deliveries"],
    queryFn: getAllDeliveries,
  });

  useEffect(() => {
    if (deliveries && deliveries.length > 0) {
      setDeliveryOptions(deliveries);
      setSelectedDelivery(deliveries[0]);
    }
  }, [deliveries]);

  const deliveryFee = selectedDelivery?.baseFee + selectedDelivery?.extraFee;

  const [coupon, setCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState("");

  const [couponError, setCouponError] = useState("");
  const { applyCoupon } = couponService();
  const [fee, setFee] = useState(0);

  useEffect(() => {
    if (coupon) {
      setParentCoupon(coupon);
      setFee(coupon.discountAmount);
    }
    if (deliveryFee) {
      setParentDelivery(deliveryFee);
    }
  }, [selectedDelivery, coupon, deliveryFee]);

  const applyCouponMutate = useMutation({
    mutationFn: applyCoupon,
    onError: () => setCouponError("Mã không hợp lệ hoặc không áp dụng được!"),
    onSuccess: (res) => {
      setCoupon(res);
      console.log(res);
    },
  });

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError("");
    setCoupon(null);
    if (!couponInput.trim()) {
      setCouponError("Vui lòng nhập mã coupon!");
      return;
    }
    applyCouponMutate.mutate({
      code: couponInput.trim(),
      orderAmount: Number(totalAmount),
    });
  };

  return (
    <div className="mt-6 h-full  rounded-lg border bg-white p-6 shadow-md md:mt-0 max-w-[400px] w-full min-w-[300px] right-0">
      <div className="mb-2 flex justify-between">
        <p className="text-gray-700">Tổng thanh toán</p>
        <p className="text-gray-700">
          {totalAmount.toLocaleString("vi-VN")} {currency}
        </p>
      </div>
      {/* //delivery */}
      <div className="flex flex-col mb-2">
        <p className="text-gray-700 mb-1">Phương thức giao hàng</p>
        <div className="flex flex-col gap-2">
          {deliveryOptions.map((opt) => (
            <label key={opt._id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="delivery"
                value={opt._id}
                checked={selectedDelivery?._id === opt._id}
                onChange={() => setSelectedDelivery(opt)}
                className="mr-2"
              />
              <span>
                {opt.name} (
                {(opt.baseFee + opt.extraFee)?.toLocaleString("vi-VN") || 0}{" "}
                {currency})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Coupon input UI */}
      {user && accessToken ? (
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded p-2"
              placeholder="Nhập mã giảm giá"
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value);
                setCouponError("");
              }}
              disabled={applyCouponMutate.isPending}
            />
            <button
              onClick={handleApplyCoupon}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={applyCouponMutate.isPending}
            >
              {applyCouponMutate.isPending ? "Đang kiểm tra..." : "Áp dụng"}
            </button>
          </div>
          {couponError && (
            <p className="text-red-500 text-sm mt-1">{couponError}</p>
          )}
          {coupon && (
            <div className="mt-2 p-2 bg-green-100 rounded text-green-700 text-sm">
              Đã áp dụng mã: <b>{coupon.code}</b> (-
              {coupon.discountAmount?.toLocaleString("vi-VN")} {currency})
              <button
                type="button"
                className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs inline-block"
                onClick={() => {
                  setCoupon(null);
                  setCouponInput("");
                  setCouponError("");
                  setFee(0);
                }}
              >
                Xóa
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-orange-500">
          Đăng nhập để nhận được nhiều ưu đãi hơn
        </div>
      )}

      <hr className="my-4" />
      <div className="flex justify-between">
        <p className="text-lg font-bold">Tổng cộng</p>
        <div className="">
          <p className="mb-1 text-lg font-bold">
            {(totalAmount + deliveryFee - fee).toLocaleString("vi-VN")}{" "}
            {currency}
          </p>
          <p className="text-sm text-gray-700">Bao gồm VAT</p>
        </div>
      </div>
      {location.pathname.includes("/cart") ? (
        <button
          onClick={() => {
            navigate("/place-order");
          }}
          className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600"
        >
          Tiến hành đặt hàng
        </button>
      ) : null}
    </div>
  );
};

export default CartTotal;
