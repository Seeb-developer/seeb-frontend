import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/NavbarSection';
import { ServiceList } from './pages/ServiceList';
import CartPage from './pages/cart';
import { ServiceDetail } from './pages/ServiceDetail';
import DesignTips from './pages/Tips';
import ProfilePage from './pages/Profile';
import Terms from './pages/Terms';
import Privacy from './pages/privacy';
import Refund from './pages/Refund';
import FloorPlan from './pages/FloorPlan';
import CheckoutPage from './pages/Checkout';
import ThankYouPage from './pages/Thankyou';
import MyBookings from './pages/MyBookings';
import BookingDetail from './pages/BookingDetail';
import Footer from './components/FooterSection';
import Home from './pages/Home';
import AboutUs from './pages/About';
import AIDesignGenerator from './pages/AIDesignGenerator';
import NotFound from './pages/NotFound';
import AOS from 'aos';
import 'aos/dist/aos.css';

function AppContent() {
  const location = useLocation();

  // Hide Navbar and Footer for floorplan routes
  const hideLayout = location.pathname.startsWith('/floorplan');

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {!hideLayout && <Navbar />}
      <div className={`${!hideLayout ? 'flex-1' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/service-type" element={<ServiceList />} />
          <Route path="/service-detail" element={<ServiceDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/tips" element={<DesignTips />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/policies/terms" element={<Terms />} />
          <Route path="/policies/privacy" element={<Privacy />} />
          <Route path="/policies/refund" element={<Refund />} />
          <Route path="/floorplan/:roomId" element={<FloorPlan />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/booking-detail" element={<BookingDetail />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/design-generate" element={<AIDesignGenerator />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <Router basename="/">
      <AppContent />
    </Router>
  );
}

export default App;
