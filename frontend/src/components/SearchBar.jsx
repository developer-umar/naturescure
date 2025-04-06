import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const res = await fetch(`/api/plants/search?query=${query.trim()}`);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        navigate(`/plants/${data[0]._id}`); // Navigate to first matching plant
      } else {
        alert("Plant not found!");
      }
    } catch (error) {
      console.error("Error searching plant:", error);
      alert("Something went wrong! Try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative flex items-center w-full max-w-lg mx-auto bg-white rounded-full shadow-lg overflow-hidden border border-gray-200"
    >
      {/* Input Field */}
      <motion.input
        type="text"
        placeholder="Search for medicinal plants..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="flex-1 px-6 py-3 text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-400"
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      />

      {/* Search Button */}
      <motion.button
        onClick={handleSearch}
        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <span className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Search
        </span>
      </motion.button>
    </motion.div>
  );
};

export default SearchBar;