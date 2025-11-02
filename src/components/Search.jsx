import React from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="w-full sm:w-auto">
      <motion.div
        className="relative w-full sm:w-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Search Icon */}
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#7d7d7d]" />

        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            block w-full md:w-80 lg:w-96
            rounded-full py-2 pl-9 pr-3 
            text-sm placeholder-[#7d7d7d]
            bg-[#1f1f1f] text-white
            focus:outline-none focus:ring-2 focus:ring-gray-700
            shadow-sm
          "
        />
      </motion.div>
    </div>
    
  );
};

export default Search;
