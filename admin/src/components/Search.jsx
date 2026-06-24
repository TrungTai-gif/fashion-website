import { useState } from "react";
import { assets } from "../assets/assets";
const Search = ({ search, setSearch, handleSearch }) => {
  return (
    <div className="flex w-1/3 min-w-86 items-center justify-center border border-gray-700  rounded-full ">
      <input
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 text-base  outline-none bg-inherit  px-5 py-2"
        type="text"
        placeholder="Search"
        value={search}
      />

      {search && (
        <img
          onClick={() => setSearch("")}
          className="inline w-4 cursor-pointer mx-2 hover:scale-120"
          src={assets.close}
          alt=""
        />
      )}

      <div className="items-center bg-blue-600 rounded-r-full border-gray-700 hover:bg-blue-800  h-full py-2 w-12">
        <img
          onClick={handleSearch}
          className="w-6 m-auto hover:scale-105 "
          src={assets.search}
          alt=""
        />
      </div>
    </div>
  );
};

export default Search;
