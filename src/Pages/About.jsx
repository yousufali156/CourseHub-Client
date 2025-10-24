import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import AboutTeamPage from './AboutTeamPage';
import { Helmet } from "react-helmet";


const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>About || CourseHub</title> 
      </Helmet>
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12 bg-base-300 p-8 rounded-lg shadow-xl border border-gray-200 text-center"
      >
        <h1 className="text-4xl font-bold text-blue-500 mb-6">About CourseHub</h1>
        <p className="text-lg leading-relaxed max-w-3xl mx-auto">
          CourseHub is a leading online learning platform dedicated to providing high-quality educational content to students and professionals worldwide. Our mission is to democratize education, making it accessible and affordable for everyone, regardless of their location or background.
        </p>
        <p className="text-lg leading-relaxed mt-4 max-w-3xl mx-auto">
          We offer a diverse range of courses, from technology and business to creative arts and personal development, all taught by industry experts and experienced educators. Our interactive learning environment, practical projects, and supportive community ensure a rewarding learning experience for all our users.
        </p>
        <Link
          to="/courses"
          className="mt-8 inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-700 transition duration-300 shadow-md"
        >
          Explore Our Courses
        </Link>
      </motion.section>

      <section className="mb-12 bg-blue-700 text-white p-8 rounded-lg shadow-xl text-center">
        <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
        <p className="text-lg text-blue-200 max-w-3xl mx-auto">
          To be the global hub for online learning, empowering individuals to achieve their full potential and transform their careers and lives through knowledge.
        </p>
      </section>

      <section className="bg-base-300 p-8 rounded-lg shadow-xl border border-gray-200 text-center">
        <h2 className="text-3xl font-bold text-base-300 mb-6">Our Team</h2>
        <p className="text-lg text-base-300 max-w-3xl mx-auto">
          We are a passionate team of educators, technologists, and creatives who believe in the power of online education. We are committed to constantly innovating and improving our platform to provide the best possible learning experience.
        </p>
      </section>

      <section>
        <AboutTeamPage/>
      </section>
    </div>
  );
};

export default About;
