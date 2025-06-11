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
import ThankYouPage from './pages/Thankyou';
import MyBookings from './pages/MyBookings';
import BookingDetail from './pages/BookingDetail';
import Footer from './components/FooterSection';
import Home from './pages/Home';
import AboutUs from './pages/About';
import AIDesignGenerator from './pages/AIDesignGenerator';
import BlogList from './pages/BlogList'; 
import BlogDetail from './pages/BlogDetail'; 
import NotFound from './pages/NotFound';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {FloorPlan_fabric}  from './pages/fabric';
import KanvaNew from './pages/kanva-new';
import GenerateAIItems from './pages/GenerateAiItems';
import CartPage from './pages/cart';
import DesignTips from './pages/tips';

function AppContent() {
  const location = useLocation();

  // Hide Navbar and Footer for floorplan routes
  const hideLayout = location.pathname.startsWith('/floorplan') || location.pathname.startsWith('/fabric') || location.pathname.startsWith('/kanva');

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
          <Route path="/floorplan/:roomId/:roomName" element={<FloorPlan />} />
          <Route path="/generate-ai-items" element={<GenerateAIItems />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/booking-detail" element={<BookingDetail />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/design-generate" element={<AIDesignGenerator />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:blogId" element={<BlogDetail />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/fabric" element={<FloorPlan_fabric />} />
          <Route path="/kanva" element={<KanvaNew />} />

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
