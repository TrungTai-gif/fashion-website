const OrderDetail = ({ order }) => {
  return (
    <div className="mt-4 py-2 border-t border-gray-100">
      <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
        <span>Payment method: {order.paymentMethod}</span>
        <span>Placed on:{new Date(order.createdAt).toLocaleString()}</span>
        <span>Expected delivery: 5 day from order date</span>
      </div>
    </div>
  );
};

export default OrderDetail;
