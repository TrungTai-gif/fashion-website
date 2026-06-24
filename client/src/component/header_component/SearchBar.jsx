import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { IoMdClose } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { searchService } from "../../services/searchService";
import { useNavigate } from "react-router-dom";
const SearchBar = () => {
  const showSearch = true;
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [debounced, setDebounced] = useState("");
  const { searchProducts } = searchService();
  const navigate = useNavigate();

  // Debounce input
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const enabled = debounced.length >= 2; // only search with 2+ chars
  const { data, isLoading } = useQuery({
    queryKey: ["search", debounced],
    queryFn: () => searchProducts({ q: debounced, size: 7 }),
    enabled,
    staleTime: 30_000,
  });

  const items = data?.items || [];

  const onSelect = (item) => {
    setVisible(false);
    setSearch("");
    if (item?.slug) {
      navigate(`/product/${item.slug}`);
    }
    // else if (item?.id) {
    //   navigate(`/collection?product=${item.id}`);
    // }
  };
  return showSearch ? (
    <div className=" text-center w-full ">
      <div className="relative flex flex-row items-center justify-center bg-white my-5 mx-3 rounded-full">
        <input
          value={search}
          onChange={(e) => {
            setVisible(true);
            setSearch(e.target.value);
          }}
          className="w-full rounded-l-full outline-none text-md px-5 py-2 "
          type="text"
          placeholder="Search"
        />
        {visible ? (
          <IoMdClose
            onClick={() => {
              setSearch("");
              setVisible(false);
            }}
            className="cursor-pointer mx-3 bg-pink-500 rounded-full"
          />
        ) : (
          <div className=" bg-pink-600 p-3  rounded-full cursor-pointer">
            <IoSearch className="w-4 h-4 text-black " />
          </div>
        )}

        {visible && enabled && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow z-50 max-h-80 overflow-auto">
            {isLoading ? (
              <div className="p-3 text-sm text-gray-500">Đang tìm kiếm…</div>
            ) : items.length === 0 ? (
              <div className="p-3 text-sm text-gray-500">Không có kết quả</div>
            ) : (
              items.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="w-full text-left p-3 hover:bg-gray-100"
                >
                  <div className="flex gap-3 items-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded" />
                    )}
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">
                        {item.name}
                      </div>
                      {item.shortDescription ? (
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {item.shortDescription}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default SearchBar;
