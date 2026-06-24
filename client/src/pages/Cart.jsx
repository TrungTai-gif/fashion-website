import Title from "../component/common/Title";

import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useContext } from "react";
import CartItem from "../component/cart_component/CartItem";
import PolicySection from "../component/cart_component/PolicySection";
import useCartStore from "../store/cartStore";
import CouponList from "../component/common/CouponList";
const Cart = () => {
  const { cartItems, currency, navigate } = useContext(ShopContext);
  const { totalAmount } = useCartStore();
  return (
    <>
      {/* {isLoading && <Spinner />} */}

      <div className="pt-10 pb-12 min-h-150">
        <div className="mb-10 text-center">
          <Title text1={"GIỎ "} text2={"HÀNG"} />
        </div>

        {cartItems.length > 0 ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="md:w-2/3 rounded-lg">
                {cartItems.map((item, index) => (
                  <CartItem key={index} item={item} />
                ))}
              </div>
              <div className="border rounded-xl p-5 md:w-1/3 w-1/2 shadow-sm bg-white">
                <div className="flex items-start justify-between">
                  <p className="text-lg font-semibold text-gray-800">
                    Tổng cộng
                  </p>

                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600 leading-none">
                      {totalAmount.toLocaleString("vi-VN")} {currency}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/place-order")}
                  className="
                          mt-6 w-full py-3 
                          bg-blue-600 hover:bg-blue-700 
                          text-white font-medium 
                          rounded-lg 
                          flex items-center justify-center gap-2
                          transition-all duration-200
                          shadow-md hover:shadow-lg
                        "
                >
                  <span>Tiến hành đặt hàng</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 6.75L22.5 12m0 0l-5.25 5.25M22.5 12H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <CouponList />
            <PolicySection />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-gray-400 mb-6">
              Add some products to get started
            </p>
            <Link
              to={"/collection"}
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
