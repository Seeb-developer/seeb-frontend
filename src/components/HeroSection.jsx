import React, { useState } from 'react';
import { RoomModal } from "../components/RoomModal";
import { useGet } from '../hooks/useGet';
import { useNavigate } from 'react-router-dom';
import AuthModal from "../components/AuthModal";
import RegistrationModal from "../components/RegistrationModal";
import { useSelector } from 'react-redux';

export function HeroSection() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { data: roomData, loading, error } = useGet(`rooms`, showModal);
  const token = useSelector((state) => state.user.token);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [mobile, setMobile] = useState("");
  const [userId, setUserId] = useState(null);


  return (
    <section className="flex flex-col lg:flex-row gap-4 px-4 sm:px-10 py-6">

      {/* AI Design Box */}
      <div
        className="relative w-full lg:w-1/2 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow duration-300"
        style={{ backgroundImage: "url('/web-1.jpg')", backgroundSize: 'cover', backgroundPosition: 'top' }}
      >
        <div className="flex flex-col justify-center items-center text-center px-6 py-10 sm:py-14 rounded-2xl bg-black/50">
          <img src="/design.png" alt="floorplan" className="w-48 sm:w-48 md:w-56 lg:w-80 mb-4 object-contain" />
          <h1 className="text-white text-xl sm:text-2xl md:text-4xl font-bold mb-3 capitalize">
            Design Smarter - Free Room Design with SEEB
          </h1>
          <p className="text-gray-200 text-sm sm:text-base max-w-xl mb-4">
            Instantly generate design ideas for your home, office, sofa and more with AI-powered creativity.
          </p>
          <button className='btn btn-secondary' onClick={() => {
            !token ? setShowAuthModal(true) : navigate('/design-generate')
          }}>
            Generate Now
          </button>
        </div>
      </div>

      {/* Floor Plan Box */}
      <div
        className="relative w-full lg:w-1/2 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow duration-300"
        style={{ backgroundImage: "url('/web-2.jpg')", backgroundSize: 'cover', backgroundPosition: 'top' }}
      >
        <div className="flex flex-col justify-center items-center text-center px-6 py-10 sm:py-14 rounded-2xl bg-black/50">
          <img src="/floorplan.png" alt="floorplan" className="w-44 sm:w-48 md:w-56 lg:w-60 mb-4 object-contain" />
          <h1 className="text-white text-xl sm:text-2xl md:text-4xl font-bold mb-3 capitalize">
            Create A Free Floor plan - Design Smarter, Spend Smarter
          </h1>
          <p className="text-gray-200 text-sm sm:text-base max-w-xl mb-4">
            Draw floor plans for any space. Enter dimensions and customize every space with ease.
          </p>
          <button className='btn btn-secondary' onClick={() => {
            !token ? setShowAuthModal(true) : setShowModal(true)
          }}>
            Create Now
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <RoomModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          rooms={roomData || []}
          loading={loading}
          error={error}
        />
      )}

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

    </section>
  );
}
