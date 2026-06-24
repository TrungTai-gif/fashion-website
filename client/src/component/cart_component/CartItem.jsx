import { toast } from "react-toastify";
import useCartStore from "../../store/cartStore";
import { useMutation } from "@tanstack/react-query";
const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();

  return (
    <div className="relative flex flex-col sm:flex-row items-center justify-between mb-5 rounded-lg bg-gray-50 border border-gray-200 p-4 shadow">
      {/* Ảnh sản phẩm */}
      <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-lg border bg-white">
        <img
          src={item.variant.image}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-1 w-full sm:ml-4 mt-4 sm:mt-0 relative">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {item.product.name}
          </h2>

          {/* <p className="text-sm text-gray-500">{item.variant.sku}</p> */}

          {/* Thuộc tính */}
          <div className="mt-2 space-y-1 text-md text-pink-700">
            <p>
              Size:{" "}
              <span className="font-medium">
                {item.variant.attributes[0]?.value}
              </span>
              {" || "}
              Màu:{" "}
              <span className="font-medium">
                {item.variant.attributes[1]?.value}
              </span>
            </p>
          </div>

          {/* Giá */}
          <p className="mt-2 text-lg font-bold text-red-600">
            {item.variant.price.toLocaleString("vi-VN")} đ
          </p>
        </div>

        {/* Số lượng */}

        <div className="flex max-w-25 items-center border rounded-lg overflow-hidden">
          <button
            onClick={() => {
              item.quantity > 1 &&
                updateQuantity(
                  item.product._id,
                  item.variant._id,
                  item.quantity - 1
                );
            }}
            className="px-3 py-1 bg-gray-100 hover:bg-blue-500 hover:text-white transition"
          >
            -
          </button>
          <input
            className="w-10 text-center border-x text-sm outline-none"
            type="number"
            value={item.quantity}
            readOnly
          />
          <button
            onClick={() => {
              if (item.quantity < item.variant.stock) {
                updateQuantity(
                  item.product._id,
                  item.variant._id,
                  item.quantity + 1
                );
              }
            }}
            className="px-3 py-1 bg-gray-100 hover:bg-blue-500 hover:text-white transition"
          >
            +
          </button>
        </div>
        <p className="text-sm ">Tồn kho : {item.variant.stock}</p>
      </div>
      {/* Nút xóa */}
      <button
        onClick={() => removeFromCart(item.product._id, item.variant._id)}
        className="text-gray-500 hover:text-red-600 transition absolute top-3 right-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360Z" />
        </svg>
      </button>
    </div>
  );
};

export default CartItem;
