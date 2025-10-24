/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, UserPlus, User, LayoutDashboard, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import AuthContext from '../../FirebaseAuthContext/AuthContext';
import ThemeToggle from '../ThemeToggle';

const Navbar = () => {
  const { user, logOut, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // --- New State for Scroll Shadow ---
  const [isScrolled, setIsScrolled] = useState(false);

  // --- New Effect for Scroll Shadow ---
  useEffect(() => {
    const handleScroll = () => {
      // Set true if scrolled more than 10px, false otherwise
      setIsScrolled(window.scrollY > 10);
    };
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    // Cleanup function to remove listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/courses?search=${query}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  // --- New Animated NavLink Component ---
  // This component will handle the sliding underline animation
  const AnimatedNavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <li className="relative py-1"> {/* Added padding for underline space */}
        <Link
          to={to}
          className={`
            ${isActive ? 'text-yellow-300 font-semibold' : 'text-white'}
            hover:text-yellow-300 transition-colors
          `}
        >
          {children}
        </Link>
        {/* The sliding underline */}
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-300"
            layoutId="active-underline" // This ID makes the animation slide
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
        )}
      </li>
    );
  };

  if (loading) return null;

  return (
    // --- Updated Nav Class for Scroll Shadow ---
    <nav className={`
      bg-gradient-to-r from-blue-600 to-indigo-700 sticky top-0 z-50 w-full p-3
      transition-shadow duration-300
      ${isScrolled ? 'shadow-lg' : 'shadow-md'}
    `}>
      <div className="container px-4 mx-auto flex flex-wrap justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logoo.png" alt="Logo" className="h-10 w-10 rounded-full object-cover" />
          <span className="text-white text-2xl font-bold">
            Course<span className="text-yellow-300">Hub</span>
          </span>
        </Link>

        {/* Hamburger + Theme */}
        <div className="lg:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMobileMenuOpen
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M4 6h16M4 12h16M4 18h16'
                }
              />
            </svg>
          </button>
        </div>

        {/* --- Nav Links - Desktop (Updated to use AnimatedNavLink) --- */}
        <ul className="hidden lg:flex space-x-6 font-medium text-lg">
          <AnimatedNavLink to="/">Home</AnimatedNavLink>
          <AnimatedNavLink to="/courses">Courses</AnimatedNavLink>
          {user && (
            <>
              <AnimatedNavLink to="/add-course">Add Course</AnimatedNavLink>
              <AnimatedNavLink to="/manage-course">Manage Course</AnimatedNavLink>
              <AnimatedNavLink to="/my-enrolled-courses">My Enrolled</AnimatedNavLink>
              <AnimatedNavLink to="/upcoming-course">Upcoming</AnimatedNavLink>
              <AnimatedNavLink to="/contact">Contact</AnimatedNavLink>
            </>
          )}
          <AnimatedNavLink to="/about">About</AnimatedNavLink>
        </ul>

        {/* Auth Section - Desktop */}
        <div className="hidden lg:flex items-center gap-4">

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="rounded-full py-2 px-4 pr-10 text-sm text-gray-900 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300 transition w-48 focus:w-56"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-3 text-gray-600 hover:text-blue-800"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </form>

          <ThemeToggle />
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <img
                title={user.displayName || user.email}
                src={
                  user.photoURL ||
                  `https://ui-avatars.com/api/?name=${user.displayName?.charAt(0) || 'U'}&background=FFD700&color=000000`
                }
                alt="Profile"
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-yellow-300 hover:scale-105 transition"
              />

              {/* --- Improved Desktop Dropdown --- */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg z-50 bg-white dark:bg-gray-800 overflow-hidden ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <User size={16} className="text-gray-500 dark:text-gray-400" />
                      My Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <LayoutDashboard size={16} className="text-gray-500 dark:text-gray-400" />
                      Dashboard
                    </Link>
                  </div>

                  <hr className="border-gray-200 dark:border-gray-700" />

                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-full font-semibold flex items-center gap-2 shadow-md hover:bg-yellow-300 transition">
                <LogIn size={18} /> Login
              </Link>
              <Link to="/register" className="bg-blue-800 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 shadow-md hover:bg-blue-900 transition">
                <UserPlus size={18} /> Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="w-full mt-4 lg:hidden bg-indigo-700 p-4 rounded-lg space-y-2">

            {/* Search Bar - Mobile */}
            <form onSubmit={handleSearch} className="relative mb-2">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full rounded-full py-2 px-4 pr-10 text-sm text-gray-900 bg-white/80 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 text-gray-600 hover:text-blue-800"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </form>

            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:bg-blue-600 px-4 py-2 rounded">Home</Link>
            <Link to="/courses" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:bg-blue-600 px-4 py-2 rounded">Courses</Link>
            {user && (
              <>
                {/* --- Added Profile/Dashboard to Mobile --- */}
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:bg-blue-600 px-4 py-2 rounded flex items-center gap-2">
                  <User size={18} /> Profile
                </Link>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:bg-blue-600 px-4 py-2 rounded flex items-center gap-2">
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <hr className="border-blue-500 my-1" />
                {/* --- End of Added Links --- */}

                <Link to="/add-course" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:bg-blue-600 px-4 py-2 rounded">Add Course</Link>
                <Link to="/manage-course" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:bg-blue-600 px-4 py-2 rounded">Manage Course</Link>
                <Link to="/my-enrolled-courses" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:bg-blue-600 px-4 py-2 rounded">My Enrolled</Link>
                <Link to="/upcoming-course" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:bg-blue-600 px-4 py-2 rounded">Upcoming Course</Link>
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:bg-blue-600 px-4 py-2 rounded">Contact</Link>
              </>
            )}
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:bg-blue-600 px-4 py-2 rounded">About</Link>
            <hr className="border-blue-500 my-2" />
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left text-red-300 hover:bg-blue-600 px-4 py-2 flex items-center gap-2 rounded"
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:bg-blue-600 px-4 py-2 rounded">Login</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:bg-blue-600 px-4 py-2 rounded">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

