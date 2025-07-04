import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../FirebaseAuthContext/AuthContext';
import Swal from 'sweetalert2';
import NotFoundCourse from '../Components/NotFoundCourse';
import axios from 'axios';
import axiosSecure from '../../api/axiosSecure';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://course-hub-server-delta.vercel.app';

const CourseDetailsPageButton = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [userEnrollCount, setUserEnrollCount] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error('Error fetching course:', err);
        navigate('/404');
      } finally {
        setPageLoading(false);
      }
    };
    fetchCourse();
  }, [id, navigate]);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (user) {
        try {
          const res = await axios.get(`${API_BASE_URL}/my-enrolled-courses/${user.email}`);
          setUserEnrollCount(res.data.length);
          const alreadyEnrolled = res.data.find(e => e.courseId === id);
          setEnrolled(!!alreadyEnrolled);
        } catch (err) {
          console.error('Error checking enrollment:', err);
        }
      }
    };
    checkEnrollment();
  }, [user, id]);

  const handleEnrollToggle = async () => {
    if (!user || enrolling) return;
    setEnrolling(true);

    try {
      if (enrolled) {
        await axios.delete(`${API_BASE_URL}/enrollments/${user.email}/${id}`, {
          withCredentials: true,
        });
        await axios.patch(`${API_BASE_URL}/courses/${id}/seats`, { increment: 1 });
        Swal.fire({
          icon: 'info',
          title: 'Enrollment Cancelled',
          showConfirmButton: false,
          timer: 1500,
        });
        setEnrolled(false);
        setCourse(prev => ({ ...prev, seats: prev.seats + 1 }));
        setUserEnrollCount(prev => prev - 1);
        return;
      }

      if (course.seats <= 0) {
        return Swal.fire({
          icon: 'warning',
          title: 'No Seats Left',
          text: 'This course is full!',
        });
      }

      if (userEnrollCount >= 3) {
        return Swal.fire({
          icon: 'warning',
          title: 'Limit Reached',
          text: 'You cannot enroll in more than 3 courses.',
        });
      }

      await axios.post(`${API_BASE_URL}/enrollments`, {
        courseId: id,
        courseTitle: course.courseTitle,
        userEmail: user.email,
      }, {
        withCredentials: true
      });

      await axios.patch(`${API_BASE_URL}/courses/${id}/seats`, { increment: -1 });

      Swal.fire({
        icon: 'success',
        title: 'Enrolled Successfully!',
        showConfirmButton: false,
        timer: 1500,
      });

      setEnrolled(true);
      setCourse(prev => ({ ...prev, seats: prev.seats - 1 }));
      setUserEnrollCount(prev => prev + 1);

      setTimeout(() => {
        navigate('/my-enrolled-courses');
      }, 1600);
    } catch (err) {
      console.error('Enrollment error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Enrollment Failed',
        text: err?.response?.data?.error || 'Something went wrong',
      });
    } finally {
      setEnrolling(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  if (!course) return <NotFoundCourse />;

  const isButtonDisabled = !user || enrolling || (course.seats <= 0 && !enrolled);
  let buttonText = 'Enroll Now';
  if (!user) buttonText = 'Login to Enroll';
  else if (enrolling) buttonText = 'Processing...';
  else if (enrolled) buttonText = 'Unenroll';
  else if (course.seats <= 0) buttonText = 'No Seats Left';

  return (
    <div className="container mx-auto p-6 my-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <img
            src={course.imageURL || 'https://placehold.co/600x400/ECECEC/000000?text=Course+Image'}
            alt={course.courseTitle}
            className="rounded-lg w-full max-h-[400px] object-cover"
          />
        </div>

        <div className="lg:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-blue-500 dark:text-blue-400 mb-4">{course.courseTitle}</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{course.shortDescription}</p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <p><strong>Instructor:</strong> {course.instructorName}</p>
              <p><strong>Duration:</strong> {course.duration}</p>
              <p><strong>Seats Left:</strong> {course.seats > 0 ? course.seats : 'No Seats Left'}</p>
              <p><strong>Enrolled Students:</strong> {course.enrollmentCount || 0}</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Course Overview</h2>
            <p className="text-gray-700 dark:text-gray-300">
              {course.fullDescription || course.description || 'No detailed description available.'}
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleEnrollToggle}
              disabled={isButtonDisabled}
              className={`w-full px-6 py-3 text-white rounded-lg font-semibold text-lg transition-all duration-200 shadow-md
                ${isButtonDisabled
                  ? 'bg-gray-400 cursor-not-allowed'
                  : enrolled
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {buttonText}
            </button>

            {user && course.seats > 0 && !enrolled && userEnrollCount >= 3 && (
              <p className="text-red-500 text-sm mt-2 text-center">You cannot enroll in more than 3 courses.</p>
            )}
            {user && course.seats <= 0 && !enrolled && (
              <p className="text-red-500 text-sm mt-2 text-center">No seats left for this course.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPageButton;
