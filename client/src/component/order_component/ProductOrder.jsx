import { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";

const ProductOrder = ({ item }) => {
  const { currency } = useContext(AppContext);

  return (
    <div className="flex items-start gap-4 flex-1">
      <img
        src={item.product.images[0].url}
        alt="product-image"
        className="w-15 h-15 object-cover rounded-md border"
      />
      <div className="flex-1">
        <h4 className="text-lg font-semibold text-gray-900 mb-1">
          {item.product.name}
        </h4>
        <p className="text-sm text-gray-500 mb-2">
          Price: {item.product.price} {currency}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Quantity: {item.quantity}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductOrder;
