import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const res = await fetch(`/api/plants/search?query=${query.trim()}`);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setIsVisible(false); // Hide the search bar
        navigate(`/plants/${data[0]._id}`); // Navigate to plant page
      } else {
        alert("Plant not found!");
      }
    } catch (error) {
      console.error("Error searching plant:", error);
      alert("Something went wrong! Try again.");
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative flex flex-col sm:flex-row items-stretch sm:items-center w-full max-w-3xl mx-auto p-2 bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 gap-2 sm:gap-0"
        >
          {/* Input Field */}
          <motion.input
            type="text"
            placeholder="Search for medicinal plants..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full flex-1 px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-400 text-sm sm:text-base"
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          />

          {/* Search Button */}
          <motion.button
            onClick={handleSearch}
            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <span className="flex justify-center items-center gap-2 text-sm sm:text-base">
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
      )}
    </AnimatePresence>
  );
};

export default SearchBar;
