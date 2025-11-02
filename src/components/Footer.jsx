import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaTwitter, FaGithub, FaInstagram, FaEnvelope } from "react-icons/fa";

const socials = [
  { icon: FaTwitter, label: "Twitter", href: "#" },
  { icon: FaInstagram, label: "Instagram", href: "#" },
  { icon: FaGithub, label: "Github", href: "#" },
];

const navSections = [
  {
    title: "Explore",
    links: [
      { label: "Movies", to: "/" },
      { label: "TV Shows", to: "/tv-shows" },
      { label: "Trending", to: "/trending" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", to: "/terms" },
      { label: "Privacy", to: "/privacy" },
    ],
  },
];

const FooterNavSection = ({ title, links }) => (
  <div>
    <h4 className="text-sm font-medium text-gray-300 mb-2">{title}</h4>
    <ul className="text-sm space-y-2">
      {links.map(({ label, to }) => (
        <li key={label}>
          <Link to={to} className="text-gray-400 hover:text-white transition-colors">
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const reduce = useReducedMotion();

  const handleSubscribe = (e) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) return setStatus("err");
    setStatus("ok");
    setEmail("");
  };

  return (
    <motion.footer
      className="w-full bg-black text-gray-200"
      initial={reduce ? {} : { opacity: 0, y: 12 }}
      animate={reduce ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      aria-labelledby="footer-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:ml-12 bg-black text-white">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          
           {/* Brand / About (center on md and smaller) */}
          <div className="max-w-sm w-full mx-auto text-center lg:text-left">
            <div className="flex flex-col items-center lg:items-start">
              <h3 id="footer-heading" className="text-lg font-momo block text-3xl mdtext-2xl tracking-normal">
                skreenly
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Discover and track movies and TV shows. Clean UI, fast search, no fluff.
              </p>

              <div className="mt-4 flex items-center justify-center lg:justify-start gap-3">
                {socials.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="p-2 rounded-md hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/10"
                    aria-label={label}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Nav links (center the grid on md and smaller) */}
          <nav className="max-w-sm w-full mx-auto text-center">
            <div className="grid grid-cols-2 gap-6">
              {navSections.map((section) => (
                <FooterNavSection key={section.title} {...section} />
              ))}
            </div>
          </nav>

 
          <div className="w-full max-w-xs mx-auto md:mx-0">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Get updates</h4>
              <p className="text-sm text-gray-400 mb-3">New releases and curated lists — no spam.</p>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 items-center">
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus(null);
                }}
                placeholder="you@domain.com"
                className="w-full sm:flex-1 bg-transparent border border-white/10 text-sm px-3 py-2 rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/10"
                aria-invalid={status === "err"}
              />
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center gap-2 px-3 py-2 bg-white text-black rounded-md text-sm font-medium hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20"
                aria-label="Subscribe"
              >
                <FaEnvelope />
                <span>Subscribe</span>
              </button>
            </form>

            {status === "err" && (
              <p className="mt-2 text-xs text-red-400">Please enter a valid email address.</p>
            )}
            {status === "ok" && (
              <p className="mt-2 text-xs text-green-400">Thanks — you’re on the list.</p>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-white/6 pt-6">
          <div className="flex flex-col mb-[20px] md:flex-row items-center md:justify-between gap-3">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} <span className="font-momo">skreenly</span> · Made with <span aria-hidden>❤</span> by Orian
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <Link to="/status" className="hover:text-white transition-colors">
                Status
              </Link>
              <Link to="/docs" className="hover:text-white transition-colors">
                API
              </Link>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Version 1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
