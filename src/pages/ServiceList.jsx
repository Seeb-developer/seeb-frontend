import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useGet } from '../hooks/useGet';
// import { Carousel } from 'react-responsive-carousel';
import { Star, Search } from "lucide-react";
import ServiceBookingModal from "../components/ServiceBookingModal";
import AuthModal from "../components/AuthModal";
import RegistrationModal from "../components/RegistrationModal";
import { useSelector } from 'react-redux';

export function ServiceList() {
  // const { serviceId, roomId } = useParams();
  const { state } = useLocation();
  const { serviceId, roomId } = state;

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [mobile, setMobile] = useState("");
  const [userId, setUserId] = useState(null);

  const { data: services, loading, error } = useGet(
    `services/service-type/${serviceId}/room/${roomId}`
  );

  const token = useSelector((state) => state.user.token);

  const handleAction = (service) => {
    // console.log("service",service);

    if (!token) {
      setShowAuthModal(true);
    } else {
      openModal(service);
    }
  };

  const openModal = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const handleCardClick = (service) => {
    // navigate(`/service-detail/${service.id}/room/${roomId}`);
    navigate(`/service-detail/${service.id}`, {
      state: {
        roomId: roomId
      }
    });

  };

  if (loading) return <p className="text-center py-10">Loading services...</p>;
  if (error) return <p className="text-center text-gray-600 py-10">{error.response.data.messages.error}</p>;

  return (
    <div className="px-4 py-4 space-y-4">

      <div className="flex flex-col md:flex-row md:justify-between gap-3">
        {/* Search */}
        {/* <div className="flex items-center bg-white px-3 py-2 rounded-md shadow w-full sm:w-1/2">
          <Search className="text-gray-900 mr-2 h-4 w-4" />
          <input
            type="text"
            placeholder="Search services..."
            className="w-full outline-none text-sm"
          />
        </div> */}

        {/* Filter chips */}
        {/* <div className="flex gap-2 overflow-x-auto sm:flex-wrap">
          {["Top Rated", "Price: Low to High", "Price: High to Low", "Top Booked"].map((filter) => (
            <button
              key={filter}
              className="bg-gray-200 text-sm px-3 py-1 rounded-md whitespace-nowrap hover:bg-gray-300"
            >
              {filter}
            </button>
          ))}
        </div> */}
      </div>

      {/* Service Cards */}
      <div className=" grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-2 py-6 sm:px-6 sm:py-10 ">
        {services?.map((service) => {
          const images = JSON.parse(service.image || "[]");

          return (
            <div key={service.id} className="bg-white rounded-xl shadow relative overflow-hidden " onClick={() => handleCardClick(service)}>
              {/* <Carousel showThumbs={false} showStatus={false} infiniteLoop autoPlay> */}
              {/* {images?.map((img, index) => ( */}
              {/* <div key={index}> */}
              <img
                src={`${import.meta.env.VITE_BASE_URL}${images[0]}`}
                alt="Service"
                className="h-60 sm:h-72  w-full object-cover rounded-xl"
              />
              {/* </div> */}
              {/* ))} */}
              {/* </Carousel> */}

              <div className="p-3 bg-black text-white absolute w-full bottom-0 rounded-b-xl opacity-95 z-30">
                <h3 className="text-sm sm:text-base font-semibold">{service.name}</h3>
                <p className="text-sm font-medium mt-1">₹{service.rate} <span className="text-xs"> {service.rate_type.replace("_", " ")}</span></p>

                <div className="flex items-center text-yellow-400 mt-1">
                  {[...Array(4)].map((_, i) => <Star key={i} size={16} fill="#facc15" stroke="#facc15" />)}
                  <span className="ml-1 text-xs text-white">Bookings</span>
                </div>

                <button className="absolute bottom-4 right-4 rounded-full border-yellow-500 bg-primary text-black px-4 py-1 text-base font-medium hover:bg-accent" onClick={(e) => { e.stopPropagation(); handleAction(service); }}>
                  Add <span className="text-lg font-bold">+</span>
                </button>

              </div>
            </div>
          );
        })}
      </div>
      {selectedService && (
        <ServiceBookingModal
          isOpen={showModal}
          onClose={handleCloseModal}
          selectedService={selectedService}
          roomId={roomId}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(token) => {
            setShowAuthModal(false);
            setShowModal(true); // open service booking
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
          onRegistered={() => {
            alert("Registration successful!");
          }}
        />
      )}


    </div>
  );
}
