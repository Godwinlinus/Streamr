// SideBar.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";

const SideBar = () => {
  const location = useLocation();

  const navLinks = [
    { label: "Home", icon: <HiOutlineHome />, path: "/" },
    { label: "Favourites", icon: <MdOutlineBookmarkAdd />, path: "/favourite" },
    { label: "Profile", icon: <FaRegUser />, path: "/profile" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ===== Desktop Sidebar ===== */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-16 flex-col items-center py-6 bg-black z-40">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-3xl font-extrabold text-[#e50914] select-none"
        >
          S
        </motion.div>

        <nav className="flex flex-col items-center gap-8 mt-8">
          {navLinks.map(({ label, icon, path }) => (
            <Link
              key={path}
              to={path}
              aria-label={label}
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200
                ${isActive(path) ? "text-[#e50914]" : "text-gray-400 hover:text-[#e50914]"}`}
            >
              {icon}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ===== Mobile Navbar ===== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-neutral-800 flex justify-around items-center py-2 z-50">
        {navLinks.map(({ label, icon, path }) => (
          <Link
            key={path}
            to={path}
            aria-label={label}
            className={`flex flex-col items-center text-xs transition-colors ${
              isActive(path) ? "text-white" : "text-gray-400 hover:text-white transition-colors"
            }`}
          >
            <span className="text-lg">{icon}</span>
            <span className="text-[10px] font-semibold mt-0.5">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default SideBar;
