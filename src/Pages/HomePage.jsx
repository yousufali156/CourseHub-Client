import React from "react";
import Navbar from "../Components/Navbar/Navbar";



const HomePage = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-base-300 dark:bg-gray-800 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5">
          <h3 className=" dark:text-white mt-5 text-base font-medium tracking-tight">
            Writes upside-down
          </h3>
          <p className="text-base-300 dark:bg-base400 mt-2 text-sm">
            The Zero Gravity Pen can be used to write in any orientation,
            including upside-down.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
