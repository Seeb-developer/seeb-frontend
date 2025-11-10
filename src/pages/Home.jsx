import React, { useEffect } from 'react';
import { OurProcess } from '../components/ProcessSection';
import VideoSlider from '../components/VideoSliderSection';
import { HeroSection } from '../components/HeroSection';
import { ServicesGrid } from '../components/ServicesGridSection';
import { ServicesList } from '../components/ServicesListSection';
import { Helmet } from 'react-helmet';
import CouponsSlider from '../components/CouponsSlider';

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
    <Helmet>
        {/* Primary Meta Tags */}
        <title>Seeb - Designing Dreams, Crafting Spaces</title>
        <meta 
          name="description" 
          content="Seeb is India’s first AI-powered interior design platform. Design, visualize, and build your dream spaces smarter, faster, and more affordably." 
        />
        <meta 
          name="keywords" 
          content="Seeb, interior design, AI interior, home renovation, modular kitchen, false ceiling, Pune interiors, Bangalore interiors" 
        />
        <meta name="author" content="Seeb Design Pvt Ltd" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://seeb.in/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://seeb.in/" />
        <meta property="og:title" content="Seeb - Designing Dreams, Crafting Spaces" />
        <meta property="og:description" content="Seeb is India’s first AI-powered interior design platform. Design, visualize, and build your dream spaces smarter, faster, and more affordably." />
        <meta property="og:image" content="https://seeb.in/og-image.jpg" />
        <meta property="og:site_name" content="Seeb" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://seeb.in/" />
        <meta name="twitter:title" content="Seeb - Designing Dreams, Crafting Spaces" />
        <meta name="twitter:description" content="Seeb is India’s first AI-powered interior design platform. Design, visualize, and build your dream spaces smarter, faster, and more affordably." />
        <meta name="twitter:image" content="https://seeb.in/og-image.jpg" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Helmet>

      <CouponsSlider />
      <HeroSection />
      
      
      <ServicesList />
      <h2 className="text-center my-8 text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900">
        Explore Our Services
      </h2>
      <ServicesGrid />
      {/* <OurProcess /> */}
      <VideoSlider />
    </>
  );
};

export default Home;
