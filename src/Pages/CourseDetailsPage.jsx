import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
// (NEW) Import SweetAlert2 for modals and FaStar for ratings
import Swal from 'sweetalert2';
import { FaSpinner, FaCheckCircle, FaExclamationCircle, FaStar } from 'react-icons/fa';
import AuthContext from '../FirebaseAuthContext/AuthContext';
import axiosSecure from '../../api/axiosSecure';


// --- (NEW) Star Rating Component ---
const StarRating = ({ rating, setRating, clickable = true }) => {
    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <FaStar
                        key={starValue}
                        className={`transition-colors ${clickable ? 'cursor-pointer' : ''} ${starValue <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`}
                        size={clickable ? 24 : 16} // Make clickable stars larger
                        onClick={() => clickable && setRating(starValue)}
                    />
                );
            })}
        </div>
    );
};

const CourseDetailsPage = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrollLoading, setEnrollLoading] = useState(false);
    const [userEnrollCount, setUserEnrollCount] = useState(0);

    // --- (NEW) Review States ---
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [hasAlreadyReviewed, setHasAlreadyReviewed] = useState(false);
    const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);

    // Effect to fetch course details
    useEffect(() => {
        setLoading(true);
        setError(null);

        axiosSecure.get(`/courses/${id}`)
            .then(res => {
                setCourse(res.data);
            })
            .catch(err => {
                console.error("Error fetching course details:", err);
                setError(err.response?.data?.message || 'Failed to load course details.');
                toast.error(err.response?.data?.message || 'Could not load course.');
            })
            .finally(() => setLoading(false));
    }, [id]);

    // Effect to check enrollment, count, AND fetch reviews
    useEffect(() => {
        if (id) {
            // (NEW) Fetch reviews for this course (public)
            setLoadingReviews(true);
            // This route is public, but using axiosSecure is fine
            axiosSecure.get(`/courses/${id}/reviews`)
                .then(res => {
                    setReviews(res.data);
                    // Check if current user has reviewed
                    if (user?.email && res.data.some(review => review.userEmail === user.email)) {
                        setHasAlreadyReviewed(true);
                    } else {
                        setHasAlreadyReviewed(false);
                    }
                })
                .catch(err => console.error("Error fetching reviews:", err))
                .finally(() => setLoadingReviews(false));
        }

        if (user?.email && id) {
            // Check enrollment status for THIS course
            axiosSecure.get(`/enrolled-status?email=${user.email}&courseId=${id}`)
                .then(res => setIsEnrolled(res.data.enrolled))
                .catch(err => console.error("Error checking enrollment status:", err));

            // Get total count of ALL courses for this user
            axiosSecure.get(`/my-enrolled-courses/${user.email}`)
                 .then(res => setUserEnrollCount(res.data.length))
                 .catch(err => console.error("Error fetching enrollment count:", err));
        } else {
            // If user logs out, reset their specific state
            setIsEnrolled(false);
            setUserEnrollCount(0);
        }
    }, [id, user]); // Rerun if user or course ID changes

    // --- (FIXED) Combined Handle Enroll / Un-enroll ---
    const handleEnrollToggle = async () => {
        if (!user) {
            toast.error("Please log in to enroll.");
            navigate('/login', { state: { from: location } });
            return;
        }
        setEnrollLoading(true);
        
        try {
            // --- UN-ENROLL LOGIC ---
            if (isEnrolled) {
                await axiosSecure.delete(`/enrollments/${user.email}/${id}`);
                toast.warn("You have unenrolled from this course.");
                setIsEnrolled(false);
                setUserEnrollCount(prev => prev - 1);
                setCourse(prevCourse => ({ ...prevCourse, seats: (prevCourse.seats || 0) + 1, enrollmentCount: (prevCourse.enrollmentCount || 1) - 1 }));
            } 
            // --- ENROLL LOGIC ---
            else {
                if (course.seats <= 0) {
                     toast.error('This course is full!');
                     setEnrollLoading(false);
                     return;
                }
                // (FIX) Use Swal modal for 3 course limit
                if (userEnrollCount >= 3) {
                     setEnrollLoading(false);
                     return Swal.fire({
                         icon: 'warning',
                         title: 'Enrollment Limit Reached',
                         text: 'You cannot enroll in more than 3 courses.',
                         confirmButtonColor: '#3085d6',
                     });
                }

                const enrollmentData = {
                    userEmail: user.email,
                    courseId: id,
                    courseTitle: course?.courseTitle 
                };

                const res = await axiosSecure.post('/enrollments', enrollmentData);
                
                toast.success(res.data.message || "Enrolled successfully!");
                setIsEnrolled(true);
                setUserEnrollCount(prev => prev + 1);
                setCourse(prevCourse => ({ ...prevCourse, seats: prevCourse.seats - 1, enrollmentCount: (prevCourse.enrollmentCount || 0) + 1 }));
            }
        } catch (err) {
            console.error("Enrollment error:", err);
            toast.error(err.response?.data?.error || "An error occurred.");
        } finally {
            setEnrollLoading(false);
        }
    };

    // --- (NEW) Handle Review Submission ---
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (reviewRating === 0) {
            toast.error("Please select a rating (1-5 stars).");
            return;
        }
        if (reviewComment.trim() === "") {
            toast.error("Please write a comment for your review.");
            return;
        }
        
        setReviewSubmitLoading(true);
        const reviewData = {
            rating: reviewRating,
            comment: reviewComment,
        };

        try {
            // Backend route: POST /courses/:id/reviews
            const res = await axiosSecure.post(`/courses/${id}/reviews`, reviewData);
            toast.success(res.data.message || "Review added successfully!");
            
            // Instantly add the new review to the UI
            const newReview = {
                ...reviewData,
                _id: res.data.insertedId || new Date().toISOString(), // Use insertedId or fallback
                userEmail: user.email,
                userName: user.displayName,
                userPhoto: user.photoURL,
                createdAt: new Date().toISOString(),
            };
            setReviews([newReview, ...reviews]); // Add new review to the top
            setHasAlreadyReviewed(true); // Hide the form
            setReviewRating(0); // Reset form
            setReviewComment("");

        } catch (err) {
            console.error("Review submission error:", err);
            toast.error(err.response?.data?.error || "Failed to submit review.");
        } finally {
            setReviewSubmitLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <FaSpinner className="text-4xl text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center px-4">
                <FaExclamationCircle className="text-5xl text-red-500 mb-4" />
                <h2 className="text-2xl font-semibold text-red-700 dark:text-red-400 mb-2">Failed to Load Course</h2>
                <p className="text-gray-600 dark:text-gray-400">{error}</p>
                <Link to="/courses" className="btn btn-primary mt-6">Back to Courses</Link>
            </div>
        );
    }

    if (!course) {
        return <div className="text-center py-20">Course not found.</div>;
    }

    // Determine button state
    const isFull = course.seats <= 0;
    const buttonDisabled = enrollLoading || (isFull && !isEnrolled);
    let buttonText = "Enroll Now";
    let buttonClass = "btn-primary"; // Blue
    
    if (isEnrolled) {
        buttonText = "Unenroll";
        buttonClass = "btn-error"; // Red
    } else if (isFull) {
        buttonText = "Course Full";
        buttonClass = "btn-disabled"; // Gray
    }
    if (enrollLoading) buttonText = "Processing...";


    return (
        <div className="container mx-auto p-4 md:p-8">
            <Helmet>
                <title>{course.courseTitle || 'Course Details'} || CourseHub</title>
            </Helmet>

            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2">
                        <img 
                            src={course.image || course.imageURL} 
                            alt={course.courseTitle} 
                            className="w-full h-64 md:h-full object-cover"
                        />
                    </div>
                    <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{course.courseTitle}</h1>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">{course.fullDescription || course.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                    <span className="font-semibold text-gray-700 dark:text-gray-300 block">Instructor:</span>
                                    <span className="text-blue-600 dark:text-blue-400">{course.instructorName || course.instructorEmail}</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                    <span className="font-semibold text-gray-700 dark:text-gray-300 block">Duration:</span>
                                    <span className="text-gray-800 dark:text-gray-200">{course.duration}</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                    <span className="font-semibold text-gray-700 dark:text-gray-300 block">Enrolled:</span>
                                    <span className="text-gray-800 dark:text-gray-200">{course.enrollmentCount || 0} Students</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                    <span className="font-semibold text-gray-700 dark:text-gray-300 block">Seats Left:</span>
                                    <span className={`font-bold ${isFull && !isEnrolled ? 'text-red-500' : 'text-green-600'}`}>
                                        {(isFull && !isEnrolled) ? 'No Seats' : `${course.seats} available`}
                                    </span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                    <span className="font-semibold text-gray-700 dark:text-gray-300 block">Rating:</span>
                                    <span className="text-gray-800 dark:text-gray-200">{course.averageRating ? course.averageRating.toFixed(1) : (course.rating || 'N/A')} / 5.0</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                    <span className="font-semibold text-gray-700 dark:text-gray-300 block">Price:</span>
                                    <span className="text-xl font-bold text-blue-700 dark:text-blue-400">
                                        {course.price ? `$${course.price.toFixed(2)}` : 'Free'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleEnrollToggle}
                            disabled={buttonDisabled}
                            className={`btn w-full mt-4 ${buttonClass} disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed`}
                        >
                            {isEnrolled && !enrollLoading && <FaCheckCircle className="mr-2" />}
                            {enrollLoading && <FaSpinner className="animate-spin mr-2" />}
                            {buttonText}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- (NEW) Reviews Section --- */}
            <div className="mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Course Reviews</h2>

                {/* Review Submission Form */}
                {user && isEnrolled && !hasAlreadyReviewed && (
                    <form onSubmit={handleReviewSubmit} className="mb-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Leave a Review</h3>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Your Rating:</label>
                            <StarRating rating={reviewRating} setRating={setReviewRating} clickable={true} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="comment" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Your Comment:</label>
                            <textarea
                                id="comment"
                                rows="4"
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Share your experience with this course..."
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={reviewSubmitLoading}
                            className="btn btn-primary w-full md:w-auto"
                        >
                            {reviewSubmitLoading ? <FaSpinner className="animate-spin" /> : 'Submit Review'}
                        </button>
                    </form>
                )}
                {user && isEnrolled && hasAlreadyReviewed && (
                     <div className="mb-8 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/30 text-center">
                        <p className="font-medium text-blue-700 dark:text-blue-300">You have already submitted a review for this course. Thank you!</p>
                     </div>
                )}
                {user && !isEnrolled && (
                     <div className="mb-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 text-center">
                        <p className="text-gray-600 dark:text-gray-300">You must be enrolled in this course to leave a review.</p>
                     </div>
                )}
                {!user && (
                     <div className="mb-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 text-center">
                        <p className="text-gray-600 dark:text-gray-300">Please <Link to="/login" state={{from: location}} className="text-blue-500 hover:underline">log in</Link> and enroll to leave a review.</p>
                     </div>
                )}


                {/* List of Existing Reviews */}
                {loadingReviews ? (
                    <div className="flex justify-center items-center py-10">
                        <FaSpinner className="text-3xl text-blue-500 animate-spin" />
                    </div>
                ) : reviews.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No reviews yet for this course.</p>
                ) : (
                    <div className="space-y-6">
                        {reviews.map(review => (
                            <div key={review._id} className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                                <img 
                                    src={review.userPhoto || 'https://placehold.co/40x40/ECECEC/000000?text=U'} 
                                    alt={review.userName}
                                    className="w-10 h-10 rounded-full object-cover mt-1"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-semibold text-gray-800 dark:text-white">{review.userName}</h4>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-GB')}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                        <StarRating rating={review.rating} setRating={() => {}} clickable={false} />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{review.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDetailsPage;

