import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function FloorPlanList() {
    const [plans, setPlans] = useState([]);
    const userDetail = useSelector((state) => state.user.userInfo);
    const navigate = useNavigate();
    
    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_BASE_URL}floor-plans/user-id/${userDetail.id}`)
            .then((res) => {
                if (res.data.status === 200) {
                    setPlans(res.data.data.reverse());
                }
            })
            .catch((err) => console.error("Failed to fetch plans", err));
    }, []);

    return (
        <div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">🗂 Saved Floor Plans</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        onClick={() => navigate(`/saved-floorplan/${plan.id}`)}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-200"
                    >
                        <img
                            src={`${import.meta.env.VITE_BASE_URL}${plan.floorplan_image}`}
                            alt={plan.room_name}
                            className="w-full h-52 object-contain"
                        />
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-gray-800">{plan.room_name || "Untitled Room"}</h2>
                            <p className="text-sm text-gray-500">Size: {plan.room_size}</p>
                            <div className="flex items-center text-gray-400 text-xs mt-2">
                                <Calendar className="w-4 h-4 mr-1" />
                                Last updated: {new Date(plan.updated_at).toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
