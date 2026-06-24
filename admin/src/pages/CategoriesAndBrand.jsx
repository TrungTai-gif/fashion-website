import Categories from "../components/brand_category_component/Categories";
import Brands from "../components/brand_category_component/Brands";

export default function CategoryBrandManager() {
  return (
    <div className="flex sm:flex-row flex-col gap-6 min-h-screen rounded-lg mb-20">
      <Categories />
      <Brands />
    </div>
  );
}
