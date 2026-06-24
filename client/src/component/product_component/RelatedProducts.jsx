import React, { useContext, useEffect, useState } from "react";

import Title from "../common/Title";
import ProductItem from "./ProductItem";
import { productService } from "../../services/productService";
import { useQuery } from "@tanstack/react-query";

const RelatedProducts = ({ category }) => {
  const [related, setRelated] = useState([]);
  const { getProductByCategory } = productService();
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "category" + category],
    queryFn: () => getProductByCategory(category),
    // enabled: !!category,
  });

  return (
    <div className="sm:mx-20 mx-5 sm:mb-20 mb-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"SẢN PHẨM"} text2={"LIÊN QUAN"} />
      </div>

      {products && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
          {products.map((product, index) => (
            <ProductItem key={index} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
