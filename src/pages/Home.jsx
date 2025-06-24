import React, { useEffect } from 'react';
import { OurProcess } from '../components/ProcessSection';
import VideoSlider from '../components/VideoSliderSection';
import { HeroSection } from '../components/HeroSection';
import { ServicesGrid } from '../components/ServicesGridSection';

const Home = () => {
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (typeof ml === 'function') {
  //       ml('show', 'bO8stZ', true);
  //     }
  //   }, 5000);

  //   return () => clearTimeout(timer); // Cleanup on unmount
  // }, []);

  return (
    <>
      <HeroSection />
      <h2 className="text-center my-8 text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900">
        Explore Our Services
      </h2>
      <ServicesGrid />
      <OurProcess />
      <VideoSlider />
    </>
  );
};

export default Home;
