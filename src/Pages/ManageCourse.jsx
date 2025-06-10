import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Edit, Trash2, Info } from 'react-feather';
import AuthContext from '../FirebaseAuthContext/AuthContext';

// import LoadingSpinner from '../Components/LoadingSpinner';


const ManageCourse = () => {
  const { user, db, loading: authLoading } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  useEffect(() => {
    if (!authLoading && user && db) {
      setLoading(true);
      try {
        const coursesRef = collection(db, `artifacts/${appId}/public/data/courses`);
        const q = query(coursesRef, where('instructorEmail', '==', user.email));

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const fetchedCourses = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            fetchedCourses.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setCourses(fetchedCourses);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching managed courses:', error);
            toast.error('Failed to load your courses.');
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error('Error setting up Firestore listener:', error);
        toast.error('Failed to set up real-time course updates.');
        setLoading(false);
      }
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, db, authLoading, appId]);

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete || !db) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, `artifacts/${appId}/public/data/courses`, courseToDelete.id));
      toast.success(`Course "${courseToDelete.courseTitle}" deleted successfully!`);
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return ;
  }

  if (!user) {
    return (
      <div className="container mx-auto p-8 my-8 text-center bg-white rounded-lg shadow-xl border border-gray-200">
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
    <div className="container mx-auto p-6 my-8 bg-white rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-4xl font-bold text-center text-blue-700 mb-8">Manage Your Courses</h2>

      {courses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg mb-4">You haven't added any courses yet.</p>
          <Link
            to="/add-course"
            className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition duration-300 shadow-md"
          >
            Add Your First Course
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
                >
                  Course Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Short Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seats
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.courseTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{course.shortDescription}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{course.seats}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/edit-course/${course.id}`}
                        className="text-blue-600 hover:text-blue-900 bg-blue-100 p-2 rounded-full transition duration-300 hover:bg-blue-200"
                        title="Edit Course"
                      >
                        <Edit size={20} />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(course)}
                        className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded-full transition duration-300 hover:bg-red-200"
                        title="Delete Course"
                      >
                        <Trash2 size={20} />
                      </button>
                      <Link
                        to={`/course/${course.id}`}
                        className="text-gray-600 hover:text-gray-900 bg-gray-100 p-2 rounded-full transition duration-300 hover:bg-gray-200"
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
            <Trash2 className="text-red-500 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "<span className="font-semibold">{courseToDelete?.courseTitle}</span>"? This
              action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
