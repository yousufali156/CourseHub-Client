import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/courses')
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
        setCourses(sorted);
      })
      .catch(error => console.error("❌ Error fetching courses:", error));
  }, []);

  const visibleCourses = showAll ? courses : courses.slice(0, 6);

  return (
    <div className="p-6 md:p-10 bg-white space-y-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-bold">Latest Courses</h2>
        <Link to="/courses" className="text-blue-600 hover:underline font-medium">View All</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleCourses.map((course) => (
          <div key={course._id} className="bg-white shadow rounded-lg overflow-hidden">
            <img
              src={course.imageURL}
              alt={course.courseTitle}
              className="w-full h-50 md:h-80 object-cover"
            />
            <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-800">{course.courseTitle}</h3>
              <p className="text-xs text-gray-500 mb-2">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-10">
        <div className="col-span-2 flex items-center gap-4 bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 text-4xl">🔊</div>
          <div>
            <h3 className="text-xl font-semibold mb-1">Why Choose Us</h3>
            <p className="text-gray-600 text-sm">
              Learn from industry professionals with hands-on projects and certifications that advance your career.
            </p>
          </div>
        </div>

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
