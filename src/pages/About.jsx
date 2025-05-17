import React from "react";
import { CheckCircle, Users, Paintbrush, Home } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 py-12 bg-white text-gray-800">
      <section className="text-center mb-12 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">About SEEB</h1>
        <p className="text-lg text-gray-600">
          SEEB is a modern platform transforming the way people design and experience interiors.
          We bring design innovation, professional expertise, and seamless execution all in one place.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        <img
          src="/interior-bg.jpeg"
          alt="SEEB team working"
          className="rounded-2xl shadow-md object-cover w-full h-80"
          data-aos="fade-right"
          data-aos-delay="100"
        />
        <div>
          <h2 className="text-2xl font-bold mb-4">Why Choose SEEB?</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle className="text-primary mt-1" />
              <span>Tailored solutions for every budget and space.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-primary mt-1" />
              <span>Experienced professionals and certified designers.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-primary mt-1" />
              <span>End-to-end project management with real-time updates.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-primary mt-1" />
              <span>Quality assurance and timely delivery guaranteed.</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-16 bg-gray-50 rounded-xl p-8 shadow-inner">
        <h2 className="text-2xl font-bold text-center mb-6">What Makes Us Unique?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Users className="text-blue-600 w-10 h-10 mb-2" />
            <h3 className="font-semibold mb-1">Expert Team</h3>
            <p className="text-sm text-gray-600">A curated network of top interior professionals.</p>
          </div>
          <div className="flex flex-col items-center">
            <Paintbrush className="text-purple-600 w-10 h-10 mb-2" />
            <h3 className="font-semibold mb-1">Creative Designs</h3>
            <p className="text-sm text-gray-600">Modern, functional, and trend-setting ideas.</p>
          </div>
          <div className="flex flex-col items-center">
            <Home className="text-green-600 w-10 h-10 mb-2" />
            <h3 className="font-semibold mb-1">All-in-One Platform</h3>
            <p className="text-sm text-gray-600">From design to delivery, everything in one place.</p>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircle className="text-yellow-500 w-10 h-10 mb-2" />
            <h3 className="font-semibold mb-1">Trusted by Thousands</h3>
            <p className="text-sm text-gray-600">High satisfaction rate with real-time support.</p>
          </div>
        </div>
      </section>
    </div>
  );
}