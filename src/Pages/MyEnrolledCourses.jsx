import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { XCircle } from 'lucide-react';
import AuthContext from '../FirebaseAuthContext/AuthContext';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const MyEnrolledCourses = () => {
  const { user, db, loading: authLoading, userId } = useContext(AuthContext);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [enrollmentToRemove, setEnrollmentToRemove] = useState(null);

  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  useEffect(() => {
    if (!authLoading && user && db) {
      setLoading(true);
      try {
        const enrollmentsRef = collection(db, `artifacts/${appId}/users/${userId}/enrollments`);
        const q = query(enrollmentsRef, where("userEmail", "==", user.email));

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const fetchedEnrollments = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setEnrolledCourses(fetchedEnrollments);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching enrolled courses:", error);
            toast.error("Failed to load your enrolled courses.");
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error("Error setting up Firestore listener:", error);
        toast.error("Failed to set up real-time enrollment updates.");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [user, db, authLoading, userId]);

  const handleRemoveClick = (enrollment) => {
    setEnrollmentToRemove(enrollment);
    setShowRemoveModal(true);
  };

  const confirmRemoveEnrollment = async () => {
    if (!enrollmentToRemove || !db) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, `artifacts/${appId}/users/${userId}/enrollments`, enrollmentToRemove.id));

      const courseRef = doc(db, `artifacts/${appId}/public/data/courses`, enrollmentToRemove.courseId);
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        const currentSeats = courseSnap.data().seats || 0;
        await updateDoc(courseRef, {
          seats: currentSeats + 1
        });
      }

      toast.success(`Enrollment for "${enrollmentToRemove.courseTitle}" removed successfully!`);
      setShowRemoveModal(false);
      setEnrollmentToRemove(null);
    } catch (error) {
      console.error("Error removing enrollment:", error);
      toast.error("Failed to remove enrollment.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return null; // or return <LoadingSpinner />;
  }

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
          <Link to="/courses" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-md">
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
              {enrolledCourses.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link to={`/course/${enrollment.courseId}`} className="text-blue-600 hover:underline">
                      {enrollment.courseTitle}
                    </Link>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    Enrolled on: {enrollment.enrollmentDate?.toDate().toLocaleDateString()}
                  </td>


                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleRemoveClick(enrollment)}
                      className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded-full transition duration-300 hover:bg-red-200 flex items-center space-x-1"
                      title="Remove Enrollment"
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
              Are you sure you want to remove your enrollment from "<span className="font-semibold">{enrollmentToRemove?.courseTitle}</span>"?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowRemoveModal(false)}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveEnrollment}
                className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEnrolledCourses;
