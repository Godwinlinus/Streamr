import React from "react";

export function Spinner({ className = "w-5 h-5", variant = "light" }) {
  const stroke = variant === "light" ? "text-white" : "text-black";
  return (
    <svg
      className={`${className} animate-spin ${stroke}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
