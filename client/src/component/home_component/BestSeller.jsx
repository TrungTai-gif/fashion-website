import { useContext, useEffect, useState } from "react";

import Title from "../common/Title";
import ProductItem from "../product_component/ProductItem";

const BestSeller = ({ products, isLoading }) => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);

  useEffect(() => {
    const best = products.filter((product) => product.isFeatured);
    setBestSellerProducts(best.slice(0, visibleCount));
  }, [products, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const handleLoadLess = () => {
    setVisibleCount((prev) => prev - 8);
  };

  return (
    <div className="my-10">
      {/* Header */}
      <div className="text-center py-8">
        <Title text1="BEST" text2="SELLERS" />
        <p className="w-3/4 m-auto text-sm md:text-base text-gray-500 mt-2">
          Những sản phẩm bán chạy nhất, được khách hàng yêu thích và lựa chọn
          nhiều nhất trong thời gian qua.
        </p>
      </div>

      {/* Product renders */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {bestSellerProducts.map((product, index) => (
          <ProductItem key={product._id} product={product} />
        ))}
      </div>

      {visibleCount < products.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition"
          >
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
};

export default BestSeller;
