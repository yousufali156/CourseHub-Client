import React, { useContext, useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Image, Clock, BookOpen } from 'lucide-react';
import AuthContext from '../../FirebaseAuthContext/AuthContext';

// import LoadingSpinner from '../../Components/LoadingSpinner';

import Courses from '../Courses';

const Hero = () => {
    const { db, loading: authLoading } = useContext(AuthContext);
    const [latestCourses, setLatestCourses] = useState([]);
    const [popularCourses, setPopularCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

    useEffect(() => {
        if (!authLoading && db) {
            setLoadingCourses(true);
            try {
                const coursesRef = collection(db, `artifacts/${appId}/public/data/courses`);
                const unsubscribe = onSnapshot(coursesRef, (snapshot) => {
                    const fetchedCourses = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    const sortedLatest = [...fetchedCourses]
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                        .slice(0, 6);

                    const sortedPopular = [...fetchedCourses]
                        .sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0))
                        .slice(0, 6);

                    setLatestCourses(sortedLatest);
                    setPopularCourses(sortedPopular);
                    setLoadingCourses(false);
                }, (error) => {
                    console.error("Error fetching courses:", error);
                    toast.error("Failed to load courses.");
                    setLoadingCourses(false);
                });

                return () => unsubscribe();
            } catch (error) {
                console.error("Firestore listener error:", error);
                toast.error("Failed to set up real-time updates.");
                setLoadingCourses(false);
            }
        }
    }, [db, authLoading]);

    if (loadingCourses) {
        // return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
           

            {/* Latest Courses */}
            <section className="mt-12 mb-12">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Latest Courses</h2>
                {latestCourses.length === 0 ? (
                    <p className="text-center text-gray-600">No latest courses available.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {latestCourses.map(course => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6 }}
                                className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                            >
                                <img
                                    src={course.imageURL || "https://placehold.co/300x200/ECECEC/000000?text=Course+Image"}
                                    alt={course.courseTitle}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/ECECEC/000000?text=Course+Image" }}
                                />
                                <div className="p-6">
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">{course.courseTitle}</h3>
                                    <p className="text-gray-600 text-sm mb-3">Added: {new Date(course.timestamp).toLocaleDateString()}</p>
                                    <p className="text-gray-700 mb-4">{course.shortDescription}</p>
                                    <Link to={`/course/${course.id}`} className="inline-block bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-full font-semibold transition duration-300 shadow-md">
                                        View Details
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
            <section>
                <Courses />
            </section>
            {/* Popular Courses */}
            <section className="mb-12">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Popular Courses</h2>
                {popularCourses.length === 0 ? (
                    <p className="text-center text-gray-600">No popular courses available.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {popularCourses.map(course => (
                            <motion.div
                                key={`popular-${course.id}`}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6 }}
                                className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                            >
                                <img
                                    src={course.imageURL || "https://placehold.co/300x200/ECECEC/000000?text=Course+Image"}
                                    alt={course.courseTitle}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/ECECEC/000000?text=Course+Image" }}
                                />
                                <div className="p-6">
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">{course.courseTitle}</h3>
                                    <p className="text-gray-600 text-sm mb-3">Added: {new Date(course.timestamp).toLocaleDateString()}</p>
                                    <p className="text-gray-700 mb-4">{course.shortDescription}</p>
                                    <Link to={`/course/${course.id}`} className="inline-block bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-full font-semibold transition duration-300 shadow-md">
                                        View Details
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* Why Choose Section */}
            <section className="mb-12 bg-blue-700 text-white p-8 rounded-lg shadow-xl">
                <h2 className="text-4xl font-bold text-center mb-6">Why Choose CourseHub?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                        className="p-6 bg-blue-800 rounded-lg shadow-md"
                    >
                        <Image size={50} className="text-yellow-300 mb-4 mx-auto" />
                        <h3 className="text-2xl font-semibold mb-2">Expert Instructors</h3>
                        <p className="text-blue-200">Learn from industry leaders and experienced professionals.</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="p-6 bg-blue-800 rounded-lg shadow-md"
                    >
                        <Clock size={50} className="text-yellow-300 mb-4 mx-auto" />
                        <h3 className="text-2xl font-semibold mb-2">Practical Skills</h3>
                        <p className="text-blue-200">Gain hands-on experience with real-world projects.</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="p-6 bg-blue-800 rounded-lg shadow-md"
                    >
                        <BookOpen size={50} className="text-yellow-300 mb-4 mx-auto" />
                        <h3 className="text-2xl font-semibold mb-2">Certification</h3>
                        <p className="text-blue-200">Earn certificates to boost your career.</p>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-white p-8 rounded-lg shadow-xl">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Join Our Community</h2>
                <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8">
                    Connect with fellow learners, share knowledge, and grow together in a supportive environment.
                </p>
                <div className="flex justify-center">
                    <Link to="/register">
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5 }}
                            className="bg-yellow-400 text-blue-800 hover:bg-yellow-300 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition duration-300"
                        >
                            Sign Up Today!
                        </motion.button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Hero;
