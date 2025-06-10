import React, { useState } from 'react';
import { Link } from 'react-router';

const courses = [
  { title: "Web Development", date: "15 Jan. 2025", image: "https://i.ibb.co/d0tW8vZF/Web-Development.jpg" },
  { title: "Graphic Design", date: "22 Jan. 2025", image: "https://i.ibb.co/N2QbbKLy/graphics-design.jpg" },
  { title: "Data Science", date: "05 Feb. 2025", image: "https://i.ibb.co/rKwZpJ8t/data-analysis.jpg" },
  { title: "Digital Marketing", date: "17 Feb. 2025", image: "https://i.ibb.co/ym32WfrT/digital-marketing.jpg" },
  { title: "Photography", date: "24 Feb. 2025", image: "https://i.ibb.co/JWSyDs6R/photography.jpg" },
  { title: "Cybersecurity", date: "03 Mar. 2025", image: "https://i.ibb.co/GQcW6BXH/sequrity.jpg" },
  { title: "UI/UX Design", date: "10 Mar. 2025", image: "https://i.ibb.co/qYm8PGPp/ui-ux-desing.jpg" },
  { title: "Mobile App Development", date: "18 Mar. 2025", image: "https://i.ibb.co/FLbrXqPP/app-devlopment.jpg" },
  { title: "Machine Learning", date: "25 Mar. 2025", image: "https://i.ibb.co/Z1ftWX3X/machine-learning.jpg" },
  { title: "Blockchain Basics", date: "02 Apr. 2025", image: "https://i.ibb.co/B9wxR4z/blockchan.jpg" },
  { title: "Cloud Computing", date: "09 Apr. 2025", image: "https://i.ibb.co/bgzNwzyZ/Cloud-Computing.jpg" },
  { title: "Game Development", date: "15 Apr. 2025", image: "https://i.ibb.co/wZt0Yh77/Game-Development.jpg" },
  { title: "Artificial Intelligence", date: "22 Apr. 2025", image: "https://i.ibb.co/vCmnHhjY/Artificial-Intelligence.jpg" },
  { title: "DevOps Engineering", date: "29 Apr. 2025", image: "https://i.ibb.co/5hZ4v4dw/Dev-Ops-Engineering.jpg" },
  { title: "Augmented Reality", date: "06 May 2025", image: "https://i.ibb.co/qMzMfXjM/Augmented-Reality.jpg" },
  { title: "Video Editing", date: "13 May 2025", image: "https://i.ibb.co/cm06bqX/Video-Editing.jpg" },
  { title: "E-Commerce Development", date: "20 May 2025", image: "https://i.ibb.co/SDkBBN3C/E-Commerce-Development.jpg" },
  { title: "IT Project Management", date: "27 May 2025", image: "https://i.ibb.co/HffTzK1g/IT-Project-Management.jpg" },
  { title: "Social Media Strategy", date: "03 Jun. 2025", image: "https://i.ibb.co/L3xVRph/Social-Media-Strategy.jpg" },
  { title: "Robotics Programming", date: "10 Jun. 2025", image: "https://i.ibb.co/cSWB4gkG/Robotics-Programming.jpg" },
  { title: "3D Animation", date: "14 Jun. 2025", image: "https://i.ibb.co/xq2xnCX7/3-D-Animation.jpg" },
  { title: "Big Data Analytics", date: "19 Jun. 2025", image: "https://i.ibb.co/nM3FYV3R/Big-Data-Analytics.jpg" },
  { title: "Ethical Hacking", date: "24 Jun. 2025", image: "https://i.ibb.co/mCZ2jPsd/Ethical-Hacking.jpg" },
  { title: "Technical Writing", date: "29 Jun. 2025", image: "https://i.ibb.co/mCD6d0cc/Technical-Writing.jpg" }
];

const Courses = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleCourses = showAll ? courses : courses.slice(0, 6);

  return (
    <div className="p-6 md:p-10 bg-white space-y-12">
      {/* Latest Courses Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-bold">Latest Courses</h2>
        <Link to="/courses" className="text-blue-600 hover:underline font-medium">View All</Link>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleCourses.map((course, idx) => (
          <div key={idx} className="bg-white shadow rounded-lg overflow-hidden">
            <img src={course.image} alt={course.title} className="w-full h-50 md:h-80 object-cover" />
            <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-800">{course.title}</h3>
              <p className="text-xs text-gray-500 mb-2">{course.date}</p>
              <button className="btn btn-sm btn-primary w-full">View Details</button>
            </div>
          </div>
        ))}
      </div>

      {/* Show More / Less Button */}
      <div className="text-center">
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showAll ? "Show Less" : "Show All"}
        </button>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-10">
        {/* Why Choose Us */}
        <div className="col-span-2 flex items-center gap-4 bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 text-4xl">🔊</div>
          <div>
            <h3 className="text-xl font-semibold mb-1">Why Choose Us</h3>
            <p className="text-gray-600 text-sm">
              Learn from industry professionals with hands-on projects and certifications that advance your career.
            </p>
          </div>
        </div>

        {/* Popular Courses Placeholder */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Popular Courses</h3>
            <Link to="/popular" className="text-blue-600 text-sm hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-full h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
