import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import AuthContext from '../FirebaseAuthContext/AuthContext';
import { useNavigate } from 'react-router';

const AddCourse = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [courseTitle, setCourseTitle] = useState('');
  const [image, setImage] = useState('');
  const [seats, setSeats] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddCourse = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to add a course.');
      return;
    }

    if (!courseTitle || !image || !seats || !duration || !description) {
      toast.error('Please fill in all fields.');
      return;
    }

    const newCourse = {
      courseTitle,
      image,
      seats: parseInt(seats),
      duration,
      description,
      instructorEmail: user.email,
      timestamp: new Date().toISOString(),
    };

    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourse),
      });

      if (!res.ok) throw new Error('Failed to add course');

      toast.success('Course added successfully!');
      navigate('/manage-course');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 rounded-lg shadow-md mt-10 border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">Add New Course</h2>
      <form onSubmit={handleAddCourse} className="space-y-6">
        {/* Course Title */}
        <div>
          <label className="block font-medium mb-2">Course Title</label>
          <input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course title"
            required
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block font-medium mb-2">Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course image URL"
            required
          />
        </div>

        {/* Available Seats */}
        <div>
          <label className="block font-medium mb-2">Available Seats</label>
          <input
            type="number"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Total seats (e.g., 10)"
            min={1}
            required
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block  font-medium mb-2">Duration</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 4 weeks, 2 months"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block  font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Enter full course description"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Add Course'}
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
