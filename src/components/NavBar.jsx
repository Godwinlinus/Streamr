import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BsThreeDotsVertical, BsX } from "react-icons/bs";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Movies", href: "/" },
    { label: "TV Shows", href: "/tv-shows" },
    { label: "Trending", href: "/trending" },
    { label: "Feed", href: "/feed" }, // ✅ Added Feed here
  ];

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  const linkBase =
    "relative px-2 py-1 font-medium transition-colors duration-300 hover:text-white focus-visible:outline-none group";
  const activeStyle = "text-white after:w-full";

  return (
    <motion.nav
      className="flex items-center justify-between w-full py-3"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Logo (visible only on mobile) */}
      <Link
        to="/"
        className="font-momo block text-3xl md:hidden text-2xl tracking-normal"
      >
        streamr
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8 text-gray-300">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.href}
            className={`${linkBase} ${
              location.pathname === link.href ? activeStyle : ""
            }`}
          >
            {link.label}
            {/* Animated underline */}
            <span
              className={`absolute left-0 bottom-0 h-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 transition-all duration-300 ${
                location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-gray-200 hover:text-white transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <BsX size={26} /> : <BsThreeDotsVertical size={22} />}
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-[68px] left-0 w-full bg-black/95 backdrop-blur-sm border-t border-gray-800 md:hidden z-40"
          >
            <div className="flex flex-col p-4 space-y-3">
              {navLinks.map((link) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block py-3 px-4 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                      location.pathname === link.href
                        ? "bg-gray-800 text-white"
                        : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavBar;