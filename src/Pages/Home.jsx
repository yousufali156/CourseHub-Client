import React from 'react';
import ImageSlider from './Home/ImageSlider';
import Hero from './Home/Hero';
import HeroBanner from './Home/HeroBanner';

const Home = () => (
  <div className="p-6">
    <HeroBanner />
    <Hero />
    <ImageSlider />   
  </div>
);

export default Home;
