import * as React from "react";

export function CardContent({ className = "", children }) {
  return <div className={`mt-2 ${className}`}>{children}</div>;
}