import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  ShieldCheck,
  Lock,
  RefreshCcw,
  Info,
  Copyright,
} from "lucide-react";

const policies = [
  { title: "Terms & Conditions", slug: "terms", icon: <FileText className="text-blue-600" /> },
  { title: "Privacy Policy", slug: "privacy", icon: <Lock className="text-indigo-600" /> },
  { title: "Cancellation & Refund Policy", slug: "refund", icon: <RefreshCcw className="text-pink-600" /> },
  { title: "User Guidelines", slug: "guidelines", icon: <Info className="text-sky-600" /> },
  { title: "Intellectual Property Rights", slug: "ipr", icon: <Copyright className="text-yellow-600" /> },
  { title: "Data Protection & Security", slug: "security", icon: <ShieldCheck className="text-green-600" /> },
];

const PoliciesList = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto px-4 py-8 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Policies & Legal
      </h2>

      <div className="space-y-4">
        {policies.map((item) => (
          <a
            key={item.slug}
            href={`/policies/${item.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-xl bg-white shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-2 rounded-lg">
                {item.icon}
              </div>
              <div className="text-base font-medium text-gray-700">
                {item.title}
              </div>
            </div>
            <div className="text-gray-400 text-lg">&gt;</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default PoliciesList;
