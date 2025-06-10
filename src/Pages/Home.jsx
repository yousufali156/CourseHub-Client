import React from 'react';
import ImageSlider from './Home/ImageSlider';
import Hero from './Home/Hero';
import Courses from './Courses';
import AddCourse from './AddCourse';
import CourseDetailsPage from './CourseDetailsPage';
import ManageCourse from './ManageCourse';
import Banner from './Home/Banner';

const Home = () => (
  <div className="p-6">
    <Hero />
    
    <AddCourse />
    <CourseDetailsPage />
    <ImageSlider />
    <ManageCourse />
  </div>
);

export default Home;