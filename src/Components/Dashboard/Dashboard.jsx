/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import {
  FaBook,
  FaSpinner,
  FaPlusSquare,
  FaTasks,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axiosSecure from "../../../api/axiosSecure";
import AuthContext from "../../FirebaseAuthContext/AuthContext";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const MotionLink = motion(Link);

// --- Modern Card Component ---
const DashboardCard = ({ to, icon: Icon, title, description, stat }) => (
  <MotionLink
    to={to}
    className="relative group overflow-hidden border border-gray-200 dark:border-gray-700 
    rounded-2xl p-6 backdrop-blur-sm 
    bg-white/60 dark:bg-gray-800/60 shadow-md 
    hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
    variants={cardVariants}
    whileHover={{ y: -4 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    {/* Glow border effect */}
    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-blue-500/10 via-indigo-500/20 to-transparent"></div>

    {/* Card Header */}
    <div className="relative z-10 flex items-center gap-4 mb-4">
      <div className="bg-gradient-to-tr from-blue-500 to-indigo-600 p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
        <Icon className="text-white text-2xl" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>

    {/* Description */}
    <p className="text-sm leading-relaxed mb-4">{description}</p>

    {/* Stats */}
    {stat && (
      <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
        {stat}
      </p>
    )}

    {/* Bottom gradient line */}
    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl"></div>
  </MotionLink>
);

// --- Main Dashboard Component ---
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.email) {
      const fetchEnrolledCount = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axiosSecure.get(
            `/my-enrolled-courses/${user.email}`
          );
          setEnrolledCount(response.data.length);
        } catch (err) {
          setError(err.message || "Failed to fetch enrolled courses.");
        } finally {
          setLoading(false);
        }
      };
      fetchEnrolledCount();
    }
  }, [user]);

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-10"
        >
          <h1 className="text-4xl font-bold mb-4 md:mb-0">
            Welcome,{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {user?.displayName || "User"}
            </span>
          </h1>
          <p className="text-sm">
            Last login: <span className="font-medium">Today</span>
          </p>
        </motion.div>

        {/* Cards Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <DashboardCard
            to="/my-enrolled-courses"
            icon={FaBook}
            title="My Enrolled Courses"
            description="View all the courses you are enrolled in."
            stat={
              loading ? (
                <FaSpinner className="animate-spin text-blue-500 text-xl" />
              ) : (
                enrolledCount
              )
            }
          />

          <DashboardCard
            to="/add-course"
            icon={FaPlusSquare}
            title="Add a New Course"
            description="Share your knowledge and create a new course."
          />

          <DashboardCard
            to="/manage-course"
            icon={FaTasks}
            title="Manage My Courses"
            description="Edit, update, or manage your existing courses."
          />

          <DashboardCard
            to="/profile"
            icon={FaUser}
            title="My Profile"
            description="Update your personal information and settings."
          />

          <DashboardCard
            to="/upcoming-course"
            icon={FaCalendarAlt}
            title="Upcoming Courses"
            description="Browse new and exciting upcoming courses."
          />
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 p-4 rounded-lg border border-red-300 dark:border-red-700"
          >
            ⚠️ Error loading stats: {error}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
