import { useEffect, useMemo, useState } from "react";

import SortSection from "../component/filter_component/SortSection";
import ProductSection from "../component/product_component/ProductSection";
import Filter from "../component/filter_component/Filter";
import { productService } from "../services/productService";
import { useQuery } from "@tanstack/react-query";
import CurrentFilter from "../component/filter_component/CurrentFilter";
import Spinner from "../component/common/Spinner";
const Collection = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: null,
    price: null,
    color: null,
    size: null,
  });

  const { getAllProducts } = productService();
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  // Build label map for current filters (e.g., price text)
  // const filterLabels = useMemo(() => {
  //   const labels = {};
  //   if (filters.price === "1") labels.price = "Dưới 200k";
  //   if (filters.price === "2") labels.price = "Dưới 500k";
  //   if (filters.price === "3") labels.price = "Dưới 1tr";
  //   if (filters.price === "4") labels.price = "Trên 1tr";
  //   if (filters.color) labels.color = filters.color;
  //   if (filters.size) labels.size = filters.size;
  //   // category label will be resolved inside CurrentFilter via categories query or can be left as id
  //   labels.category = filters.category || null;
  //   return labels;
  // }, [filters]);

  // Apply filters whenever data/filters change (sorting is handled in SortSection)
  useEffect(() => {
    const list = Array.isArray(data) ? [...data] : [];
    let result = list;

    if (filters.category) {
      result = result.filter(
        (p) =>
          p?.category?._id === filters.category ||
          p?.category === filters.category
      );
    }

    // Price filter
    const getProductPrice = (p) => {
      if (p?.cachedPrice) {
        const prices = p?.cachedPrice.min;

        return prices;
      }
      return 0;
    };

    if (filters.price) {
      result = result.filter((p) => {
        const price = getProductPrice(p);
        switch (filters.price) {
          case "1":
            return price < 200000;
          case "2":
            return price < 500000;
          case "3":
            return price < 1000000;
          case "4":
            return price >= 1000000;
          default:
            return true;
        }
      });
    }

    // Color filter using variants
    if (filters.color) {
      const target = String(filters.color).toLowerCase();
      result = result.filter((p) => {
        if (!p.variants || p.variants.length === 0) return false;
        return p.variants.some((v) => {
          if (v.stock <= 0) return false;
          const attr = v.attributes?.find(
            (a) => a?.name === "Màu" || a?.name?.toLowerCase() === "color"
          );
          return attr && String(attr.value).toLowerCase() === target;
        });
      });
    }

    // Size filter using variants
    if (filters.size) {
      const target = String(filters.size).toLowerCase();
      result = result.filter((p) => {
        if (!p.variants || p.variants.length === 0) return false;
        return p.variants.some((v) => {
          if (v.stock <= 0) return false;
          const attr = v.attributes?.find(
            (a) => a?.name?.toLowerCase() === "size"
          );
          return attr && String(attr.value).toLowerCase() === target;
        });
      });
    }
    setFilteredProducts(result);
  }, [data, filters]);

  const clearAllFilters = () =>
    setFilters({ category: null, price: null, color: null, size: null });

  return (
    <div className="flex flex-col gap-1 sm:gap-5 pt-10 border-t px-5 sm:px-20">
      {isLoading && <Spinner />}
      <div className="flex">
        <CurrentFilter
          filters={filters}
          setFilters={setFilters}
          onClearAll={clearAllFilters}
        />
        <SortSection
          filteredProducts={filteredProducts}
          setFilteredProducts={setFilteredProducts}
        />
      </div>
      <div className="flex flex-row gap-10 ">
        <Filter
          filters={filters}
          setFilters={setFilters}
          onClear={clearAllFilters}
        />

        <div className="flex flex-col">
          <ProductSection products={filteredProducts} />
        </div>
      </div>
    </div>
  );
};

export default Collection;
