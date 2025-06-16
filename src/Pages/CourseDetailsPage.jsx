import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../FirebaseAuthContext/AuthContext';
import Swal from 'sweetalert2';
import NotFoundCourse from '../Components/NotFoundCourse';
import axios from 'axios';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [userEnrollCount, setUserEnrollCount] = useState(0);

  // ✅ Fetch course by ID
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

  // ✅ Check if user is already enrolled + how many total courses enrolled
  useEffect(() => {
    const checkEnrollment = async () => {
      if (user) {
        try {
          const res = await axios.get(`http://localhost:3000/my-enrolled-courses/${user.email}`);
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

  // ✅ Enroll / Unenroll Handler
  const handleEnrollToggle = async () => {
    if (!user || enrolling) return;

    try {
      setEnrolling(true);

      // 🔻 If already enrolled → UNENROLL
      if (enrolled) {
        await axios.delete(`http://localhost:3000/enrollments`, {
          data: { userEmail: user.email, courseId: id }
        });

        await axios.patch(`http://localhost:3000/courses/${id}/seats`, {
          seats: course.seats + 1
        });

        Swal.fire({
          icon: 'success',
          title: 'Unenrolled Successfully!',
          showConfirmButton: false,
          timer: 1500
        });

        setEnrolled(false);
        setCourse(prev => ({ ...prev, seats: prev.seats + 1 }));
        setUserEnrollCount(prev => prev - 1);
        return;
      }

      // 🔺 If not enrolled → ENROLL
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

      await axios.post('http://localhost:3000/enrollments', {
        courseId: id,
        courseTitle: course.courseTitle,
        userEmail: user.email,
      });

      await axios.patch(`http://localhost:3000/courses/${id}/seats`, {
        seats: course.seats - 1
      });

      Swal.fire({
        icon: 'success',
        title: 'Enrolled Successfully!',
        showConfirmButton: false,
        timer: 1500,
      });

      setEnrolled(true);
      setCourse(prev => ({ ...prev, seats: prev.seats -1 }));
      setUserEnrollCount(prev => prev  +1);

      // Redirect to My Enrolled Courses
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

  if (pageLoading) return <div className="text-center py-10 text-base-300">Loading course details...</div>;
  if (!course) return <NotFoundCourse />;

  return (
    <div className="container mx-auto p-6 my-8 bg-base-300 rounded-lg shadow-xl">
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
            <h1 className="text-4xl font-bold text-blue-500 mb-4">{course.courseTitle}</h1>
            <p className="bg-base-300 mb-4">{course.shortDescription}</p>

            <div className="grid grid-cols-2 gap-4 text-sm bg-base-300 mb-6">
              <p><strong>Instructor:</strong> {course.instructorName}</p>
              <p><strong>Duration:</strong> {course.duration}</p>
              <p><strong>Seats Left:</strong> {course.seats > 0 ? course.seats : 'No Seats Left'}</p>
            </div>

            <h2 className="text-2xl font-semibold bg-base-300 mb-2">Course Overview</h2>
            <p className="bg-base-300">{course.fullDescription}</p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleEnrollToggle}
              disabled={!user || enrolling}
              className={`px-6 py-2 text-white rounded transition-all duration-200
                ${!user || enrolling
                  ? 'bg-gray-400 cursor-not-allowed'
                  : enrolled
                  ? 'bg-red-600 hover:bg-red-700'
                  : course.seats <= 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {!user
                ? 'Login to Enroll'
                : enrolling
                ? 'Processing...'
                : enrolled
                ? 'Unenroll'
                : course.seats <= 0
                ? 'No Seats Left'
                : 'Enroll Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
