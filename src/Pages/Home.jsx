// src/pages/Home.jsx
import React from 'react';
import ImageSlider from './Home/ImageSlider';
import Hero from './Home/Hero';
import AddCourse from './AddCourse';
import ManageCourse from './ManageCourse';
import HeroBanner from './Home/HeroBanner';

const Home = () => (
  <div className="p-6">
    <HeroBanner />
    <Hero />
    <AddCourse />
    <ImageSlider />
    <ManageCourse />
  </div>
);

export default Home;
