import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-purple-600 border-b-pink-500 border-l-transparent animate-spin shadow-xl"></div>
        <div className="absolute inset-2 rounded-full bg-white flex justify-center items-center">
          <span className="text-sm font-bold text-gray-600 animate-pulse">Loading</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
