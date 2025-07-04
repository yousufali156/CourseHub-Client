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
        <div className="container mx-auto mt-12 mb-12 px-4 py-8">
            <section className='mt-2 mb-2   px-4 py-8'>
                <Courses />
            </section>

            {/* Why Choose Section */}
            <section className="mb-12 p-8 rounded-lg transition-colors duration-300">
                <h2 className="text-4xl font-bold text-center mb-6 ">
                    Why Choose CourseHub?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {[
                        {
                            title: "Expert Instructors",
                            description: "Learn from industry leaders and experienced professionals.",
                            icon: <Image size={50} className="text-yellow-400 mb-4 mx-auto" />
                        },
                        {
                            title: "Practical Skills",
                            description: "Gain hands-on experience with real-world projects.",
                            icon: <Clock size={50} className="text-yellow-400 mb-4 mx-auto" />
                        },
                        {
                            title: "Certification",
                            description: "Earn certificates to boost your career.",
                            icon: <BookOpen size={50} className="text-yellow-400 mb-4 mx-auto" />
                        }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: idx * 0.2 }}
                            className="p-6 rounded-lg shadow-md bg-base-100 transition-all duration-300 
             hover:bg-gradient-to-r hover:from-[#422fd9] hover:to-[#1c5af9] 
             hover:text-white dark:hover:text-white"
                        >


                            {item.icon}
                            <h3 className="text-2xl font-semibold mb-2 transition-colors duration-300">
                                {item.title}
                            </h3>
                            <p className="transition-colors duration-300">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>




            {/* CTA Section */}
            <section className=" p-8 rounded-lg shadow-xl">
                <h2 className="text-4xl font-bold text-center mb-6">Join Our Community</h2>
                <p className="text-center max-w-3xl mx-auto mb-8">
                    Connect with fellow learners, share knowledge, and grow together in a supportive environment.
                </p>
                <div className="flex justify-center">
                    <Link to="/register">
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5 }}
                            className="bg-yellow-400 text-blue-500 hover:bg-yellow-300 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition duration-300"
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
