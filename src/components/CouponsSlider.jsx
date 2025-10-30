import React, { useEffect, useState, useRef } from "react";
import { useGet } from "../hooks/useGet";
import { useNavigate } from "react-router-dom";

export default function CouponsSlider({ coupons }) {
  const navigate = useNavigate();

  const defaultCoupons = [
    { id: 1, coupon_name: "Flat ₹500 off", coupon_code: "SEEB500", description: "On orders above ₹5000", coupon_expiry: "2025-10-31" },
    { id: 2, coupon_name: "10% OFF", coupon_code: "SEEB10", description: "Applicable sitewide", coupon_expiry: "2025-11-30" },
    { id: 3, coupon_name: "Free Design Consultation", coupon_code: "FREEDESIGN", description: "On first booking", coupon_expiry: "2025-12-31" },
  ];

  const { data: apiCoupons, loading, error } = useGet("coupon/getAllCoupon", !coupons);

  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);

  // terms handling
  const [acceptedTerms, setAcceptedTerms] = useState({});
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [termsModalContent, setTermsModalContent] = useState("");
  const [termsModalCouponId, setTermsModalCouponId] = useState(null);

  // choose source: prop -> api -> defaults
  const rawList = coupons || (Array.isArray(apiCoupons) ? apiCoupons : apiCoupons?.coupons) || defaultCoupons;

  // normalize different API shapes into a consistent object used by UI
  const normalizeCoupon = (c, i) => {
    const get = (keys) => {
      for (const k of keys) {
        if (c?.[k] !== undefined && c?.[k] !== null) return c[k];
      }
      return undefined;
    };

    const id = get(["id", "_id", "coupon_id"]) ?? i;
    const code = get(["coupon_code", "code", "couponCode"]) ?? "";
    const name = get(["coupon_name", "name", "title"]) ?? "";
    const desc = get(["description", "desc", "details"]) ?? "";
    const cartMin = get(["cart_minimum_amount", "min_amount", "cartMin"]) ?? "";
    let expiryRaw = get(["coupon_expiry", "expiry", "valid_till"]) ?? "";

    // coupon_expiry may be JSON-stringified array, an array, or a single date string
    try {
      if (typeof expiryRaw === "string" && expiryRaw.trim().startsWith("[")) {
        const parsed = JSON.parse(expiryRaw);
        if (Array.isArray(parsed) && parsed.length > 0) expiryRaw = parsed[parsed.length - 1]; // take last expiry
      } else if (Array.isArray(expiryRaw) && expiryRaw.length > 0) {
        expiryRaw = expiryRaw[expiryRaw.length - 1];
      }
    } catch (err) {
      // leave as-is if parse fails
    }

    const formatDate = (val) => {
      if (!val) return "";
      const d = new Date(val);
      if (isNaN(d.getTime())) return String(val);
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    };

    const formattedExpiry = formatDate(expiryRaw);
    const formattedMin = cartMin ? `Min ₹${new Intl.NumberFormat("en-IN").format(Number(cartMin))}` : "";

    return {
      id,
      coupon_code: String(code || ""),
      coupon_name: String(name || ""),
      description: String(desc || ""),
      coupon_expiry_display: formattedExpiry,
      coupon_expiry_raw: expiryRaw,
      cart_minimum_amount: cartMin,
      cart_minimum_display: formattedMin,
      original: c,
    };
  };

  const list = rawList.map(normalizeCoupon);

  useEffect(() => {
    // reset index when list length changes
    setIndex((i) => (i >= list.length ? 0 : i));
  }, [list.length]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current && list.length > 0) setIndex((i) => (i + 1) % list.length);
    }, 3000);
    return () => clearInterval(id);
  }, [list.length]);

  const prev = () => setIndex((i) => (i - 1 + list.length) % list.length);
  const next = () => setIndex((i) => (i + 1) % list.length);

  const openTermsModal = (coupon, cid) => {
    // try to extract terms text from various fields
    let terms = coupon.original?.terms_and_conditions ?? coupon.original?.terms ?? coupon.original?.termsAndConditions ?? "";
    // sometimes stored as escaped JSON string, try to clean it
    try {
      if (typeof terms === "string") {
        // remove leading/trailing quotes and unescape common patterns
        let t = terms.trim();
        // try parse JSON if possible
        if ((t.startsWith("{") || t.startsWith("[") || (t.startsWith('"') && t.endsWith('"')))) {
          try {
            const parsed = JSON.parse(t);
            // parsed may be array of strings or a single string
            if (Array.isArray(parsed)) terms = parsed.join("\n\n");
            else if (typeof parsed === "object") terms = JSON.stringify(parsed, null, 2);
            else terms = String(parsed);
          } catch (e) {
            // fallback: unescape escaped quotes
            terms = t.replace(/\\"/g, '"').replace(/\\n/g, "\n");
          }
        } else {
          terms = t.replace(/\\n/g, "\n").replace(/\\"/g, '"');
        }
      }
    } catch (e) {
      // ignore parse errors
    }

    setTermsModalContent(terms || "No terms available for this coupon.");
    setTermsModalCouponId(cid);
    setTermsModalOpen(true);
  };

  const toggleAccept = (id) => {
    setAcceptedTerms((p) => ({ ...p, [id]: !p[id] }));
  };

  const handleApply = (c) => {
    // if (!acceptedTerms[c.id]) {
    //   // open terms modal to force user read/agree
    //   openTermsModal(c, c.id);
    //   return;
    // }
    // proceed to checkout with coupon code in state
    navigate("/checkout", { state: { couponCode: c.coupon_code } });
  };

  return (
    <div
      className="max-w-7xl mx-auto my-6 px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Latest Coupons</h3>
          <div className="flex items-center gap-2">
            <button onClick={prev} aria-label="Previous" className="p-2 rounded-full bg-white shadow hover:bg-gray-100">
              ‹
            </button>
            <button onClick={next} aria-label="Next" className="p-2 rounded-full bg-white shadow hover:bg-gray-100">
              ›
            </button>
          </div>
        </div>

        <div className="w-full bg-gradient-to-r from-white to-gray-50 rounded-xl shadow p-4 flex items-center justify-center min-h-[88px]">
          {loading ? (
            <div className="text-gray-500">Loading coupons...</div>
          ) : error ? (
            <div className="text-red-500">Failed to load coupons</div>
          ) : (
            list.map((c, i) => (
              <div
                key={c.id ?? i}
                className={`w-full max-w-3xl transform transition-transform duration-500 ${
                  i === index ? "opacity-100 translate-x-0" : "opacity-0 absolute pointer-events-none"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="bg-blue-600 text-white rounded-lg px-4 py-3 flex-shrink-0">
                    <div className="text-sm font-medium">Code</div>
                    <div className="text-xl font-bold tracking-widest">{c.coupon_code}</div>
                  </div>

                  <div className="flex-1">
                    <div className="text-lg font-semibold text-gray-800">{c.coupon_name}</div>
                    <div className="text-sm text-gray-600 whitespace-pre-line">{c.description}</div>
                    {c.cart_minimum_display && <div className="text-xs text-gray-500 mt-1">{c.cart_minimum_display}</div>}

                    <div className="mt-3 flex items-center gap-3">
                      {/* <label className="flex items-center text-sm text-gray-700 select-none">
                        <input
                          type="checkbox"
                          checked={!!acceptedTerms[c.id]}
                          onChange={() => toggleAccept(c.id)}
                          className="mr-2 rounded"
                        />
                        I agree to the
                      </label> */}

                      <button
                        type="button"
                        onClick={() => openTermsModal(c, c.id)}
                        className="text-sm text-blue-600 hover:underline"
                        aria-label={`View terms for coupon ${c.coupon_code}`}
                      >
                        Terms & Conditions
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 text-right">
                    <div>Expires</div>
                    <div className="font-medium">{c.coupon_expiry_display || "—"}</div>
                  </div>

                  <button
                    onClick={() => handleApply(c)}
                    className={`ml-4 inline-block btn btn-primary`}
                    // aria-disabled={!acceptedTerms[c.id]}
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center mt-3 gap-2">
          {list.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to coupon ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 w-8 rounded-full transition-colors ${i === index ? "bg-blue-600" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>

      {/* Terms Modal */}
      {termsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-auto p-6 relative">
            <button
              onClick={() => setTermsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              aria-label="Close terms"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-3">Terms & Conditions</h3>
            <div className="text-sm text-gray-700 whitespace-pre-line mb-4">{termsModalContent}</div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setTermsModalOpen(false);
                }}
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-800"
              >
                Close
              </button>

              <button
                onClick={() => {
                  if (termsModalCouponId != null) {
                    setAcceptedTerms((p) => ({ ...p, [termsModalCouponId]: true }));
                  }
                  setTermsModalOpen(false);
                }}
                className="px-4 py-2 rounded-md bg-blue-600 text-white"
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}