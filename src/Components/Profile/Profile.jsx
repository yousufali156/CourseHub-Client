import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaImage,
  FaSpinner,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import AuthContext from "../../FirebaseAuthContext/AuthContext";
import axiosSecure from "../../../api/axiosSecure"; // Ensure this path is correct

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
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFetchingDB, setIsFetchingDB] = useState(true);

  // Step 1: Populate form fields from Firebase Auth
  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  // Step 2: Fetch and populate additional fields from MongoDB
  useEffect(() => {
    if (user?.email) {
      const fetchUserDataFromDB = async () => {
        setIsFetchingDB(true);
        try {
          // Fetch additional user data from your /users/:email endpoint
          const { data } = await axiosSecure.get(`/users/${user.email}`);
          if (data) {
            setPhone(data.phone || "");
            setAddress(data.address || "");
          }
        } catch (error) {
          console.error("Failed to fetch user data from DB:", error);
          // Don't show a toast, just log the error
        } finally {
          setIsFetchingDB(false);
        }
      };

      fetchUserDataFromDB();
    }
  }, [user?.email]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      // --- Step 1: Update Firebase Authentication ---
      // This updates user.displayName and user.photoURL in Firebase
      await updateUserProfile(name, photoURL);
      toast.success("Firebase profile updated!");

      // --- Step 2: Update MongoDB Database ---
      // This calls your PUT /users/:email endpoint
      const userDataToSave = {
        name: name,
        photoURL: photoURL,
        phone: phone,
        address: address,
      };

      await axiosSecure.put(`/users/${user.email}`, userDataToSave);
      toast.success("Database profile saved!");

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

  if (authLoading || isFetchingDB) {
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
            src={
              user.photoURL ||
              `https://ui-avatars.com/api/?name=${
                user.displayName || "User"
              }&background=random`
            }
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

          {/* Phone Number (New) */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaPhone className="text-gray-400" />
              </span>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Address (New) */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaMapMarkerAlt className="text-gray-400" />
              </span>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-10 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your address"
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

