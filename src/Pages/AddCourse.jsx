import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { BookOpen, Image, Clock, Users, Calendar } from 'lucide-react';
import AuthContext from '../FirebaseAuthContext/AuthContext';

const AddCourse = () => {
  const { user, db, userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [courseTitle, setCourseTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [duration, setDuration] = useState('');
  const [seats, setSeats] = useState('');

  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user || !db) {
      toast.error("You must be logged in to add a course.");
      setLoading(false);
      return;
    }

    if (seats < 0 || isNaN(seats)) {
      toast.error("Seats must be a non-negative number.");
      setLoading(false);
      return;
    }

    try {
      const newCourse = {
        courseTitle,
        shortDescription,
        imageURL,
        duration,
        seats: parseInt(seats, 10),
        instructorEmail: user.email,
        instructorName: user.displayName || 'Anonymous Instructor',
        createdAt: new Date().toISOString(),
        status: 'active',
        createdByUserId: userId,
      };

      await addDoc(collection(db, `artifacts/${appId}/public/data/courses`), newCourse);

      toast.success("Course added successfully!");
      navigate('/manage-courses');
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error(error.message || "Failed to add course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 my-8 bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-2xl">
      <h2 className="text-4xl font-bold text-center text-blue-700 mb-8">Add New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Title */}
        <InputField
          id="courseTitle"
          icon={BookOpen}
          type="text"
          placeholder="e.g., Advanced JavaScript"
          value={courseTitle}
          onChange={setCourseTitle}
          label="Course Title"
        />

        {/* Short Description */}
        <TextAreaField
          id="shortDescription"
          icon={BookOpen}
          placeholder="A brief overview of the course content."
          value={shortDescription}
          onChange={setShortDescription}
          label="Short Description"
        />

        {/* Image URL */}
        <InputField
          id="imageURL"
          icon={Image}
          type="url"
          placeholder="https://example.com/image.jpg"
          value={imageURL}
          onChange={setImageURL}
          label="Image URL"
        />

        {/* Duration */}
        <InputField
          id="duration"
          icon={Clock}
          type="text"
          placeholder="e.g., 20 Hours"
          value={duration}
          onChange={setDuration}
          label="Duration"
        />

        {/* Seats */}
        <InputField
          id="seats"
          icon={Users}
          type="number"
          placeholder="e.g., 10"
          value={seats}
          onChange={setSeats}
          label="Available Seats"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-xl hover:bg-blue-700 transition duration-300 flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <>
              <Calendar size={20} /> <span>Add Course</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddCourse;

// 🔧 Reusable InputField Component
const InputField = ({ id, icon: Icon, type, value, onChange, placeholder, label }) => (
  <div>
    <label htmlFor={id} className="block text-gray-700 text-sm font-semibold mb-2">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        id={id}
        type={type}
        className="w-full px-4 pl-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-lg"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  </div>
);

// 🔧 Reusable TextAreaField Component
const TextAreaField = ({ id, icon: Icon, value, onChange, placeholder, label }) => (
  <div>
    <label htmlFor={id} className="block text-gray-700 text-sm font-semibold mb-2">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-3 text-gray-400" size={20} />
      <textarea
        id={id}
        rows={3}
        className="w-full px-4 pl-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-lg"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  </div>
);
