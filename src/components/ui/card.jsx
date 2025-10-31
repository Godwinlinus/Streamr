import React from "react";
import clsx from "clsx";

export function Card({ children, className = "" }) {
  return (
    <div
      className={clsx(
        "rounded-2xl bg-neutral-950 border border-neutral-800 p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
