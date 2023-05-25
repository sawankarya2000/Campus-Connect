import React, { useState } from "react";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Perform search operation with the searchQuery value
    console.log("Search query:", searchQuery);
    setSearchQuery("");
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center">
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
