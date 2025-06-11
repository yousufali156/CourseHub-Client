import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import {
  doc, getDoc, collection, query, where,
  getDocs, addDoc, updateDoc, deleteDoc
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import NotFoundCourse from '../Components/NotFoundCourse';
import AuthContext from '../FirebaseAuthContext/AuthContext';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, db, userId } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [seatsLeft, setSeatsLeft] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [userEnrollmentsCount, setUserEnrollmentsCount] = useState(0);

  const appId = import.meta.env.VITE_appId || 'default-app-id';
  const courseDocPath = `artifacts/${appId}/public/data/courses`;
  const userEnrollmentsPath = `artifacts/${appId}/users/${userId}/enrollments`;

  const fetchCourseDetails = async () => {
    if (!db) return;

    try {
      setPageLoading(true);
      const courseRef = doc(db, courseDocPath, id);
      const courseSnap = await getDoc(courseRef);

      if (!courseSnap.exists()) {
        toast.error("Course not found!");
        navigate('/404');
        return;
      }

      const courseData = { id: courseSnap.id, ...courseSnap.data() };
      setCourse(courseData);
      setSeatsLeft(courseData.seats || 0);

      if (user) {
        const userEnrollmentsRef = collection(db, userEnrollmentsPath);

        const courseEnrollmentQuery = query(
          userEnrollmentsRef,
          where("courseId", "==", id),
          where("userEmail", "==", user.email)
        );
        const courseEnrollmentSnap = await getDocs(courseEnrollmentQuery);
        setIsEnrolled(!courseEnrollmentSnap.empty);

        const totalEnrollmentsQuery = query(
          userEnrollmentsRef,
          where("userEmail", "==", user.email)
        );
        const totalEnrollmentsSnap = await getDocs(totalEnrollmentsQuery);
        setUserEnrollmentsCount(totalEnrollmentsSnap.size);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Failed to load course.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && db) {
      fetchCourseDetails();
    }
  }, [id, user, authLoading, db]);

  const handleEnrollment = async () => {
    if (!user) {
      toast.error("Please log in to enroll.");
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!course || !db) return;
    setEnrollmentLoading(true);

    const courseRef = doc(db, courseDocPath, id);
    const userEnrollmentsRef = collection(db, userEnrollmentsPath);

    try {
      if (isEnrolled) {
        const existingQuery = query(
          userEnrollmentsRef,
          where("courseId", "==", id),
          where("userEmail", "==", user.email)
        );
        const snap = await getDocs(existingQuery);

        if (!snap.empty) {
          await deleteDoc(doc(db, userEnrollmentsPath, snap.docs[0].id));
          await updateDoc(courseRef, { seats: seatsLeft + 1 });

          setSeatsLeft(prev => prev + 1);
          setIsEnrolled(false);
          setUserEnrollmentsCount(prev => prev - 1);
          toast.success(`Removed enrollment from "${course.courseTitle}"`);
        }
      } else {
        if (seatsLeft <= 0) {
          toast.error("No seats left.");
          return;
        }
        if (userEnrollmentsCount >= 3) {
          toast.error("You can only enroll in 3 courses.");
          return;
        }

        await addDoc(userEnrollmentsRef, {
          courseId: id,
          courseTitle: course.courseTitle,
          userEmail: user.email,
          courseImage: course.imageURL,
          courseDuration: course.duration,
          enrollmentDate: new Date().toISOString()
        });

        await updateDoc(courseRef, { seats: seatsLeft - 1 });

        setSeatsLeft(prev => prev - 1);
        setIsEnrolled(true);
        setUserEnrollmentsCount(prev => prev + 1);
        toast.success(`Successfully enrolled in "${course.courseTitle}"`);
      }
    } catch (error) {
      console.error("Enrollment failed:", error);
      toast.error("Enrollment action failed.");
    } finally {
      setEnrollmentLoading(false);
      fetchCourseDetails();
    }
  };

  if (pageLoading || authLoading) return null;
  if (!course) return <NotFoundCourse />;

  return (
    <div className="container mx-auto p-6 my-8 bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <img
            src={course.imageURL || "https://placehold.co/600x400/ECECEC/000000?text=Course+Image"}
            alt={course.courseTitle}
            className="rounded-lg shadow-md w-full h-auto object-cover max-h-[400px]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/600x400/ECECEC/000000?text=Course+Image";
            }}
          />
        </div>

        <div className="lg:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-800 mb-4">{course.courseTitle}</h1>
            <p className="text-gray-700 text-lg mb-4">{course.shortDescription}</p>
            <div className="grid grid-cols-2 gap-4 text-gray-800 mb-6">
              <p><strong>Duration:</strong> {course.duration}</p>
              <p><strong>Instructor:</strong> {course.instructorName || "N/A"}</p>
              <p><strong>Added By:</strong> {course.instructorEmail || "N/A"}</p>
              <p><strong>Added On:</strong> {course.timestamp ? new Date(course.timestamp).toLocaleDateString() : "N/A"}</p>
            </div>

            <hr className="my-6 border-gray-200" />

            <h2 className="text-2xl font-bold text-gray-800 mb-3">Course Overview</h2>
            <p className="text-gray-700 leading-relaxed">{course.fullDescription || "No overview available."}</p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between bg-blue-50 p-6 rounded-lg shadow-inner">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              {seatsLeft > 0 ? (
                <p className="text-blue-700 font-bold text-xl">
                  <span className="text-2xl font-extrabold">{seatsLeft}</span> seats left!
                </p>
              ) : (
                <p className="text-red-600 font-bold text-xl">No seats left!</p>
              )}
            </div>

            <button
              onClick={handleEnrollment}
              className={`px-8 py-3 rounded-full font-bold text-xl transition duration-300 shadow-md
                ${enrollmentLoading ? 'bg-gray-400 cursor-not-allowed' : ''}
                ${isEnrolled
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : (seatsLeft <= 0 || !user || (userEnrollmentsCount >= 3 && !isEnrolled))
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }
              `}
              disabled={enrollmentLoading || seatsLeft <= 0 || !user || (userEnrollmentsCount >= 3 && !isEnrolled)}
            >
              {enrollmentLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                isEnrolled ? "Remove Enrollment"
                : seatsLeft <= 0 ? "No Seats Left"
                : userEnrollmentsCount >= 3 ? "Limit Reached"
                : "Enroll Now"
              )}
            </button>

            {!user && (
              <p className="text-sm text-gray-500 mt-2 text-center sm:text-right">
                Please login to enroll.
              </p>
            )}
            {user && userEnrollmentsCount >= 3 && !isEnrolled && (
              <p className="text-sm text-red-500 mt-2 text-center sm:text-right">
                You’ve enrolled in 3 courses. Remove one to enroll again.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
