import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router";
import { toast } from "react-hot-toast";
import { XCircle } from "lucide-react";
import AuthContext from "../FirebaseAuthContext/AuthContext";

const MyEnrolledCourses = () => {
  const { user } = useContext(AuthContext);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const fetchEnrollments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/my-enrolled-courses/${user.email}`
        );
        setEnrolledCourses(res.data);
      } catch (error) {
        console.error("Failed to load enrollments", error);
        toast.error("Failed to load your enrolled courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [user]);

  const handleRemoveEnrollment = async () => {
    if (!selectedEnrollment) return;

    try {
      await axios.delete(`http://localhost:3000/enrollments/${selectedEnrollment._id}`);
      toast.success("Enrollment removed successfully");
      setEnrolledCourses((prev) =>
        prev.filter((e) => e._id !== selectedEnrollment._id)
      );
      setShowRemoveModal(false);
    } catch (error) {
      console.error("Failed to remove enrollment", error);
      toast.error("Failed to remove enrollment");
    }
  };

 const formatEnrollmentDate = (rawDate) => {
  if (!rawDate) return 'N/A';

  // Handle YYYY-MM-DD format (like "2025-02-05")
  if (typeof rawDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    rawDate += 'T00:00:00'; // Add time to make it ISO-compatible
  }

  const parsedDate = new Date(rawDate);

  if (isNaN(parsedDate.getTime())) return 'N/A';

  return parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};






  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="container mx-auto p-6 my-8 bg-white rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-4xl font-bold text-center text-blue-700 mb-8">My Enrolled Courses</h2>

      {!user && (
        <div className="text-center bg-yellow-100 border border-yellow-300 p-4 rounded mb-6">
          <p className="text-yellow-800 font-medium">
            You're not logged in. Log in to sync and manage your enrollments.
          </p>
        </div>
      )}

      {enrolledCourses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg mb-4">You haven't enrolled in any courses yet.</p>
          <Link
            to="/courses"
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                  Course Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrolled On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrolledCourses.map((enroll) => (
                <tr key={enroll._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link to={`/course/${enroll.courseId}`} className="text-blue-600 hover:underline">
                      {enroll.courseTitle}
                    </Link>
                  </td>

                  <td>
                    <p className="text-gray-500">
                      Enrolled on: {formatEnrollmentDate(enroll.timestamp)}
                    </p>



                  </td>


                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedEnrollment(enroll);
                        setShowRemoveModal(true);
                      }}
                      className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded-full transition duration-300 hover:bg-red-200 flex items-center space-x-1"
                    >
                      <XCircle size={20} /> <span>Remove</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showRemoveModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
            <XCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Removal</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove your enrollment from <br />
              <span className="font-semibold">{selectedEnrollment?.courseTitle}</span>?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowRemoveModal(false)}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveEnrollment}
                className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition duration-300"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEnrolledCourses;
