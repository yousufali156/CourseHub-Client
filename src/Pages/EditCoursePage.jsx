import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { BookOpen, Text, Clock, Users, Edit, Image as LucideImageIcon } from 'lucide-react';
import helmet from 'helmet';
import AuthContext from '../FirebaseAuthContext/AuthContext';
import LoadingSpinner from '../../Components/LoadingSpinner';

const EditCoursePage = () => {
    const { id } = useParams();
    const { user, db, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [courseTitle, setCourseTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [duration, setDuration] = useState('');
    const [seats, setSeats] = useState('');

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!authLoading && user && db) {
                try {
                    setLoading(true);
                    const courseDocRef = doc(db, `artifacts/${appId}/public/data/courses`, id);
                    const courseDocSnap = await getDoc(courseDocRef);

                    if (courseDocSnap.exists()) {
                        const data = courseDocSnap.data();
                        setCourseTitle(data.courseTitle || '');
                        setShortDescription(data.shortDescription || '');
                        setImageURL(data.imageURL || '');
                        setDuration(data.duration || '');
                        setSeats(data.seats || 0);
                    } else {
                        toast.error("Course not found for editing.");
                        navigate('/manage-courses');
                    }
                } catch (error) {
                    console.error("Error fetching course data for edit:", error);
                    toast.error("Failed to load course data.");
                    navigate('/manage-courses');
                } finally {
                    setLoading(false);
                }
            } else if (!authLoading && !user) {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id, user, db, authLoading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        if (!user || !db) {
            toast.error("You must be logged in to edit a course.");
            setSaving(false);
            return;
        }

        if (seats < 0 || isNaN(seats)) {
            toast.error("Seats must be a non-negative number.");
            setSaving(false);
            return;
        }

        try {
            const updatedCourseData = {
                courseTitle,
                shortDescription,
                imageURL,
                duration,
                seats: parseInt(seats),
                lastUpdated: new Date().toISOString()
            };

            const courseDocRef = doc(db, `artifacts/${appId}/public/data/courses`, id);
            await updateDoc(courseDocRef, updatedCourseData);

            toast.success("Course updated successfully!");
            navigate('/manage-courses');
        } catch (error) {
            console.error("Error updating course:", error);
            toast.error(error.message || "Failed to update course.");
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return (
            <div className="container mx-auto p-8 my-8 text-center bg-base-300 rounded-lg shadow-xl border border-gray-200">
                <p className="text-2xl text-red-600 font-semibold mb-4">You must be logged in to edit courses.</p>
                <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-md">
                    Login Now
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 my-8 bg-base-300 rounded-lg shadow-xl border border-gray-200 w-full max-w-2xl">
            <Helmet>
                <title>Edit Course || CourseHub</title>
            </Helmet>
            <h2 className="text-4xl font-bold text-center text-blue-500 mb-8">Edit Course</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Course Title */}
                <div>
                    <label className="block text-base-300 text-sm font-semibold mb-2" htmlFor="courseTitle">
                        Course Title
                    </label>
                    <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 bg-base400" size={20} />
                        <input
                            type="text"
                            id="courseTitle"
                            className="w-full px-4 pl-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-lg"
                            placeholder="e.g., Advanced JavaScript"
                            value={courseTitle}
                            onChange={(e) => setCourseTitle(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Short Description */}
                <div>
                    <label className="block text-base-300 text-sm font-semibold mb-2" htmlFor="shortDescription">
                        Short Description
                    </label>
                    <div className="relative">
                        <Text className="absolute left-3 top-3 bg-base400" size={20} />
                        <textarea
                            id="shortDescription"
                            className="w-full px-4 pl-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-lg"
                            placeholder="A brief overview of the course content."
                            rows="3"
                            value={shortDescription}
                            onChange={(e) => setShortDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                </div>

                {/* Image URL */}
                <div>
                    <label className="block text-base-300 text-sm font-semibold mb-2" htmlFor="imageURL">
                        Image URL
                    </label>
                    <div className="relative">
                        <LucideImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 bg-base400" size={20} />
                        <input
                            type="url"
                            id="imageURL"
                            className="w-full px-4 pl-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-lg"
                            placeholder="https://example.com/course-image.jpg"
                            value={imageURL}
                            onChange={(e) => setImageURL(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Duration */}
                <div>
                    <label className="block text-base-300 text-sm font-semibold mb-2" htmlFor="duration">
                        Duration (e.g., 20 Hours, 4 Weeks)
                    </label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 bg-base400" size={20} />
                        <input
                            type="text"
                            id="duration"
                            className="w-full px-4 pl-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-lg"
                            placeholder="e.g., 20 Hours"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Seats */}
                <div>
                    <label className="block text-base-300 text-sm font-semibold mb-2" htmlFor="seats">
                        Available Seats
                    </label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 bg-base400" size={20} />
                        <input
                            type="number"
                            id="seats"
                            className="w-full px-4 pl-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-lg"
                            placeholder="e.g., 10"
                            value={seats}
                            onChange={(e) => setSeats(e.target.value)}
                            min="0"
                            required
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-xl hover:bg-green-700 transition duration-300 flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={saving}
                >
                    {saving ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <>
                            <Edit size={20} /> <span>Update Course</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default EditCoursePage;
