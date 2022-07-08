import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchPost } from "../api/post";

const SearchContext = createContext();

export default function SearchProvider({ children }) {
  const [searchResult, setSearchResult] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    const { error, posts } = await searchPost(query);
    if (error) return console.log(error);
    setSearchResult(posts);
    navigate("/");
  };

  const resetSearch = () => {
    setSearchResult([]);
  };

  return (
    <SearchContext.Provider value={{ searchResult, handleSearch, resetSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

// we must import everytime we want to use SearchProvider if this useContext Hook
// so i declare useSearch context hook in here
export const useSearch = () => useContext(SearchContext);
