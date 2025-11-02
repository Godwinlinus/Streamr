import React from "react";
import clsx from "clsx";

export function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full bg-neutral-900 border border-neutral-700 text-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500",
        className
      )}
    />
  );
}
