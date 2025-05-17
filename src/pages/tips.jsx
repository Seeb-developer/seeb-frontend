import { useState } from "react";
import {
  Image,
  Video,
  Home,
  Pin,
  ShoppingCart,
  Info,
  Calendar,
  User,
} from "lucide-react";

const tipsData = [
  {
    id: "image",
    title: "Image Tips",
    icon: <Image className="mr-2 w-5 h-5" />,
    what: "Explore a gallery of curated interior design images with before-and-after transformations.",
    how: 'Click "Image" to browse design images, swipe to enlarge, and save your favorites.',
  },
  {
    id: "video",
    title: "Video Tips",
    icon: <Video className="mr-2 w-5 h-5" />,
    what: "Watch step-by-step tutorials, DIY décor tips, and real project walkthroughs.",
    how: 'Click "Video" to explore tutorials, choose categories, and watch styling guides.',
  },
  {
    id: "seeb",
    title: "How Seeb Works",
    icon: <Home className="mr-2 w-5 h-5" />,
    what: "Learn how Seeb’s AI-powered designs and expert team create dream interiors.",
    how: 'Click "How Seeb Works" to understand our workflow and contact us for a consultation.',
  },
];

export default function DesignTips() {
  const [activeTip, setActiveTip] = useState("image");

  return (
    <div className="p-4 lg:p-10 flex flex-col gap-6">
      {/* Page Title */}
      <h1 className="text-2xl lg:text-3xl font-bold text-center">
        💡 Interior Design Ideas
      </h1>

      {/* Tip Buttons */}
      <div className="flex flex-col lg:flex-row gap-4 justify-center">
        {tipsData.map((tip) => (
          <button
            key={tip.id}
            onClick={() => setActiveTip(tip.id)}
            className={`flex items-center justify-center px-5 py-3 rounded-lg font-semibold transition ${
              activeTip === tip.id
                ? "bg-primary text-black"
                : "bg-white text-black border border-black"
            }`}
          >
            {tip.icon} {tip.title}
          </button>
        ))}
      </div>

      {/* Description Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-5 space-y-3">
        <div className="text-gray-800 font-bold flex items-center">
          <Pin className="text-red-500 mr-2 w-4 h-4" /> What it does:
        </div>
        <p className="text-gray-700">
          {tipsData.find((t) => t.id === activeTip).what}
        </p>

        <div className="text-gray-800 font-bold flex items-center mt-3">
          <Pin className="text-red-500 mr-2 w-4 h-4" /> How to use it:
        </div>
        <p className="text-gray-700">
          {tipsData.find((t) => t.id === activeTip).how}
        </p>
      </div>

      {/* Bottom Navigation for Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t border-gray-200 p-2 flex justify-around lg:hidden">
        <div className="flex flex-col items-center text-gray-700">
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </div>
        <div className="flex flex-col items-center text-gray-700">
          <ShoppingCart className="w-5 h-5" />
          <span className="text-xs">Cart</span>
        </div>
        <div className="flex flex-col items-center text-green-600 font-bold">
          <Info className="w-5 h-5" />
          <span className="text-xs">Tips</span>
        </div>
        <div className="flex flex-col items-center text-gray-700">
          <Calendar className="w-5 h-5" />
          <span className="text-xs">Bookings</span>
        </div>
        <div className="flex flex-col items-center text-gray-700">
          <User className="w-5 h-5" />
          <span className="text-xs">Profile</span>
        </div>
      </div>
    </div>
  );
}
