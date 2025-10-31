import React from "react";
import clsx from "clsx";

export function Button({ children, className = "", variant, ...props }) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-white text-black hover:shadow-lg",
    outline: "bg-transparent border border-neutral-700 text-white hover:bg-neutral-900",
    destructive: "bg-red-600 hover:bg-red-700 text-white",
    ghost: "bg-transparent hover:bg-white/5 text-white",
  };
  const v = variant ? variants[variant] || variants.default : variants.default;

  return (
    <button className={clsx(base, v, className)} {...props}>
      {children}
    </button>
  );
}
