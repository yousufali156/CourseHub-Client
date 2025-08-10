import React, { useEffect, useState } from 'react';
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
  FaArrowUp,
} from 'react-icons/fa';
import { Link } from 'react-router-dom'; // fix: use `react-router-dom`

const Footer = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gray-900 text-white py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Social */}
        <div>
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logoo.png" alt="Logo" className="h-10 w-10 rounded-full object-cover" />
            <span className="text-white text-2xl font-bold">
              Course<span className="text-yellow-300">Hub</span>
            </span>
          </Link>
          <p className="text-sm mt-2 text-gray-300">
            Empowering learning anywhere, anytime.<br />
            Connect, grow, and achieve your goals with expert-led courses.
          </p>
          <div className="mt-4 flex space-x-4 text-xl">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500"><FaFacebookF /></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300"><FaGithub /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300"><FaLinkedinIn /></a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300"><FaTwitter /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500"><FaYoutube /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500"><FaInstagram /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Useful Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/courses" className="hover:underline">Courses</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Join Our Newsletter</h3>
          <p className="text-sm text-gray-300 mb-4">
            Subscribe to get the latest updates and course offers.
          </p>
          <form className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full sm:w-auto flex-1 px-4 py-2 text-black rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} CourseHub. All rights reserved.
      </div>

      {/* Jump to Top Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
        >
          <FaArrowUp />
        </button>
      )}
    </footer>
  );
};

export default Footer;
