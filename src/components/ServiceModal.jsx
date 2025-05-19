import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export function ServiceModal({ isOpen, onClose, service, rooms = [], loading, error }) {
  const [activeTab, setActiveTab] = useState('residential');
  const navigate = useNavigate();

  // Group rooms by type
  const groupedRooms = useMemo(() => {
    const groups = {};
    for (const room of rooms) {
      const type = room.type || 'unknown';
      if (!groups[type]) groups[type] = [];
      groups[type].push(room);
    }

    return groups;
  }, [rooms]);

  const handleClick = (room) => {
    // navigate(`/services/${service.id}/room/${room.id}`);
    navigate("/service-type", {
      state: {
        serviceId: service.id,
        roomId: room.id
      }
    });
      
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl h-[650px] p-6 shadow-xl relative flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black text-2xl"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-5">Pick a Space to Get Started</h2>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-4">
          {['residential', 'commercial', 'retail'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`px-4 py-1 rounded-full text-md font-medium capitalize ${activeTab === type
                ? 'bg-primary text-secondary'
                : 'bg-white text-gray-700'
                }`}
            >
              {type}
            </button>
          ))}
        </div>
        <hr className='mb-5'></hr>
        {/* Room Grid */}
        <div className='overflow-y-auto flex-grow'>
          {loading ? (
            <p className="text-center text-blue-500">Loading rooms...</p>
          ) : error ? (
            <p className="text-center text-red-500">Failed to load rooms.</p>
          ) : groupedRooms[activeTab]?.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {groupedRooms[activeTab].map((room) => (
                <div
                  key={room.id}
                  className="cursor-pointer flex flex-col items-center p-2 rounded-xl bg-white border shadow-md hover:shadow-lg transition"
                  onClick={() => handleClick(room)}
                >
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${room.image}`}
                    alt={room.name}
                    className="w-20 h-20 rounded-xl object-contain mb-2"
                  />
                  <p className="text-center text-sm font-medium">{room.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">No rooms available for {activeTab}.</p>
          )}
        </div>
      </div>
    </div>
  );
}
