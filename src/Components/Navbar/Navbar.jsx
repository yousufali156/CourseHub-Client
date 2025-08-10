import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { LogIn, LogOut, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AuthContext from '../../FirebaseAuthContext/AuthContext';
import ThemeToggle from '../ThemeToggle';

const Navbar = () => {
  const { user, signOutUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOutUser();
      localStorage.removeItem('access-token');
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

  const navLinkClass = (path) =>
    location.pathname === path
      ? 'text-yellow-300 font-semibold border-b-2 border-yellow-300 pb-1'
      : 'text-white hover:text-yellow-300 transition';

  if (loading) return null;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md sticky top-0 z-50 w-full p-3">
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

        {/* Nav Links - Desktop */}
        <ul className="hidden lg:flex space-x-6 font-medium text-lg">
          <li><Link to="/" className={navLinkClass('/')}>Home</Link></li>
          <li><Link to="/courses" className={navLinkClass('/courses')}>Courses</Link></li>
          {user && (
            <>
              <li><Link to="/add-course" className={navLinkClass('/add-course')}>Add Course</Link></li>
              <li><Link to="/manage-course" className={navLinkClass('/manage-course')}>Manage Course</Link></li>
              <li><Link to="/my-enrolled-courses" className={navLinkClass('/my-enrolled-courses')}>My Enrolled</Link></li>
              <li><Link to="/upcoming-course" className={navLinkClass('/upcoming-course')}>Upcoming</Link></li>
              <li><Link to="/contact" className={navLinkClass('/contact')}>Contact</Link></li>
            </>
          )}
          <li><Link to="/about" className={navLinkClass('/about')}>About</Link></li>
        </ul>

        {/* Auth Section - Desktop */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <img
                title={user.displayName || user.email}
                src={
                  user.photoURL ||
                  `https://placehold.co/40x40/FFD700/000000?text=${user.displayName?.charAt(0) || 'U'}`
                }
                alt="Profile"
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-yellow-300 hover:scale-105 transition"
              />
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 bg-gradient-to-r from-indigo-500 to-blue-500">
                  <span className="block px-4 py-2 text-sm truncate">{user.displayName || user.email}</span>
                  <hr className="border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 flex items-center text-red-600 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
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
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:bg-blue-600 px-4 py-2 rounded">Home</Link>
            <Link to="/courses" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:bg-blue-600 px-4 py-2 rounded">Courses</Link>
            {user && (
              <>
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
                <LogOut size={18} /> Logout ({user.displayName || user.email})
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
