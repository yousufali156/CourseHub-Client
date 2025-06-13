import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  collection, addDoc, deleteDoc, doc, getDoc, getDocs, query,
  where, updateDoc, Timestamp
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import AuthContext from '../FirebaseAuthContext/AuthContext';
import NotFoundCourse from '../Components/NotFoundCourse';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, db, userId, loading: authLoading } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  // Fetch Course
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch('http://localhost:3000/courses');
        const data = await res.json();
        const matchedCourse = data.find(
          (c) => c._id === id || c._id?.$oid === id
        );
        if (!matchedCourse) {
          navigate('/404');
        } else {
          setCourse({
            ...matchedCourse,
            _id: matchedCourse._id?.$oid || matchedCourse._id,
          });
        }
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchCourse();
  }, [id, navigate]);

  // Check Enrollment
  useEffect(() => {
    const checkEnrollment = async () => {
      if (user && db && course) {
        const q = query(
          collection(db, `artifacts/${appId}/users/${userId}/enrollments`),
          where('courseId', '==', course._id)
        );
        const snapshot = await getDocs(q);
        setEnrolled(!snapshot.empty);
      }
      setCheckingEnrollment(false);
    };
    checkEnrollment();
  }, [user, db, course, userId, appId]);

  // Fetch Reviews
  const fetchReviews = async () => {
    if (!course || !db) return;
    const q = query(
      collection(db, `artifacts/${appId}/reviews`),
      where('courseId', '==', course._id)
    );
    const snapshot = await getDocs(q);
    const fetched = snapshot.docs.map((doc) => doc.data());
    setReviews(fetched);
    const total = fetched.reduce((sum, r) => sum + r.rating, 0);
    setAvgRating(fetched.length ? (total / fetched.length).toFixed(1) : 0);
  };

  useEffect(() => {
    fetchReviews();
  }, [course, db]);

  const handleEnroll = async () => {
    if (!user || !db || enrolled || course.seats <= 0) return;

    try {
      setEnrolling(true);

      // Check user max enroll
      const enrollRef = collection(db, `artifacts/${appId}/users/${userId}/enrollments`);
      const snapshot = await getDocs(enrollRef);
      if (snapshot.size >= 3) {
        toast.error('You can enroll in a maximum of 3 courses.');
        return;
      }

      await addDoc(enrollRef, {
        courseId: course._id,
        courseTitle: course.courseTitle,
        userEmail: user.email,
        enrollmentDate: Timestamp.now(),
      });

      const courseRef = doc(db, `artifacts/${appId}/public/data/courses`, course._id);
      await updateDoc(courseRef, { seats: course.seats - 1 });

      setEnrolled(true);
      setCourse((prev) => ({ ...prev, seats: prev.seats - 1 }));
      toast.success('Enrolled successfully!');
    } catch (err) {
      console.error('Enrollment failed:', err);
      toast.error('Enrollment failed.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenroll = async () => {
    if (!user || !db || !enrolled) return;

    try {
      const q = query(
        collection(db, `artifacts/${appId}/users/${userId}/enrollments`),
        where('courseId', '==', course._id)
      );
      const snapshot = await getDocs(q);
      const docToDelete = snapshot.docs[0];
      await deleteDoc(docToDelete.ref);

      const courseRef = doc(db, `artifacts/${appId}/public/data/courses`, course._id);
      await updateDoc(courseRef, { seats: course.seats + 1 });

      setEnrolled(false);
      setCourse((prev) => ({ ...prev, seats: prev.seats + 1 }));
      toast.success('Unenrolled successfully!');
    } catch (err) {
      console.error('Unenroll failed:', err);
      toast.error('Unenroll failed.');
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !db || !reviewText.trim()) return;

    try {
      const reviewRef = collection(db, `artifacts/${appId}/reviews`);
      const q = query(reviewRef, where('userId', '==', userId), where('courseId', '==', course._id));
      const existing = await getDocs(q);
      if (!existing.empty) {
        toast.error('You already submitted a review for this course.');
        return;
      }

      await addDoc(reviewRef, {
        userId,
        userEmail: user.email,
        courseId: course._id,
        rating: reviewRating,
        comment: reviewText,
        timestamp: Timestamp.now(),
      });

      toast.success('Review submitted!');
      setReviewText('');
      setReviewRating(5);
      fetchReviews();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review.');
    }
  };

  if (pageLoading || authLoading || checkingEnrollment) {
    return <div className="text-center text-lg py-10 text-gray-600">Loading course details...</div>;
  }

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
              <p><strong>Rating:</strong> {avgRating} ⭐</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Course Overview</h2>
            <p className="text-gray-700">{course.fullDescription}</p>
          </div>

          <div className="mt-6">
            {enrolled ? (
              <button
                onClick={handleUnenroll}
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Unenroll
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={!user || enrolling || enrolled || course.seats <= 0}
                className={`px-6 py-2 text-white rounded
                  ${enrolling || !user || course.seats <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {!user ? 'Login to Enroll' : enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-12 text-center">
        <h3 className="text-2xl font-bold mb-4">Course Reviews</h3>
        {reviews.map((r, i) => (
          <div key={i} className="border p-4 mb-3 rounded max-w-2xl mx-auto">
            <p className="font-semibold">{r.userEmail} <span className="text-yellow-500">({r.rating}⭐)</span></p>
            <p className="text-gray-700">{r.comment}</p>
          </div>
        ))}

        {user && enrolled && (
          <div className="mt-6 max-w-xl mx-auto">
            <h4 className="font-semibold text-lg mb-2">Leave a Review</h4>
            <div className="mb-2">
              <label className="mr-2">Rating: </label>
              <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} Star</option>
                ))}
              </select>
            </div>
            <textarea
              className="w-full border rounded p-2 mb-2"
              placeholder="Write your comment..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <button
              onClick={handleSubmitReview}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Submit Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsPage;
