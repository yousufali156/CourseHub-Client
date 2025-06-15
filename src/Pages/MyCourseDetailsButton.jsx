import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import AuthContext from '../FirebaseAuthContext/AuthContext';
import Swal from 'sweetalert2';
import NotFoundCourse from '../Components/NotFoundCourse';
import axios from 'axios';

const MyCourseDetailsButton = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/courses/${id}`);
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
      if (user && course) {
        try {
          const res = await axios.get(`http://localhost:3000/enrollments?userEmail=${user.email}`);
          const alreadyEnrolled = res.data.find(e => e.courseId === course._id);
          if (alreadyEnrolled) setEnrolled(true);
        } catch (err) {
          console.error('Error checking enrollment:', err);
        }
      }
    };
    checkEnrollment();
  }, [user, course]);



  
const handleEnroll = async () => {
  if (!user || enrolled || enrolling || course.seats <= 0) return;

  try {
    setEnrolling(true);

    // Step 1: Post enrollment
    const enrollRes = await axios.post('http://localhost:3000/enrollments', {
      courseId: course._id,
      courseTitle: course.courseTitle,
      userEmail: user.email,
    });

    // Step 2: Update seat
    await axios.patch(`http://localhost:3000/courses/${course._id}/seats`, {
      seats: course.seats - 1,
    });

    // Step 3: Show success modal and redirect
    Swal.fire({
      icon: 'success',
      title: 'Enrolled Successfully!',
      showConfirmButton: false,
      timer: 1500,
    });

    setTimeout(() => {
      navigate('/my-enrolled-courses');
    }, 1600);

  } catch (err) {
    console.error('Enrollment failed:', err);

    // Optional: show specific error message from backend
    const message = err?.response?.data?.error || 'Something went wrong';

    Swal.fire({
      icon: 'error',
      title: 'Enrollment Failed',
      text: message,
    });
  } finally {
    setEnrolling(false);
  }
};


  if (pageLoading) return <div className="text-center py-10 text-gray-600">Loading course details...</div>;
  if (!course) return <NotFoundCourse />;

  return (
    <div className="container mx-auto p-6 my-8 bg-white rounded-lg shadow-xl">
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
            <h1 className="text-4xl font-bold text-blue-800 mb-4">{course.courseTitle}</h1>
            <p className="text-gray-700 mb-4">{course.shortDescription}</p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-800 mb-6">
              <p><strong>Instructor:</strong> {course.instructorName}</p>
              <p><strong>Duration:</strong> {course.duration}</p>
              <p><strong>Seats Left:</strong> {course.seats}</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Course Overview</h2>
            <p className="text-gray-700">{course.fullDescription}</p>
          </div>

          <div className="mt-6">
            {enrolled ? (
              <button
                disabled
                className="px-6 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
              >
                Enrolled
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={!user || enrolling || course.seats <= 0}
                className={`px-6 py-2 text-white rounded
                  ${enrolling || !user || course.seats <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {!user ? 'Login to Enroll' : enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourseDetailsButton;
