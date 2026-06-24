import { useEffect, useState } from "react";
import Title from "../common/Title";
import ProductItem from "../product_component/ProductItem";
import Spinner from "../common/Spinner";

const LatestCollection = ({ products, isLoading }) => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, visibleCount));
  }, [products, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <div className="my-10">
      {isLoading && <Spinner />}
      {/* Header */}
      <div className="text-center py-8">
        <Title text1="LATEST" text2="COLLECTION" />
        <p className="w-3/4 m-auto text-sm md:text-base text-gray-600 mt-2">
          Khám phá những sản phẩm mới nhất được cập nhật hàng ngày, bắt kịp xu
          hướng và phong cách hiện đại.
        </p>
      </div>

      {/* Product renders */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {latestProducts.map((product) => (
          <ProductItem key={product._id} product={product} />
        ))}
      </div>

      {/* Load more button */}
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

export default LatestCollection;
