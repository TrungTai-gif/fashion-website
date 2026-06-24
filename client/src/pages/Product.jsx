import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import RelatedProducts from "../component/product_component/RelatedProducts";
import { productService } from "../services/productService";
import { useQuery } from "@tanstack/react-query";
import ProductCartItem from "../component/product_component/ProductCartItem";
import CouponList from "../component/common/CouponList";
const Product = () => {
  const { slug } = useParams();
  const { getProductBySlug } = productService();

  const [productData, setProductData] = useState(false);
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
  });

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setProductData(product);
    }
  }, [product]);

  return productData ? (
    <>
      <ProductCartItem product={productData} />
      {/* // preview section */}

      <div className="mx-5 sm:mx-20">
        <CouponList />
        <div className="flex flex-col border mt-10 ">
          <b className=" px-5 py-3 text-md">Disciption</b>
          <div className="flex flex-col gap-4  px-6  text:sm text-gray-500 ">
            {product?.longDescription}
          </div>
        </div>
      </div>

      {/*  related prodiuct */}
      <div className="flex mt-20">
        <RelatedProducts category={product.category._id} />
      </div>
    </>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
