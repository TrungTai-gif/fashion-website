import Title from "../component/common/Title";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../services/ordersService";
// import { getOrderStatusDisplay } from "../utils/orderHelpers";
import { useNavigate } from "react-router-dom";
import Spinner from "../component/common/Spinner";
import OrderLine from "../component/order_component/OrderLine";
const Orders = () => {
  const { getMyOrder } = orderService();
  const navigate = useNavigate();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrder,
    refetchInterval: 5000, // Tự động refetch mỗi 5 giây để cập nhật trạng thái đơn hàng
  });

  console.log("My orders:", orders);

  // Empty state
  if (!orders || orders.length === 0) {
    return (
      <div className="pt-14 h-screen max-w-6xl mx-auto">
        <div className="text-2xl mb-8">
          <Title text1={"MY"} text2={"ORDERS"} />
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-semibold mb-2">No orders yet</h3>
          <p className="text-gray-400">Your order history will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-14 min-h-screen max-w-6xl mx-auto px-4 pb-10">
      <div className="text-2xl mb-8">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      {isLoading && (
        <div className="pt-14 h-screen max-w-6xl mx-auto">
          <Spinner />
        </div>
      )}
      <div className="space-y-6">
        {orders.map((order) => (
          <OrderLine key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default Orders;
