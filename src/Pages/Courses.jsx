import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { Helmet } from "react-helmet";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [sortOption, setSortOption] = useState('latest');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    // Fetch all courses
    fetch('https://course-hub-server-delta.vercel.app/courses')
      .then(res => res.json())
      .then(data => {
        const validCourses = data.filter(course => course._id);
        setCourses(validCourses);
      })
      .catch(error => console.error("❌ Error fetching courses:", error));

    // Fetch popular courses
    axios.get('https://course-hub-server-delta.vercel.app/popular-courses')
      .then(res => setPopularCourses(res.data.filter(c => c._id)))
      .catch(err => console.error("❌ Error fetching popular courses:", err));
  }, []);

  // Sort courses when option or direction changes
  useEffect(() => {
    let sortedCourses = [...courses];

    sortedCourses.sort((a, b) => {
      let valueA, valueB;

      switch (sortOption) {
        case 'title':
          valueA = a.courseTitle || '';
          valueB = b.courseTitle || '';
          return sortDirection === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);

        case 'oldest':
          valueA = new Date(a.timestamp || 0);
          valueB = new Date(b.timestamp || 0);
          return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;

        case 'popularity':
          valueA = a.enrolledCount || a.views || 0;
          valueB = b.enrolledCount || b.views || 0;
          return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;

        case 'latest':
        default:
          valueA = new Date(a.timestamp || 0);
          valueB = new Date(b.timestamp || 0);
          return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
    });

    setCourses(sortedCourses);
  }, [sortOption, sortDirection]);

  const visibleCourses = showAll ? courses : courses.slice(0, 8);

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-12">
      <Helmet>
        <title>All Courses || CourseHub</title>
      </Helmet>

      {/* Heading + Sort Controls */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">Courses</h2>

        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm font-medium">Sort by:</label>

          {/* Sort Dropdown */}
          <select
            id="sort"
            className="px-3 py-1.5 text-sm border rounded-md shadow-sm
             bg-white text-black dark:bg-gray-800 dark:text-white 
             border-gray-300 dark:border-gray-600 
             focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="latest">🕒 Latest</option>
            <option value="oldest">📅 Oldest</option>
            <option value="title">🔤 Title (A-Z)</option>
            <option value="popularity">🔥 Popularity</option>
          </select>


          {/* Toggle Button */}
          <button
            onClick={() =>
              setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
            }
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-200 transition duration-200 text-sm font-medium"
            title="Toggle Sort Direction"
          >
            {sortDirection === 'asc' ? (
              <>
                <span>Asc</span> <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"
                  viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round"
                    d="M5 15l7-7 7 7" /></svg>
              </>
            ) : (
              <>
                <span>Desc</span> <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"
                  viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round"
                    d="M19 9l-7 7-7-7" /></svg>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Grid of Course Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {visibleCourses.map((course) => (
          <div key={course._id} className="bg-base-100 shadow rounded-lg overflow-hidden">
            <img
              src={course.imageURL || 'https://placehold.co/600x400/ECECEC/000000?text=No+Image'}
              alt={course.courseTitle}
              className="w-full h-52 md:h-64 object-cover"
            />
            <div className="p-3 space-y-2">
              <h3 className=" font-semibold">{course.courseTitle}</h3>
              <p className="text-xs">
                {course.timestamp
                  ? new Date(course.timestamp).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                  : 'No date'}
              </p>
              <p className="text-xs ">
                👥 {course.enrolledCount || course.views || 0} learners
              </p>
              <Link to={`/course-details/${course._id}`} className="w-full block">
                <button className="btn btn-sm btn-primary w-full">View Details</button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Show All Button */}
      {courses.length > 8 && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showAll ? "Show Less" : "Show All"}
          </button>
        </div>
      )}

      {/* Gradient Divider */}
      <div className="relative w-full h-1 mt-12 mb-12 overflow-hidden rounded-full bg-blue-400">
        <div
          className="absolute inset-0 w-full h-full
            bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-blue-500
            bg-[length:200%_200%] animate-gradient-x"
        ></div>
      </div>

      {/* Popular Courses Section */}
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
