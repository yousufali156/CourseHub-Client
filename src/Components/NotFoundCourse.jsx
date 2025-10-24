import React from 'react';
import { Link } from 'react-router'; 

const NotFoundCourse = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-300 px-4 py-10 text-center">
      <img
        src="https://i.ibb.co/mjcctWp/Not-Found-Course.png"
        alt="Not Found"
        className="w-full max-w-xs sm:max-w-sm md:max-w-md mb-8 mx-auto"
      />
      <h1 className="text-5xl sm:text-6xl font-extrabold text-blue-500 mb-4">404</h1>
      <h2 className="text-2xl sm:text-3xl font-semibold text-base-300 mb-2">Page Not Found</h2>
      <p className="text-base-300 mb-8 max-w-md mx-auto">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundCourse;
