import { useContext } from "react";
import { ShopContext } from "@/context/ShopContext";

const ProductOrder = ({ item }) => {
  const { currency } = useContext(ShopContext);

  return (
    <div className="flex items-start gap-4 flex-1">
      <img
        src={item.image}
        alt="product-image"
        className="w-15 h-15 object-cover rounded-md border"
      />
      <div className="flex-1">
        <h4 className="text-md font-semibold text-gray-900 mb-1">
          {item.name}
        </h4>
        <p className="text-sm text-gray-500 mb-2">
          Giá: {item.price} {currency}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Số lượng: {item.quantity}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductOrder;
