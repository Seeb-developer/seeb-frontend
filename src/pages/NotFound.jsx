import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center px-4 text-center py-12">
      <img
        src="/404.png" 
        alt="404 Not Found"
        className="max-w-xs sm:max-w-sm md:max-w-md mb-6"
      />
      {/* <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2> */}
      <p className="text-gray-500 mb-6 max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved. Let’s get you back home.
      </p>
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      >
        <ArrowLeft size={18} />
        Go to Homepage
      </button>
    </div>
  );
}
