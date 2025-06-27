import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function FloorPlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}floor-plans/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) setPlan(data.data);
      });
  }, [id]);

  if (!plan) return <div className="p-10">Loading...</div>;

  const floor3dImages = JSON.parse(plan.floor3d_image || "[]");
  const elements = JSON.parse(plan.elements_json || "{}");

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 sm:px-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="flex flex-col lg:flex-row gap-10">
          <img
            src={`${import.meta.env.VITE_BASE_URL}${plan.floorplan_image}`}
            alt="Floorplan"
            className="w-full lg:w-1/2 h-auto rounded-lg object-contain border"
          />

          <div className="flex-1 space-y-3">
            <h1 className="text-3xl font-bold text-gray-800">{plan.room_name}</h1>
            <p className="text-sm text-gray-500">Size: {plan.room_size} ft</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <p><strong>Style:</strong> {plan.style_name || "N/A"}</p>
              <p><strong>Design Instruction:</strong> {plan.name || "—"}</p>
              <p><strong>Primary Color:</strong> {plan.primary_color || "—"}</p>
              <p><strong>Accent Color:</strong> {plan.accent_color || "—"}</p>
              <p><strong>Created:</strong> {new Date(plan.created_at).toLocaleDateString("en-IN", {
                year: "numeric", month: "short", day: "numeric"
              })}</p>
            </div>
          </div>
        </div>

        {/* Floor 3D Images */}
        {floor3dImages.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">3D Room Preview</h2>
            <div className="flex flex-wrap gap-4">
              {floor3dImages.map((url, i) => (
                <img
                  key={i}
                  src={`${import.meta.env.VITE_BASE_URL}${url.replace(/^\/+/, "")}`}
                  alt={`3D-${i}`}
                  className="w-64 h-48 object-cover rounded shadow"
                />
              ))}
            </div>
          </div>
        )}

        {/* Elements Preview */}
        {Object.keys(elements).length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Design Elements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(elements).map(([name, urls]) => (
                <div key={name} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-2 capitalize">{name}</h3>
                  <div className="flex gap-2 flex-wrap">
                    {urls.map((url, index) => (
                      <img
                        key={index}
                        src={`${import.meta.env.VITE_BASE_URL}${url.replace(/^\/+/, "")}`}
                        alt={`${name}-${index}`}
                        className="w-64 h-64 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
