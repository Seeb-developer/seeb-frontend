import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/NavbarSection';
import { ServiceList } from './pages/ServiceList';
import { ServiceDetail } from './pages/ServiceDetail';
import ProfilePage from './pages/Profile';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import FloorPlan from './pages/FloorPlan';
import CheckoutPage from './pages/Checkout';
import BookingThankYouPage from './pages/BookingConfirmed';
import MyBookings from './pages/MyBookings';
import BookingDetail from './pages/BookingDetail';
import Footer from './components/FooterSection';
import Home from './pages/Home';
import AboutUs from './pages/About';
import AIDesignGenerator from './pages/AIDesignGenerator';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import NotFound from './pages/NotFound';
import GenerateAIItems from './pages/GenerateAiItems';
import CartPage from './pages/cart';
import DesignTips from './pages/tips';
import ImageGeneratorPage from './pages/ImageGenerator';
import FloorPlanDetail from './components/FloorPlanDetail';
import LandingPage from './pages/Landing-page';
import Test from './components/Test';
import ThankYouPage from './pages/ContactThankYou';

function AppContent() {
  const location = useLocation();

  // Hide Navbar and Footer for floorplan routes
  const hideLayout = location.pathname.startsWith('/floorplan') || location.pathname.startsWith('/landing-page');

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {!hideLayout && <Navbar />}
      <div className={`${!hideLayout ? 'flex-1' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/service-type" element={<ServiceList />} />
          <Route path="/service-detail/:serviceId" element={<ServiceDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/tips" element={<DesignTips />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/policies/terms" element={<Terms />} />
          <Route path="/policies/privacy" element={<Privacy />} />
          <Route path="/policies/refund" element={<Refund />} />
          <Route path="/floorplan/:roomId/:roomName" element={<FloorPlan />} />
          <Route path="/generate-ai-items" element={<GenerateAIItems />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/booking-confirmed" element={<BookingThankYouPage />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/booking-detail" element={<BookingDetail />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/design-generate" element={<AIDesignGenerator />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:blogId" element={<BlogDetail />} />
          <Route path="/ai-images" element={<ImageGeneratorPage />} />
          <Route path="/saved-floorplan/:id" element={<FloorPlanDetail />} />
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/thank-you" element={<ThankYouPage />} />


          <Route path="*" element={<NotFound />} />

        </Routes>
      </div>
      {!hideLayout && <Footer />}

      {/* Floating Call & WhatsApp buttons (right-bottom) */}
      <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-3">
        <a
          href="tel:18005703133" /* replace with your phone */
          className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transform transition"
          aria-label="Call us"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C9.28 21 3 14.72 3 6a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
          </svg>
        </a>

        <a
          href="https://wa.me/917709899729?text=Hello%20Seeb" /* replace with your whatsapp (country code + number, no +) */
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transform transition"
          aria-label="Chat on WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.373 0 .012 5.373 0 12c0 2.116.55 4.183 1.59 6.01L0 24l6.193-1.584A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.2-1.247-6.201-3.48-8.52zM12 21.5c-1.9 0-3.74-.5-5.34-1.44l-.38-.22-3.68.94.98-3.58-.25-.38A9.5 9.5 0 012.5 12 9.5 9.5 0 1112 21.5zm5.2-7.6c-.27-.13-1.6-.79-1.85-.88-.25-.09-.43-.13-.61.13-.18.25-.72.88-.88 1.06-.16.18-.33.2-.6.07-.27-.13-1.15-.42-2.19-1.36-.81-.73-1.36-1.62-1.52-1.89-.16-.27-.02-.41.12-.54.12-.12.27-.31.41-.47.14-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.06-.13-.61-1.48-.84-2.03-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.47.07-.72.34-.25.27-.97.95-.97 2.32s.99 2.69 1.13 2.88c.14.18 1.95 2.98 4.73 4.18 3.3 1.4 3.3 0 3.89-.41.59-.41 1.9-1.73 2.17-2.71.27-.98.27-1.81.19-1.98-.08-.17-.27-.27-.54-.4z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router basename="/">
      <AppContent />
    </Router>
  );
}

export default App;
