import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import axiosPublic from '../../api/axiosPublic'; 

const PopularCourses = () => {
  const [popularCourses, setPopularCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosPublic.get('/popular-courses');
        if (Array.isArray(res.data)) {
          setPopularCourses(res.data.filter(c => c?._id));
        } else {
          console.error("❌ Popular courses response is not an array:", res.data);
          setPopularCourses([]);
        }
      } catch (err) {
        console.error("❌ Error fetching popular courses:", err);
        setError(err.message || 'Failed to fetch popular courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCourses();
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 py-10 px-4 md:px-10 shadow-inner rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          🔥 Popular Courses
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Check out the courses trending among our learners!
        </p>

        {/* 🔄 Loading State */}
        {loading && (
          <div className="flex justify-center">
            <FaSpinner className="animate-spin text-blue-500 text-3xl" />
          </div>
        )}

        {/* ⚠️ Error State */}
        {!loading && error && (
          <p className="text-red-500 dark:text-red-400">Error: {error}</p>
        )}

        {/* 💤 Empty State */}
        {!loading && !error && popularCourses.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            No popular courses available right now.
          </p>
        )}

        {/* ✅ Content State */}
        {!loading && !error && popularCourses.length > 0 && (
          <div className="space-y-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
            {popularCourses.slice(0, 5).map(course => (
              <Link
                to={`/course-details/${course._id}`}
                key={course._id}
                className="block hover:text-blue-500 dark:hover:text-blue-400 transition duration-300 underline underline-offset-4 decoration-blue-200 dark:decoration-blue-700 hover:decoration-blue-500 dark:hover:decoration-blue-400"
              >
                {course.courseTitle} ({course.enrollCount} enrolled)
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularCourses;
