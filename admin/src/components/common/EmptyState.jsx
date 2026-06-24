import React from "react";

const EmptyState = ({ message = "No data." }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <svg
        className="w-20 h-20 mb-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 9.75L14.25 14.25M14.25 9.75L9.75 14.25M12 21C6.48 21 2 16.52 2 11C2 5.48 6.48 1 12 1C17.52 1 22 5.48 22 11C22 16.52 17.52 21 12 21Z"
        />
      </svg>
      <p className="text-gray-500 text-lg font-medium">{message}</p>
    </div>
  );
};

export default EmptyState;
