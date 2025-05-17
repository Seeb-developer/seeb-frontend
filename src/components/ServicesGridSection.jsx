import React, { useEffect, useState } from 'react';
import { useGet } from '../hooks/useGet';
import { ServiceModal } from './ServiceModal';
import axios from 'axios';
import { ChevronRight } from 'lucide-react';

export function ServicesGrid() {
  const [selectedService, setSelectedService] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: services, loading, error } = useGet(`services-type`);

  const handleServiceClick = async (service) => {
    setSelectedService(service);
    setModalOpen(true);
    setRooms([]);
    setRoomsError(null);
    setRoomsLoading(true);

    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}services-type/${service.id}/rooms`);
      setRooms(res.data?.data);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
      setRoomsError(err);
    } finally {
      setRoomsLoading(false);
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 md:px-10">
      <h2 className="text-center mb-6 text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900">
        Explore Our Services
      </h2>


      {loading ? (
        <p className="text-center py-10">Loading services...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-10">Error loading services.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto px-4 sm:px-6">
          {services?.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-md p-4 flex flex-col items-center cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
              onClick={() => handleServiceClick(service)}
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL}${service.image}`}
                alt={service.name}
                className="w-20 sm:w-24 h-20 sm:h-24 object-contain mb-2"
              />
              <div className='relative w-full'>  
              <p className=" text-center font-medium text-sm sm:text-base">{service.name}</p>
              {/* <ChevronRight className='absolute right-0 top-0 text-gray-400'  /> */}
              </div>
            </div>
          ))}
        </div>

      )}

      <ServiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service={selectedService}
        rooms={rooms}
        loading={roomsLoading}
        error={roomsError}
      />
    </section>
  );
}
