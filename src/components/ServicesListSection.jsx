import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGet } from "../hooks/useGet";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import ServiceBookingModal from "./ServiceBookingModal";
import AuthModal from "./AuthModal";
import RegistrationModal from "./RegistrationModal";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";

export function ServicesList() {
  const { state } = useLocation();
  // const { serviceId, roomId } = state;

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [mobile, setMobile] = useState("");
  const [userId, setUserId] = useState(null);

  const { data: services, loading, error } = useGet(
    `services`
  );

  const token = useSelector((s) => s.user.token);

  const handleAction = (service) => {
    if (!token) setShowAuthModal(true);
    else openModal(service);
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
    // navigate("/service-detail", {
    //   state: { serviceId: service.id, roomId: 1 },
    // });
    navigate(`/service-detail/${service.id}`, {
      state: {
        roomId: 1
      }
    });
  };

  // --- Horizontal scroll logic ---
  const scrollerRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const hasManyItems = useMemo(() => (services?.length || 0) > 4, [services]);

  const updateArrowVisibility = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, clientWidth, scrollWidth } = el;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => updateArrowVisibility();
    el.addEventListener("scroll", onScroll, { passive: true });
    // initial
    updateArrowVisibility();
    return () => el.removeEventListener("scroll", onScroll);
  }, [services]);

  const scrollByCards = (dir = 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    // Scroll ~2 cards worth
    const approxCardWidth = 320; // px (image + paddings); tweak as needed
    el.scrollBy({ left: dir * approxCardWidth * 2, behavior: "smooth" });
  };

  if (loading) return <p className="text-center py-10">Loading services...</p>;
  if (error)
    return (
      <p className="text-center text-gray-600 py-10">
        {error?.response?.data?.messages?.error || "Failed to load services."}
      </p>
    );

  const serviceKeywords = services?.map(s => s.name).join(", ");

  return (
    <div className="py-2 px-4 sm:px-6 md:px-12 lg:px-12 bg-white">
      <Helmet>
        <title>Seeb Services - AI-Powered Interior Design</title>
        <meta
          name="description"
          content="Explore all services offered by Seeb including modular kitchens, false ceilings, home renovations and more. Design smarter and faster with AI-powered solutions."
        />
        <meta name="keywords" content={`Seeb, Interior Design, ${serviceKeywords}`} />
        <meta property="og:title" content="Seeb Services - AI Interior Solutions" />
        <meta property="og:description" content="Browse Seeb's wide range of interior design services for smarter, faster, and affordable solutions." />
        <meta property="og:image" content="https://seeb.in/og-image.jpg" />
        <meta property="og:url" content="https://seeb.in/services" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Seeb Services - AI Interior Solutions" />
        <meta name="twitter:description" content="Browse Seeb's wide range of interior design services for smarter, faster, and affordable solutions." />
        <meta name="twitter:image" content="https://seeb.in/og-image.jpg" />
      </Helmet>

      {/* Top bar reserved for future filters/search if you enable later */}
      <div className="flex flex-col md:flex-row md:justify-between gap-3" />

      {/* Horizontal scroller wrapper */}
      <div className="relative">
        {/* Left Arrow */}
        {hasManyItems && showLeft && (
          <button
            aria-label="Scroll left"
            onClick={() => scrollByCards(-1)}
            className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-40 h-10 w-10 rounded-full bg-black/70 hover:bg-black text-white shadow"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {/* Right Arrow */}
        {hasManyItems && showRight && (
          <button
            aria-label="Scroll right"
            onClick={() => scrollByCards(1)}
            className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-40 h-10 w-10 rounded-full bg-black/70 hover:bg-black text-white shadow"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        {/* Scroller */}
        <div
          ref={scrollerRef}
          className="
              overflow-x-auto overflow-y-visible
              [scrollbar-width:none] [-ms-overflow-style:none]
              py-2 sm:py-6
            "
          style={{
            scrollbarWidth: "none",
          }}
        >
          {/* hide scrollbar for WebKit */}
          <style>{`
              div::-webkit-scrollbar { display: none; }
            `}</style>

          <div className="flex gap-6 sm:px-0 lg:px-0">
            {services?.map((service) => {
              const images = JSON.parse(service.image || "[]");
              const imgSrc =
                images?.[0] &&
                `${import.meta.env.VITE_BASE_URL}${images[0]}`;

              return (
                <div
                  key={service.id}
                  className="
                      bg-white rounded-xl shadow relative overflow-hidden
                      min-w-[260px] sm:min-w-[300px] md:min-w-[320px] lg:min-w-[340px]
                      cursor-pointer
                    "
                  onClick={() => handleCardClick(service)}
                >
                  <img
                    src={imgSrc || "/placeholder.jpg"}
                    alt={service.name}
                    className="h-60 sm:h-72 w-full object-cover rounded-xl"
                    loading="lazy"
                  />

                  <div className="p-3 bg-black text-white absolute w-full bottom-0 rounded-b-xl opacity-95 z-30">
                    <h3 className="text-sm sm:text-base font-semibold line-clamp-1">
                      {service.name}
                    </h3>

                    <p className="text-sm font-medium mt-1">
                      ₹{service.rate}
                      <span className="text-xs">
                        {" "}
                        {String(service.rate_type || "")
                          .replace("_", " ")
                          .trim()}
                      </span>
                    </p>

                    <div className="flex items-center text-yellow-400 mt-1">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} size={16} fill="#facc15" stroke="#facc15" />
                      ))}
                      <span className="ml-1 text-xs text-white">Bookings</span>
                    </div>

                    <button
                      className="absolute bottom-4 right-4 rounded-full border-yellow-500 bg-primary text-black px-4 py-1 text-base font-medium hover:bg-accent"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(service);
                      }}
                    >
                      Add <span className="text-lg font-bold">+</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
          onLoginSuccess={() => {
            setShowAuthModal(false);
            setShowModal(true);
          }}
          onNeedRegistration={(id, mob) => {
            setUserId(id);
            setMobile(mob);
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
