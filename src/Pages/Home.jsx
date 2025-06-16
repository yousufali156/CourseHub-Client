import React from 'react';
import ImageSlider from './Home/ImageSlider';
import Hero from './Home/Hero';
import HeroBanner from './Home/HeroBanner';
import UpcomingCourse from './Shared/UpcomingCourse';

const Home = () => (
  <div className="p-6">
    <HeroBanner />
    <Hero />
    <UpcomingCourse></UpcomingCourse>
    <ImageSlider />   
  </div>
);

export default Home;
