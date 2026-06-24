import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Spinner from "../Spinner";

const OrderStatus = ({ order }) => {
  const { currency } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);

  const loadOrders = () => {
    setIsLoading(true);

    // giả lập call API mất 1.5s
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4  lg:gap-6">
      {isLoading && <Spinner />}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="text-sm font-medium text-green-600">
          {order.status}
        </span>
      </div>

      <div className="text-right">
        <p className="text-lg font-semibold text-gray-900 mb-2">
          {order.totalPrice.toLocaleString("vi-VN")} {currency}
        </p>
        <button
          onClick={loadOrders}
          className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors"
        >
          Track Order
        </button>
      </div>
    </div>
  );
};

export default OrderStatus;
