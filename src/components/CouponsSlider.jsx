import React, { useEffect, useState, useRef } from "react";
import { useGet } from "../hooks/useGet";
import { useNavigate } from "react-router-dom";

export default function CouponsSlider({ coupons }) {
  const navigate = useNavigate();
  const { data: apiCoupons, loading, error } = useGet("coupon/getAllCoupon", !coupons);

  const defaultCoupons = [
    { id: 1, coupon_name: "Flat ₹500 off", coupon_code: "SEEB500", description: "On orders above ₹5000" },
    { id: 2, coupon_name: "10% OFF", coupon_code: "SEEB10", description: "Applicable sitewide" },
    { id: 3, coupon_name: "Free Design Consultation", coupon_code: "FREEDESIGN", description: "On first booking" },
  ];

  // source priority: prop -> api -> defaults
  const rawList = coupons || (Array.isArray(apiCoupons) ? apiCoupons : apiCoupons?.coupons) || defaultCoupons;

  // normalize minimal fields used in marquee
  const list = rawList.map((c, i) => {
    const code = c?.coupon_code ?? c?.code ?? c?.couponCode ?? "";
    const name = c?.coupon_name ?? c?.couponName ?? c?.name ?? "";
    const desc = c?.description ?? c?.desc ?? "";
    return {
      id: c?.id ?? c?._id ?? i,
      coupon_code: String(code || name || "").trim(),
      title: String(name || ""),
      description: String(desc || ""),
      original: c,
    };
  });

  // compute animation duration (longer for more items)
  const duration = Math.max(12, list.length * 6);

  // duplicate items for seamless loop
  const marqueeItems = [...list, ...list];

  const handleApply = (item) => {
    navigate("/checkout", { state: { couponCode: item.coupon_code } });
  };

  return (
    <div >
      <style>{`
        .seeb-marquee { overflow:hidden; border-radius: .75rem; background: linear-gradient(90deg, #fff, #f8fafc); }
        .seeb-marquee__inner { display:flex; gap:2.5rem; align-items:center; white-space:nowrap; animation: seeb-marquee ${duration}s linear infinite; }
        .seeb-marquee__inner:hover { animation-play-state: paused; }
        .seeb-marquee__item { display:flex; gap:1rem; align-items:center; padding:0.75rem 1rem; }
        .seeb-marquee__code { background:#e6f0ff; color:#0f4db2; font-weight:700; padding:0.35rem 0.6rem; border-radius:6px; }
        .seeb-marquee__desc { color:#374151; font-size:0.95rem; }
        .seeb-marquee__apply { background:#0f4db2; color:white; padding:0.4rem 0.6rem; border-radius:6px; font-size:0.85rem; }
        @keyframes seeb-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="seeb-marquee">
        <div
          className="seeb-marquee__inner px-4"
          // inline style to ensure duration is reflected if dynamic
          style={{ animationDuration: `${duration}s` }}
          aria-hidden={loading || !!error ? "true" : "false"}
        >
          {loading && <div className="seeb-marquee__item">Loading coupons...</div>}
          {error && <div className="seeb-marquee__item text-red-500">Failed to load coupons</div>}
          {!loading &&
            !error &&
            marqueeItems.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="seeb-marquee__item">
                <div className="seeb-marquee__code">{item.coupon_code}</div>
                <div className="seeb-marquee__desc">
                  {/* {item.title ? <strong>{item.title}</strong> : null} */}
                  {/* {item.title ? " — " : ""} */}
                  <span className="ml-1">{item.description}</span>
                </div>
                <button
                  onClick={() => handleApply(item)}
                  className="seeb-marquee__apply ml-4"
                  aria-label={`Apply ${item.coupon_code}`}
                >
                  Apply
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}