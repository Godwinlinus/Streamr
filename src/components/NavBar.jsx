import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BsThreeDotsVertical, BsX } from "react-icons/bs";
import { supabase } from "../lib/supabaseClient";

/**
 * Helper: compute MD5 hex of a string using Web Crypto.
 * Returns lowercase hex string.
 */
async function md5Hex(str) {
  // Browser environment only
  const encoder = new TextEncoder();
  const data = encoder.encode(str.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("MD5", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function gravatarUrl(email, size = 32) {
  if (!email) return `https://www.gravatar.com/avatar/?d=identicon&s=${size}`;
  const hash = await md5Hex(email);
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=${size}`;
}

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // auth state
  const [user, setUser] = useState(null);
  const [avatarSrc, setAvatarSrc] = useState(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  useEffect(() => {
    let mounted = true;

    // initial fetch
    (async function load() {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        setUser(data?.user ?? null);
      } catch (err) {
        console.error("NavBar getUser error", err);
      }
    })();

    // listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      try {
        listener?.subscription?.unsubscribe();
      } catch (err) {
        try {
          listener?.unsubscribe?.();
        } catch (e) {}
      }
    };
  }, []);

  // compute avatar when user changes
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!user) {
        if (!cancelled) setAvatarSrc(null);
        return;
      }

      // prefer explicit avatar_url from metadata
      const metaAvatar = user?.user_metadata?.avatar_url;
      if (metaAvatar) {
        if (!cancelled) setAvatarSrc(metaAvatar);
        return;
      }

      // fallback: gravatar based on email (async)
      const email = user?.email;
      try {
        const url = await gravatarUrl(email, 32);
        if (!cancelled) setAvatarSrc(url);
      } catch (err) {
        if (!cancelled) setAvatarSrc(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const navLinks = [
    { label: "Movies", href: "/" },
    { label: "TV Shows", href: "/tv-shows" },
    { label: "Trending", href: "/trending" },
    { label: "Feed", href: "/feed" },
  ];

  const linkBase =
    "relative px-2 py-1 font-medium transition-colors duration-300 hover:text-white focus-visible:outline-none group";
  const activeStyle = "text-white after:w-full";

  const handleAvatarClick = () => {
    if (user) navigate("/profile");
    else navigate("/signin");
  };

  return (
    <motion.nav
      className="flex items-center justify-between w-full py-3"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link to="/" className="font-momo block text-3xl md:hidden text-2xl tracking-normal">
        skreenly
      </Link>

      <div className="hidden md:flex items-center gap-8 text-gray-300">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.href}
            className={`${linkBase} ${location.pathname === link.href ? activeStyle : ""}`}
          >
            {link.label}
            <span
              className={`absolute left-0 bottom-0 h-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 transition-all duration-300 ${
                location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </Link>
        ))}
      </div>

      {/* Right side: avatar (desktop) + mobile menu button */}
      <div className="flex items-center gap-4">
        {/* tiny avatar */}


        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-200 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <BsX size={26} /> : <BsThreeDotsVertical size={22} />}
        </button>
      </div>

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
                <motion.div key={link.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                  <Link
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block py-3 px-4 rounded-lg text-gray-300 hover:bg-neutral-900 hover:text-white transition-colors ${
                      location.pathname === link.href ? "bg-neutral-900 text-white" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="pt-2 border-t border-gray-800">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleAvatarClick();
                  }}
                  className="w-full text-left py-3 px-4 rounded-lg text-gray-300 hover:bg-neutral-900 hover:text-white transition-colors flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center">
                    {avatarSrc ? (
                      // eslint-disable-next-line jsx-a11y/img-redundant-alt
                      <img src={avatarSrc} alt="user avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-semibold text-white">{user?.email?.[0]?.toUpperCase() ?? "U"}</span>
                    )}
                  </div>
                  <div>
                    <div className="text-sm">{user ? "Profile" : "Sign in"}</div>
                    <div className="text-xs text-gray-400">{user ? user.email : "Sign in to access favorites"}</div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavBar;
