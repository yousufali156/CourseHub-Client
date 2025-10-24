/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaImage, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import AuthContext from "../../FirebaseAuthContext/AuthContext";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Profile = () => {
  const { user, updateUserProfile, loading: authLoading } = useContext(AuthContext);

  // State for form fields
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Populate form fields when user data is available
  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      // Call the updateUserProfile function from AuthContext
      await updateUserProfile(name, photoURL);
      toast.success("Profile updated successfully!");
      
      // Manually trigger a page reload to show updated user info everywhere
      // This is often needed as auth.currentUser updates can be slow to propagate
      window.location.reload(); 

    } catch (error) {
      toast.error(`Update failed: ${error.message}`);
      console.error("Profile update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8"
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-lg mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {user.displayName || "User Profile"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
        </div>

        {/* Profile Update Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email (Read-only) */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaEnvelope className="text-gray-400" />
              </span>
              <input
                id="email"
                type="email"
                value={user.email || ""}
                readOnly
                className="w-full pl-10 p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaUser className="text-gray-400" />
              </span>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Photo URL */}
          <div>
            <label
              htmlFor="photoURL"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Photo URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaImage className="text-gray-400" />
              </span>
              <input
                id="photoURL"
                type="text"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="w-full pl-10 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a URL for your profile picture"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-wait"
            >
              {isUpdating ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
