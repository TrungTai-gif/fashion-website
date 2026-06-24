import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/common/Spinner";
import { ProductManagement } from "@/components/product_component";
import { productService } from "@/services";

const ProductPage = () => {
  const { getAllProducts } = productService();

  const { data, isLoading } = useQuery({
    queryKey: ["Products"],
    queryFn: getAllProducts,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <Spinner />;
  return <ProductManagement data={data} />;
};

export default ProductPage;
