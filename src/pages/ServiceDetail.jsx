import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useGet } from '../hooks/useGet';
import { Carousel } from 'react-responsive-carousel';
import ServiceBookingModal from "../components/ServiceBookingModal";
import AuthModal from "../components/AuthModal";
import RegistrationModal from "../components/RegistrationModal";
import { useSelector } from 'react-redux';
import { Sparkles, ShieldCheck, Star, CheckCircle, ChevronDown } from "lucide-react";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export function ServiceDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { serviceId } = useParams();
  const { roomId } = state || {};

  const [modalOpen, setModalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [mobile, setMobile] = useState("");
  const [userId, setUserId] = useState(null);

  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const { data: service, isLoading, error } = useGet(`services/${serviceId}`);
  const image = JSON.parse(service?.image || "[]");
  const token = useSelector((state) => state.user.token);

  const availableTabs = [];

  const { data: faqData, isLoading: faqLoading, error: faqError } = useGet(`faqs/service/${serviceId}`);

  if (service?.features) availableTabs.push("features");
  if (service?.care_instructions) availableTabs.push("care");
  if (service?.warranty_details) availableTabs.push("warranty");
  if (service?.quality_promise) availableTabs.push("quality");

  const handleAction = () => {
    if (!token) {
      setShowAuthModal(true);
    } else {
      setModalOpen(true);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading service</p>;
  // if (!serviceId) return <p>Error Loading Service</p>;

  return (
    <div className="px-4 md:px-10 py-8 relative">
      <div className="mb-6">
        <button className="text-gray-700 font-medium hover:underline" onClick={() => navigate(-1)}>&larr; Back</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Image */}
        <div className='flex justify-center rounded-xl overflow-hidden'>
          {image?.length > 0 && (
            <Carousel
              showThumbs={false}
              showStatus={false}
              infiniteLoop
              autoPlay
              interval={2000}
              transitionTime={1000}
            >
              {image.map((img, index) => (
                <div key={index}>
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${img}?t=${Date.now()}`}
                    alt={`Service ${index}`}
                    className="h-60 sm:h-[500px] w-full object-cover"
                  />
                </div>
              ))}
            </Carousel>
          )}
        </div>

        {/* Basic Details */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-2">{service?.name}</h1>
          <p className="text-red-600 font-semibold text-lg mb-4">
            ₹{service?.rate} <span className="text-sm text-gray-600">per {service?.rate_type.replace("_", " ")}</span>
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-800 mb-1">Description</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{service?.description || 'No description available.'}</p>
          </div>

          {/* Materials */}
          {service?.materials && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-800 mb-1">Materials Used</h3>
              <ul className="list-disc list-inside text-gray-700 text-sm">
                {service?.materials?.split(/\n+/).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Book Now */}
          <button className="btn btn-secondary w-full" onClick={handleAction}>
            Book Now
          </button>
        </div>
      </div>

      {(service?.features || service?.care_instructions || service?.warranty_details || service?.quality_promise) && (
        <div className="mt-12 bg-gradient-to-br from-white via-gray-50 to-white rounded-xl shadow-lg p-6 space-y-8">
          <div className=" gap-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">

            {service?.features && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center"> <Star className="text-yellow-500 w-6 h-6 mr-2" /> Features</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  {service.features.split(/\n+/).filter(Boolean).map((f, i) => (
                    <li key={i}>{f.replace("✅ ", "")}</li>
                  ))}
                </ul>
              </div>
            )}

            {service?.care_instructions && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center"> <Sparkles className="text-blue-500 w-6 h-6 mr-2" /> Care Instructions</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  {service.care_instructions.split(/\n+/).filter(Boolean).map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {service?.warranty_details && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center"> <ShieldCheck className="text-green-600 w-6 h-6 mr-2" /> Warranty Details</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  {service.warranty_details.split(/\n+/).filter(Boolean).map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {service?.quality_promise && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">  <CheckCircle className="text-purple-600 w-6 h-6 mr-2" /> Our Quality Promise</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  {service.quality_promise.split(/\n+/).filter(Boolean).map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Process Image Section */}
      <div className="mt-6 flex justify-center">
        <img
          src="/seebprocess.jpg"
          alt="Our Process"
          className="rounded-xl shadow-md w-full max-w-4xl h-auto md:h-[60vh] object-contain"
          style={{ maxHeight: '80vh' }}
        />
      </div>

      {/* FAQ Section */}
      {faqLoading && <p>Loading FAQs...</p>}
      {faqError && <p>Failed to load FAQs</p>}
      {faqData && faqData.length > 0 && (
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-4 cursor-pointer transition-all duration-300"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">{faq.question}</h3>
                    <ChevronDown
                      className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out`}
                    style={{
                      maxHeight: isOpen ? "500px" : "0px",
                      opacity: isOpen ? 1 : 0,
                      transitionProperty: "max-height, opacity",
                    }}
                  >
                    <p className="mt-2 text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}



      {/* Modals */}
      <ServiceBookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} selectedService={service} roomId={roomId} />

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={() => {
            setShowAuthModal(false);
            setModalOpen(true);
          }}
          onNeedRegistration={(id, mobile) => {
            setUserId(id);
            setMobile(mobile);
            setShowAuthModal(false);
            setShowRegister(true);
          }}
        />
      )}

      {showRegister && (
        <RegistrationModal
          userId={userId}
          mobile={mobile}
          onClose={() => setShowRegister(false)}
          onRegistered={() => alert("Registration successful!")}
        />
      )}
    </div>
  );
}
