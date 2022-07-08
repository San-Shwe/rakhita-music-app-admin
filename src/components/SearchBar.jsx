import React, { useState } from "react";
import { useSearch } from "../context/SearchProvider";
import { AiOutlineClose } from "react-icons/ai";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const { handleSearch, resetSearch, searchResult } = useSearch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    handleSearch(query);
    console.log("Submit");
  };

  const handleClearTxt = () => {
    resetSearch();
    setQuery("");
  };

  const handleReset = (e) => {
    if (e.key === "Escape") {
      resetSearch();
    }
  };
  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        value={query}
        onKeyDown={handleReset}
        onChange={({ target }) => {
          setQuery(target.value);
        }}
        placeholder="Search ... "
        className="border border-gray-300 outline-none rounded ring focus:ring-1 ring-blue-500 w-56"
      />
      {searchResult.length ? (
        <button
          onClick={handleClearTxt}
          className="absolute top-1/2 -translate-y-1/2 text-gray-700 right-3"
        >
          <AiOutlineClose size={25} />
        </button>
      ) : null}
    </form>
  );
}
