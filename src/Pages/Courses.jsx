import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Fetch all courses
    fetch('http://localhost:3000/courses')
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
        setCourses(sorted);
      })
      .catch(error => console.error("❌ Error fetching courses:", error));

    // Fetch popular courses (based on enrollment count)
    axios.get('http://localhost:3000/popular-courses')
      .then(res => setPopularCourses(res.data))
      .catch(err => console.error("❌ Error fetching popular courses:", err));
  }, []);

  const visibleCourses = showAll ? courses : courses.slice(0, 6);

  return (
    <div className="p-6 md:p-10 bg-base-300 space-y-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-bold">Latest Courses</h2>
        <Link to="/courses" className="text-green-500 hover:underline font-medium">View All</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleCourses.map((course) => (
          <div key={course._id} className="bg-base-300 shadow rounded-lg overflow-hidden">
            <img
              src={course.imageURL}
              alt={course.courseTitle}
              className="w-full h-50 md:h-80 object-cover"
            />
            <div className="p-3">
              <h3 className="text-sm font-semibold bg-base-300">{course.courseTitle}</h3>
              <p className="text-xs bg-base-300 mb-2">
                {new Date(course.timestamp).toLocaleDateString()}
              </p>
              <Link to={`/course-details/${course._id}`} className="w-full block">
                <button className="btn btn-sm btn-primary w-full">View Details</button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {courses.length > 6 && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showAll ? "Show Less" : "Show All"}
          </button>
        </div>
      )}






      <div className="relative w-full h-1 mt-12 mb-12 overflow-hidden rounded-full bg-blue-400">
        <div
          className="absolute inset-0 w-full h-full 
               bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-blue-500 
               bg-[length:200%_200%] animate-gradient-x"
        ></div>
      </div>
      <div className="w-full bg-base-100 py-10 px-4 md:px-10 lg:px-20 shadow-inner rounded-2xl border border-gray-200">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-blue-500 mb-6">
            🔹 Popular Courses
          </h3>

          <p className="text-base mb-8">
            Discover our most enrolled courses, trusted by thousands of learners.
            <br />
            Stay ahead with practical skills taught by top industry professionals.
          </p>

          <div className="space-y-4 text-xl font-semibold text-blue-500">
            {popularCourses.length > 0 ? (
              popularCourses.slice(0, 3).map(course => (
                <Link
                  to={`/course-details/${course._id}`}
                  key={course._id}
                  className="block hover:underline hover:text-blue-400 transition duration-300"
                >
                  {course.courseTitle}
                </Link>
              ))
            ) : (
              <>
                <div className="w-full h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-full h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-full h-5 bg-gray-200 rounded animate-pulse"></div>
              </>
            )}
          </div>
        </div>
      </div>




    </div>
  );
};

export default Courses;
