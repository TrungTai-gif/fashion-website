import { useEffect, useState } from "react";

const SortSection = ({ filteredProducts, setFilteredProducts }) => {
  const [sortType, setSortType] = useState("new");

  useEffect(() => {
    const list = Array.isArray(filteredProducts) ? [...filteredProducts] : [];
    let result = list;

    const getProductPrice = (p) => {
      if (p?.cachedPrice) {
        const prices = p?.cachedPrice.min;

        return prices;
      }
      return 0;
    };
    // Sort
    if (sortType === "low-high" || sortType === "high-low") {
      result.sort((a, b) => {
        const pa = getProductPrice(a);
        const pb = getProductPrice(b);
        return sortType === "low-high" ? pa - pb : pb - pa;
      });
    } else if (sortType === "new" || sortType === "old") {
      result.sort((a, b) => {
        const da = new Date(a?.createdAt || 0).getTime();
        const db = new Date(b?.createdAt || 0).getTime();
        return sortType === "new" ? db - da : da - db;
      });
    }
    // Price filter: use min price across variants if variants exist, else product.price
    setFilteredProducts(result);
  }, [sortType]);

  return (
    <div className="flex-1 flex justify-end">
      <div className="flex justify-between text-base sm:text-2xl mb-4 ">
        <select
          value={sortType}
          onChange={(e) => setSortType && setSortType(e.target.value)}
          className="border-1 border-gray-300 text-sm px-2 p-2 rounded-2xl"
        >
          <option value="new">Sắp xếp: Mới nhất </option>
          <option value="old">Sắp xếp: Cũ nhất </option>
          <option value="low-high"> Giá: Thấp đén cao</option>
          <option value="high-low"> Giá: Cao đến thấp</option>
        </select>
      </div>
    </div>
  );
};

export default SortSection;
