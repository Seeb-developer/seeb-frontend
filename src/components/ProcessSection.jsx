import React, { useState } from 'react';
import { Pencil, LayoutDashboard, ClipboardList, Paintbrush, CheckCircle } from 'lucide-react';


const processSteps = [
  {
    icon: <Pencil size={36} className="text-blue-600" />,
    title: "Step 1: Share Your Requirement",
    description: "Tell us about your space, style, and design preferences. Upload reference photos or inspirations."
  },
  {
    icon: <LayoutDashboard size={36} className="text-yellow-500" />,
    title: "Step 2: Site Visit or Floor Plan Upload",
    description: "We’ll schedule a visit or let you upload a layout to better understand your space."
  },
  {
    icon: <ClipboardList size={36} className="text-green-600" />,
    title: "Step 3: Get Free Design Proposal",
    description: "Our expert designers prepare a custom design and estimate tailored to your budget."
  },
  {
    icon: <Paintbrush size={36} className="text-purple-600" />,
    title: "Step 4: Finalize and Customize",
    description: "Review the design, suggest changes, and finalize every detail with your dedicated designer."
  },
  {
    icon: <CheckCircle size={36} className="text-emerald-600" />,
    title: "Step 5: Execution & Delivery",
    description: "Our team executes the design with precision and delivers a transformed space you’ll love."
  }
];


export function OurProcess() {
 
  return (
    <>
      <section className="py-10 px-4 sm:px-6 md:px-12 lg:px-20 bg-gray-50">
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-10">Our Process</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {processSteps.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition-all text-center" data-aos="fade-right" data-aos-delay={index * 200} data-aos-offset="200">
              <div className="mb-4 flex justify-center">{step.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

    </>
  );
}

export default OurProcess;
