import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Edit, Trash2, Info } from 'react-feather';
import AuthContext from '../FirebaseAuthContext/AuthContext';
import axiosSecure from '../../api/axiosSecure';
import { Helmet } from "react-helmet";



const ManageCourse = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const fetchCourses = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await axiosSecure.get(`/courses?instructorEmail=${user.email}`);
      const sorted = res.data.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setCourses(sorted);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load your courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchCourses();
    }
  }, [user, authLoading]);

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    try {
      setLoading(true);
      await axiosSecure.delete(`/courses/${courseToDelete._id}`);
      toast.success(`Course "${courseToDelete.courseTitle}" deleted successfully!`);
      setShowDeleteModal(false);
      setCourseToDelete(null);
      fetchCourses();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete course.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="text-center py-10">
        <p className="text-lg font-medium">Loading your courses...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-8 my-8 text-center bg-base-300 rounded-lg shadow-xl border border-gray-200">
        <p className="text-2xl text-red-600 font-semibold mb-4">You must be logged in to manage courses.</p>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
        >
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 my-8 bg-base-300 rounded-lg shadow-xl border border-gray-200">
      <Helmet>
        <title>Manage Courses || CourseHub</title> 
      </Helmet>
      <h2 className="text-4xl font-bold text-center text-blue-500 mb-8">Manage Your Courses</h2>

      {courses.length === 0 ? (
        <div className="text-center py-10">
          <p className=" text-lg mb-4">You haven't added any courses yet.</p>
          <Link
            to="/add-course"
            className="bg-green-600 px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition duration-300 shadow-md"
          >
            Add Your First Course
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md border">
          <table className="min-w-full divide-y border">
            <thead className="bg-green-400">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Course Title</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Seats</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {courses.map((course) => (
                <tr key={course._id}>
                  <td className="px-6 py-4 text-sm font-medium">{course.courseTitle}</td>
                  <td className="px-6 py-4 text-sm line-clamp-2">{course.description}</td>
                  <td className="px-6 py-4 text-sm">{course.seats}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/edit-course/${course._id}`}
                        className="text-blue-500 hover:text-blue-900 bg-blue-100 p-2 rounded-full"
                        title="Edit Course"
                      >
                        <Edit size={20} />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(course)}
                        className="text-red-500 hover:text-red-700 p-2 bg-blue-100 rounded-full"
                        title="Delete Course"
                      >
                        <Trash2 size={20} />
                      </button>
                      <Link
                        to={`/course/${course._id}`}
                        className="text-green-500 hover:text-green-900 bg-blue-100 p-2 rounded-full"
                        title="View Details"
                      >
                        <Info size={20} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-base-300 rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
            <Trash2 className="text-red-500 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete "<span className="font-semibold">{courseToDelete?.courseTitle}</span>"?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 px-6 py-2 rounded-full font-semibold hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourse;
