import React, { useState } from "react";
import api from "../features/api";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    // Perform search operation with the searchQuery value
    navigate(`/search/${searchQuery}`);
    setSearchQuery("");
  };

  return (
    <form onSubmit={handleSearch} className="hidden md:flex items-center">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleInputChange}
        className="border border-gray-300 px-2 py-1 rounded-l-lg focus:outline-none focus:ring focus:border-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-2 py-1 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
