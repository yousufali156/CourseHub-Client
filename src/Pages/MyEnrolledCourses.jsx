import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { XCircle } from "lucide-react";
import AuthContext from "../FirebaseAuthContext/AuthContext";
import { Helmet } from "react-helmet";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://course-hub-server-delta.vercel.app";

const MyEnrolledCourses = () => {
  const { user } = useContext(AuthContext);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [coursesWithSeats, setCoursesWithSeats] = useState({});

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const fetchEnrollmentsAndCourses = async () => {
      try {
        const [enrollRes, coursesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/my-enrolled-courses/${user.email}`, {
            withCredentials: true,
          }),
          axios.get(`${API_BASE_URL}/courses`, {
            withCredentials: true,
          }),
        ]);

        setEnrolledCourses(enrollRes.data);

        const seatMap = {};
        for (const course of coursesRes.data) {
          seatMap[course._id] = course.seats || 0;
        }
        setCoursesWithSeats(seatMap);
      } catch (error) {
        console.error("Failed to load data", error);
        toast.error("Failed to load your enrolled courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentsAndCourses();
  }, [user]);

  const handleRemoveEnrollment = async () => {
    if (!selectedEnrollment?.courseId || !user?.email) {
      toast.error("No course selected or user not logged in.");
      return;
    }

    try {
      const deleteRes = await axios.delete(`${API_BASE_URL}/enrollments`, {
        data: {
          userEmail: user.email,
          courseId: selectedEnrollment.courseId,
        },
        withCredentials: true,
      });

      if (deleteRes.status === 200 || deleteRes.status === 204) {
        toast.success("Enrollment removed successfully");

        setEnrolledCourses((prev) =>
          prev.filter((e) => e._id !== selectedEnrollment._id)
        );

        setCoursesWithSeats((prev) => ({
          ...prev,
          [selectedEnrollment.courseId]:
            (prev[selectedEnrollment.courseId] || 0) + 1,
        }));

        setShowRemoveModal(false);
        setSelectedEnrollment(null);
      } else {
        toast.error("Failed to remove enrollment.");
      }
    } catch (error) {
      console.error("Error removing enrollment:", error);
      toast.error("Error removing enrollment.");
    }
  };


  const formatEnrollmentDate = (rawDate) => {
    if (!rawDate) return "N/A";
    if (typeof rawDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
      rawDate += "T00:00:00Z";
    }
    const parsedDate = new Date(rawDate);
    if (isNaN(parsedDate.getTime())) return "N/A";
    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="container mx-auto p-6 my-8 bg-base-100 rounded-lg shadow-xl border border-gray-200">
      <Helmet>
        <title>My Enrolled Courses || CourseHub</title>
      </Helmet>
      <h2 className="text-4xl font-bold text-center text-blue-700 mb-8">
        My Enrolled Courses
      </h2>

      {!user && (
        <div className="text-center bg-yellow-100 border border-yellow-300 p-4 rounded mb-6">
          <p className="text-yellow-800 font-medium">
            You're not logged in. Log in to sync and manage your enrollments.
          </p>
        </div>
      )}

      {enrolledCourses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg mb-4">You haven't enrolled in any courses yet.</p>
          <Link
            to="/courses"
            className="bg-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium bg-base-300 uppercase tracking-wider rounded-tl-lg">
                  Course Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium bg-base-300 uppercase tracking-wider">
                  Enrolled On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium bg-base-300 uppercase tracking-wider">
                  Seats Left
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium bg-base-300 uppercase tracking-wider rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-base-200 divide-y divide-gray-200">
              {enrolledCourses.map((enroll) => (
                <tr key={enroll._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-base-300">
                    <Link
                      to={`/course/${enroll.courseId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {enroll.courseTitle}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatEnrollmentDate(enroll.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {coursesWithSeats[enroll.courseId] > 0 ? (
                      <span>{coursesWithSeats[enroll.courseId]} seats left</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No Seats Left</span>
                    )}
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

      {showRemoveModal && selectedEnrollment && (
        <div className="fixed inset-0 bg-base-300 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="rounded-lg shadow-lg p-6 border-2 bg-base-100 border-red-400 w-full max-w-md text-center">
            <XCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold mb-4">Confirm Removal</h3>
            <p className="mb-6">
              Are you sure you want to remove your enrollment from <br />
              <span className="font-semibold">{selectedEnrollment.courseTitle}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowRemoveModal(false)}
                className="bg-gray-300 px-6 py-2 rounded-full font-semibold hover:bg-gray-400 transition duration-300"
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
