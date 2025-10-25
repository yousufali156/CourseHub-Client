import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import axios from 'axios';
import { Helmet } from "react-helmet";
import { FaSpinner, FaSearch } from 'react-icons/fa'; // Added FaSearch
import PopularCourses from './PopularCourses';

// Create a public axios instance
const axiosPublic = axios.create({
    baseURL: 'https://course-hub-server-delta.vercel.app' // Your deployed backend URL
});

const Courses = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Added for local search
  const [originalCourses, setOriginalCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [sortOption, setSortOption] = useState('latest');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState(''); // State for the new search bar

  // Extract search query from URL (driven by Navbar or local search)
  const searchQuery = useMemo(() => new URLSearchParams(location.search).get('search'), [location.search]);

  // Handle local search submission
  const handleLocalSearch = (e) => {
    e.preventDefault();
    // Navigate to the same page but with the search query
    navigate(`/courses?search=${searchTerm}`);
  };

  // --- Fetch Data using axiosPublic ---
  useEffect(() => {
    setLoadingCourses(true);
    setError(null);

    const courseParams = new URLSearchParams();
    if (searchQuery) {
        courseParams.append('search', searchQuery);
        setSearchTerm(searchQuery); // Sync local search bar with URL query
    } else {
        setSearchTerm(''); // Clear local search bar if no URL query
    }
    
    axiosPublic.get(`/courses?${courseParams.toString()}`)
      .then(res => {
        if (Array.isArray(res.data)) {
            const validCourses = res.data.filter(course => course?._id);
            setOriginalCourses(validCourses);
        } else {
            console.error("❌ Courses response is not an array:", res.data);
            setOriginalCourses([]);
            setError("Failed to load courses: Invalid data format.");
        }
      })
      .catch(err => {
        console.error("❌ Error fetching courses:", err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch courses.');
      })
      .finally(() => setLoadingCourses(false));
    
  }, [searchQuery]); // Re-fetch only if search query changes

  // --- Calculate Sorted Courses using useMemo ---
  const sortedCourses = useMemo(() => {
    let coursesToSort = [...originalCourses];

    coursesToSort.sort((a, b) => {
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
          valueA = a.enrollmentCount || 0;
          valueB = b.enrollmentCount || 0;
          return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;

        case 'latest':
        default:
          valueA = new Date(a.timestamp || 0); 
          valueB = new Date(b.timestamp || 0);
          return sortDirection === 'asc' ? valueA - valueB : valueB - valueA; 
      }
    });

    return coursesToSort;
  }, [originalCourses, sortOption, sortDirection]);

  const visibleCourses = showAll ? sortedCourses : sortedCourses.slice(0, 8);

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-12 min-h-[calc(100vh-200px)]">
      <Helmet>
        <title>{searchQuery ? `Search Results for "${searchQuery}"` : 'All Courses'} || CourseHub</title>
      </Helmet>

      {/* Heading + Sort Controls */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b pb-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Courses'}
        </h2>
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm font-medium">Sort by:</label>
          <select
            id="sort"
            className="px-3 py-1.5 text-sm border rounded-md shadow-sm bg-white text-black dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="latest">🕒 Latest</option>
            <option value="oldest">📅 Oldest</option>
            <option value="title">🔤 Title</option>
            <option value="popularity">🔥 Popularity</option>
          </select>
          <button
            onClick={() => setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200 text-sm font-medium"
            title="Toggle Sort Direction"
          >
            {sortDirection === 'asc' ? (
              <>
                <span>Asc</span> <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
              </>
            ) : (
              <>
                <span>Desc</span> <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* --- New Search Bar --- */}
      <form onSubmit={handleLocalSearch} className="mb-8 flex gap-2">
        <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses on this page..."
            className="flex-grow px-4 py-2 border rounded-md shadow-sm bg-white text-black dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
            type="submit"
            className="btn btn-primary flex items-center gap-2"
        >
            <FaSearch />
            <span>Search</span>
        </button>
      </form>


      {/* Loading State */}
      {loadingCourses && (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="text-4xl text-blue-500 animate-spin" />
          <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading Courses...</span>
        </div>
      )}

      {/* Error State */}
      {!loadingCourses && error && (
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
           <strong className="font-bold">Error!</strong>
           <span className="block sm:inline ml-2">{error}</span>
         </div>
      )}

      {/* No Courses Found State */}
       {!loadingCourses && !error && sortedCourses.length === 0 && (
         <div className="text-center py-20">
           <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {searchQuery ? 'No Courses Found Matching Your Search' : 'No Courses Available Yet'}
           </h3>
           <p className="text-gray-500 dark:text-gray-400">
            {searchQuery ? 'Try broadening your search terms.' : 'Please check back later.'}
           </p>
         </div>
       )}

      {/* Grid of Course Cards */}
      {!loadingCourses && !error && sortedCourses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleCourses.map((course) => (
            <div key={course._id} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col">
              <img
                src={course.imageURL || 'https://placehold.co/600x400/ECECEC/000000?text=No+Image'} 
                alt={course.courseTitle}
                className="w-full h-48 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/ECECEC/FF0000?text=Load+Error' }}
              />
              <div className="p-4 flex flex-col flex-grow space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex-grow">{course.courseTitle}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  📅 Added: {course.timestamp 
                    ? new Date(course.timestamp).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
                    : 'No date'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  👥 {course.enrollmentCount || 0} learners
                </p>
                <Link to={`/course-details/${course._id}`} className="w-full mt-auto block pt-2">
                  <button className="btn btn-sm btn-primary w-full">View Details</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show All Button */}
      {!loadingCourses && !error && sortedCourses.length > 8 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            {showAll ? "Show Less Courses" : "Show All Courses"}
          </button>
        </div>
      )}

      {/* Separator */}
       {!loadingCourses && !error && sortedCourses.length > 0 && (
        <hr className="my-12 border-t border-gray-300 dark:border-gray-700" />
       )}

      {/* Popular Courses Section  */}
      <PopularCourses />
      
    </div>
  );
};

export default Courses;

