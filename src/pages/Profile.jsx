import React, { useState, useEffect } from 'react';
import { LogOut, UserCog, Headphones, FileText } from 'lucide-react';
import ProfileSettings from '../components/ProfileSettings';
import PoliciesList from '../components/Policies';
import { Support } from '../components/Support';
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/userSlice";
import { clearCart } from "../store/cartSlice";
import { persistor } from "../store";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState(null); // default null on mobile
  const [isMobile, setIsMobile] = useState(false);
  const user = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkScreen = () => {
      const isMobileScreen = window.innerWidth < 768;
      setIsMobile(isMobileScreen);

      // ✅ On desktop, set default tab to 'profile'
      if (!isMobileScreen) {
        setActiveTab('profile');
      }
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);


  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    persistor.purge();
    window.location.href = "/";
  };

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    return words.length === 1 ? words[0][0].toUpperCase() : (words[0][0] + words[1][0]).toUpperCase();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSettings />;
      case 'support': return <Support />;
      case 'terms': return <PoliciesList />;
      default: return null;
    }
  };

  const sidebar = (
    <>
      {/* User Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold">{getInitials(user?.name)}</div>
        <div>
          <div className="font-semibold text-gray-800">Welcome, {user?.name}</div>
          <div className="text-sm text-gray-500">{user?.mobile_no}</div>
        </div>
      </div>
      <hr className="mb-4" />
      {/* Sidebar Items */}
      <SidebarItem icon={<UserCog />} label="Profile Settings" onClick={() => setActiveTab('profile')} />
      <SidebarItem icon={<Headphones />} label="Support & Contact Us" onClick={() => setActiveTab('support')} />
      <SidebarItem icon={<FileText />} label="Terms & Policies" onClick={() => setActiveTab('terms')} />

      <div className="pt-4">
        <button onClick={handleLogout} className="w-full flex justify-center items-center gap-2 text-red-600 bg-red-100 hover:bg-red-200 font-semibold py-3 rounded-md">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
      <p className="text-sm text-gray-400 mt-4 text-center">Web Version: 1.0.0</p>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="flex flex-col md:flex-row px-4 md:px-10 py-8 gap-8">
        {/* Sidebar or Full-page tab nav */}
        {isMobile ? (
          activeTab ? (
            <div className="bg-white rounded-2xl shadow p-6 w-full">
              {/* Back Button */}
              <button onClick={() => setActiveTab(null)} className="text-gray-600 text-sm mb-4 hover:underline">← Back</button>
              {renderContent()}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow p-6 w-full">
              {sidebar}
            </div>
          )
        ) : (
          <>
            <aside className="w-1/4 bg-white rounded-2xl shadow p-6">
              {sidebar}
            </aside>
            <section className="flex-1 bg-white rounded-2xl shadow p-8 overflow-y-auto">
              {renderContent() || <div className="text-gray-500 text-sm">Please select a tab</div>}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition text-gray-700"
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
