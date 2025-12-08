import React, { useEffect, useState } from 'react';
import { Home, ShoppingCart, BookOpen, CalendarCheck, User, FileText, Book } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import AuthModal from '../components/AuthModal';
import RegistrationModal from '../components/RegistrationModal';
import { fetchCart } from '../store/cartSlice';
import { useLocation, Link, useNavigate } from 'react-router-dom';

export function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const Navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [mobile, setMobile] = useState("");

  // ✅ Get Redux state
  const cartItems = useSelector((state) => state.cart.items);
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userInfo);

  const firstName = user?.name ? user.name.split(" ")[0] : null;

  const handleProfileClick = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      Navigate("/profile");
    }
  };

  useEffect(() => {
    if (token) {
      // Fetch cart items once user is logged in
      dispatch(fetchCart(user?.id)); // assuming your cart fetch needs user ID
    }
  }, [token]);


  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-black text-white px-6 py-2 md:flex justify-between items-center hidden sticky top-0 w-full z-50">
        <div className="">
          <Link to='/'><img src="/logo_name.png" alt="Logo" className="h-16 " /></Link>
          <p className='text-sm'>Sab Aapke Control Mein!</p>          
        </div>
        <div className="space-x-6 text-base font-medium flex">

          {/* <Link to="/" className={`flex items-center gap-2 ${isActive("/") ? "text-yellow-400" : "hover:text-yellow-400"}`}> <Home className="w-5 h-5" />Home</Link> */}

          <Link to="/about" className={`flex items-center gap-2 ${isActive("/about") ? "text-yellow-400" : "hover:text-yellow-400"}`}>
            <span className="w-5 h-5"><FileText className="w-5 h-5" />
            </span>
            About
          </Link>

          <Link to="/cart" className={`flex items-center gap-2 ${isActive("/cart") ? "text-yellow-400" : "hover:text-yellow-400"}`}>
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full absolute -top-3 -right-3">
                  {cartItems.length}
                </span>
              )}
            </div>
            <span>Cart</span>
          </Link>

          <Link to="/tips" className={`flex items-center gap-2 ${isActive("/tips") ? "text-yellow-400" : "hover:text-yellow-400"}`}> <BookOpen className="w-5 h-5" />Ideas</Link>

          <Link to="/my-bookings" className={`flex items-center gap-2 ${isActive("/my-bookings") ? "text-yellow-400" : "hover:text-yellow-400"}`}><CalendarCheck className="w-5 h-5" />Bookings</Link>

          <Link to="/blog" className={`flex items-center gap-2 ${isActive("/blog") ? "text-yellow-400" : "hover:text-yellow-400"}`}> <Book className="w-5 h-5" />Blog</Link>

          <button onClick={handleProfileClick} className={`flex items-center gap-2 ${isActive("/profile") ? "text-yellow-400" : "hover:text-yellow-400"}`}> <User className='w-5 h-5' /> {token ? (firstName || "User") : "Login"}</button>

        </div>
      </nav>

      {/* Mobile Top Header */}
      <nav className="bg-black text-white px-4 py-2 md:hidden">
        <img src="/logo_name.png" alt="Logo" className="h-14" />
        <p className='text-sm'>Sab Aapke Control Mein!</p>          
        {/* <p className='text-sm'>Designing Dreams, Crafting Space.</p>           */}

        {/* <div className="flex gap-4">
          <span className="font-bold text-xl leading-tight">SEEB</span>
          <span className="font-medium text-lg">Pune, Maharashtra</span>
        </div> */}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center  pt-3 pb-2 md:hidden z-50">

        <Link to="/" className={` ${isActive("/") ? "text-yellow-400" : "hover:text-yellow-400"} flex flex-col items-center `}>
          <Home size={25} />
          <span className="text-xs">Home</span>
        </Link>

        <Link to="/cart" className={`${isActive("/cart") ? "text-yellow-400" : "hover:text-yellow-400"} flex flex-col items-center `}>
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full absolute -top-3 -right-3">
                {cartItems.length}
              </span>
            )}
          </div>
          <span className="text-xs">Cart</span>
        </Link>

        <Link to="/tips" className={` ${isActive("/tips") ? "text-yellow-400" : "hover:text-yellow-400"} flex flex-col items-center `}>
          <BookOpen size={25} />
          <span className="text-xs">Ideas</span>
        </Link>

        <Link to="/my-bookings" className={`${isActive("/my-bookings") ? "text-yellow-400" : "hover:text-yellow-400"} flex flex-col items-center `}>
          <CalendarCheck size={25} />
          <span className="text-xs">Bookings</span>
        </Link>

        <button onClick={handleProfileClick} className={`${isActive("/profile") ? "text-yellow-400" : "hover:text-yellow-400"} flex flex-col items-center `}>
          <User size={25} />
          <span className="text-xs">{token ? (firstName || "User") : "Login"}</span>
        </button>
      </div>

      {/* Modals */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={() => setShowAuthModal(false)}
          onNeedRegistration={(id, mobile) => {
            setUserId(id);
            setMobile(mobile);
            setShowAuthModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}

      {showRegisterModal && (
        <RegistrationModal
          userId={userId}
          mobile={mobile}
          onClose={() => setShowRegisterModal(false)}
          onRegistered={() => {
            alert("Registration successful! Please login again.");
          }}
        />
      )}
    </>
  );
}
