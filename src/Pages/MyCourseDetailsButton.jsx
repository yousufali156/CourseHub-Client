import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AuthContext from "../FirebaseAuthContext/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const MyCourseDetailsButton = ({ courseId }) => {
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/courses/${courseId}`);
        setCourse(response.data);
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    const checkEnrollment = async () => {
      if (user?.email) {
        try {
          const res = await axios.get(`${API_BASE_URL}/my-enrolled-courses/${user.email}`);
          const enrolled = res.data.some((enr) => enr.courseId === courseId);
          setIsEnrolled(enrolled);
        } catch (err) {
          console.error("Error checking enrollment:", err);
        }
      }
    };

    fetchCourse();
    checkEnrollment();
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (!user?.email) return;

    try {
      const res = await axios.post(`${API_BASE_URL}/enrollments`, {
        userEmail: user.email,
        courseId: course._id,
        courseTitle: course.courseTitle
      });

      if (res.data.message === "Enrolled successfully") {
        Swal.fire({
          icon: "success",
          title: "Enrolled Successfully!",
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.reload(); // ✅ Update UI
        });
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      Swal.fire("Error", err.response?.data?.error || "Enrollment failed", "error");
    }
  };

  const handleUnenroll = async () => {
    if (!user?.email) return;

    try {
      const res = await axios.delete(`${API_BASE_URL}/enrollments`, {
        data: { userEmail: user.email, courseId: course._id }
      });

      if (res.data.message === "Unenrolled successfully and seat count updated") {
        Swal.fire({
          icon: "success",
          title: "Unenrolled!",
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.reload(); // ✅ Update UI
        });
      }
    } catch (err) {
      console.error("Unenroll error:", err);
      Swal.fire("Error", err.response?.data?.error || "Unenroll failed", "error");
    }
  };

  if (loading) return <p>Loading course...</p>;
  if (!course) return <p>Course not found</p>;

  return (
    <div className="text-center mt-6">
      {user ? (
        isEnrolled ? (
          <button
            onClick={handleUnenroll}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Unenroll
          </button>
        ) : course.seats > 0 ? (
          <button
            onClick={handleEnroll}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Enroll Now ({course.seats} seats left)
          </button>
        ) : (
          <p className="text-red-600 font-medium">No seats left</p>
        )
      ) : (
        <p className="text-gray-600">Please log in to enroll.</p>
      )}
    </div>
  );
};

export default MyCourseDetailsButton;
