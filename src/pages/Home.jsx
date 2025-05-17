import React from 'react'
import { OurProcess } from '../components/ProcessSection';
import VideoSlider from '../components/VideoSliderSection';
import { HeroSection } from '../components/HeroSection';
import { ServicesGrid } from '../components/ServicesGridSection';

 const Home = () => {
   return (
    <>
    <HeroSection />
    <ServicesGrid />
    <OurProcess />
    <VideoSlider />
  </>
   )
 }
 
 export default Home