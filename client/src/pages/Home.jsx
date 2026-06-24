import LatestCollection from "../component/home_component/LatestCollection";
import BestSeller from "../component/home_component/BestSeller";
import OurPolicy from "../component/home_component/OurPolicy";
import NewLetterBox from "../component/home_component/NewLetterBox";
import HomeCarousel from "../component/home_component/HomeCarousel";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";

const Home = () => {
  const { getAllProducts } = productService();
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  // Lọc sản phẩm isFeatured
  const featuredProducts = data?.filter((product) => product.isFeatured) || [];
  // Sắp xếp mới nhất
  const newestFeaturedProducts = [...featuredProducts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      <HomeCarousel />
      <div className="mx-20">
        {/* <Hero /> */}
        <LatestCollection
          products={newestFeaturedProducts}
          isLoading={isLoading}
        />
        <BestSeller products={newestFeaturedProducts} isLoading={isLoading} />
        <OurPolicy />
        <NewLetterBox />
      </div>
    </>
  );
};

export default Home;
