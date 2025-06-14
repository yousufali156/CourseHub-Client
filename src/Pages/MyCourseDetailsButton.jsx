import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { Star } from 'lucide-react';
import { toast } from 'react-toastify';
import AuthContext from '../FirebaseAuthContext/AuthContext';

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/course/${id}`);
        setCourse(res.data);
      } catch (err) {
        toast.error('Course not found');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (user && course) {
        try {
          const res = await axios.get(`http://localhost:3000/enrollments/${user.uid}`);
          const enrolledIds = res.data.map((item) => item.courseId);
          setIsEnrolled(enrolledIds.includes(id));
        } catch (err) {
          console.error('Enrollment check failed');
        }
      }
    };
    checkEnrollment();
  }, [user, course, id]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please log in to enroll');
      return;
    }

    try {
      await axios.post('http://localhost:3000/enroll', {
        userId: user.uid,
        courseId: id,
        enrolledAt: new Date(),
      });

      toast.success('Enrolled successfully');
      setIsEnrolled(true);
    } catch (err) {
      toast.error('Enrollment failed');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-600 text-xl">Loading...</div>;
  }

  if (!course) {
    return <div className="text-center py-20 text-red-600 text-xl">Course not found!</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      {/* Image Section */}
      <div>
        <img
          src={course.imageURL}
          alt={course.courseTitle}
          className="w-full h-80 object-cover rounded-lg shadow-md border"
        />
      </div>

      {/* Info Section */}
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-blue-800">{course.courseTitle}</h2>
        <p className="text-gray-700 text-lg">{course.shortDescription}</p>

        <div className="grid grid-cols-2 gap-4 mt-4 text-gray-800 text-base">
          <div>
            <span className="font-semibold">Instructor:</span> {course.instructor || 'N/A'}
          </div>
          <div>
            <span className="font-semibold">Duration:</span> {course.duration}
          </div>
          <div>
            <span className="font-semibold">Seats Left:</span> {course.seats}
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Rating:</span>
            <span>{course.rating || 0}</span>
            <Star size={18} className="text-yellow-500" fill="yellow" />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Course Overview</h3>
          <p className="text-gray-700">{course.description || 'No detailed description provided.'}</p>
        </div>

        <div className="mt-6">
          <button
            onClick={handleEnroll}
            disabled={isEnrolled}
            className={`px-6 py-3 text-lg rounded-md shadow-md font-semibold transition duration-300 ${
              isEnrolled
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isEnrolled ? 'Enrolled' : 'Enroll Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
