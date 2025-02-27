import * as React from "react";

export function Card({ className = "", children }) {
  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
}