import * as React from "react";

export const Card = ({ className = "", children }) => {
  return (
    <div
      className={`rounded-lg border border-gray-200  dark:bg-gray-800 dark:border-gray-700 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ className = "", children }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};
