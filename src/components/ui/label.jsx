import React from "react";

export function Label({ children, htmlFor, className = "" }) {
  return (
    <label htmlFor={htmlFor} className={`text-xs text-neutral-300 block mb-1 ${className}`}>
      {children}
    </label>
  );
}
