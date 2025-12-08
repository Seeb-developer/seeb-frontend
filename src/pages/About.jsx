import React, { useState } from "react";
import { Helmet } from "react-helmet";
import ReactPlayer from 'react-player';

export default function AboutUs() {
  const [active, setActive] = useState("about");

  const tabs = [
    { key: "about", label: "About Us" },
    { key: "why", label: "Why Seeb" },
    { key: "promises", label: "Seeb Promises" },
    { key: "partner", label: "Seeb Partner" },
  ];

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>About Us - Seeb | AI-Powered Interior Design</title>
        <meta
          name="description"
          content="Learn about Seeb, India’s first AI-powered interior design platform. Discover how we design smarter, execute faster, and make dream homes affordable."
        />
        <meta name="keywords" content="Seeb, interior design, AI interior, home renovation, modular kitchen, false ceiling, Pune interiors, Bangalore interiors" />
        <meta name="author" content="Seeb Design Pvt Ltd" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://seeb.in/about" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://seeb.in/about" />
        <meta property="og:title" content="About Us - Seeb | AI-Powered Interior Design" />
        <meta property="og:description" content="Learn about Seeb, India’s first AI-powered interior design platform. Discover how we design smarter, execute faster, and make dream homes affordable." />
        <meta property="og:image" content="https://seeb.in/about-img.jpg" />
        <meta property="og:site_name" content="Seeb" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://seeb.in/about" />
        <meta name="twitter:title" content="About Us - Seeb | AI-Powered Interior Design" />
        <meta name="twitter:description" content="Learn about Seeb, India’s first AI-powered interior design platform. Discover how we design smarter, execute faster, and make dream homes affordable." />
        <meta name="twitter:image" content="https://seeb.in/about-img.jpg" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">

          {/* Full width hero video with tabs overlayed at the bottom */}
          <div className="w-full mb-8 relative">
            <div className="w-full h-64 md:h-[420px] lg:h-[520px] rounded-2xl shadow-xl overflow-hidden bg-black">
              <ReactPlayer
                slot="media"
                src="https://www.youtube.com/watch?v=X5juqDPDFJ0&t" // replace VIDEO_ID
                controls={true}
                style={{
                  width: "100%",
                  height: "100%",
                  "--controls": "none",
                }}
                loop={true}
                playing={true}
                autoPlay={true}
                // muted={true}
                className="react-player"
              />
            </div>

            {/* Tabs / Options - overlay on video bottom */}
            <div className=" inset-x-0 py-6 flex justify-center px-4">
              <div className="inline-flex bg-white/90 backdrop-blur-sm rounded-full shadow-md p-1">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActive(t.key)}
                    aria-pressed={active === t.key}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${active === t.key
                      ? "bg-blue-700 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content for selected tab */}
          <div className="space-y-6">
            <div className="space-y-6">
              {active === "about" && (
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">About Seeb</h1>

                  <p className="text-lg text-gray-700 leading-relaxed mb-4 text-justify">
                    Welcome to <strong>Seeb</strong> — an easy and transparent platform for all your home and office interior needs,
                    from small tasks to complete setup execution.
                  </p>

                  <p className="text-lg text-gray-700 leading-relaxed mb-4 text-justify">
                    We are based in Pune and bring over <strong>12 years of hands-on experience</strong> in the execution industry.
                    Seeb is a next-generation online platform that simplifies how people plan, book, and manage home or office
                    improvement work. Built on <strong>technology, transparency, and trust</strong>, Seeb connects users with
                    verified professionals and manages every process with complete clarity — from booking to completion.
                  </p>

                  <p className="text-lg text-gray-700 leading-relaxed mb-4 text-justify">
                    Seeb gives you full control and simplifies everything, allowing you to manage every stage of your work
                    effortlessly and confidently. It empowers you to stay in control of your money, ensuring every transaction
                    is transparent, fair, and directly linked to the progress of your work.
                  </p>

                  <p className="text-lg text-gray-700 leading-relaxed mb-4 text-justify">
                    We are firm believers in <strong>timely delivery</strong>, maintaining strict coordination and accountability
                    so every task is completed exactly when promised. From measurement and coordination to execution and updates,
                    Seeb ensures that each step is organized, trackable, and completed without delays or confusion.
                  </p>

                  <p className="text-lg text-gray-700 leading-relaxed mb-4 text-justify">
                    Seeb brings together innovation and reliability to give customers a seamless, end-to-end experience —
                    eliminating hidden costs, long wait times, and miscommunication. Everything is managed digitally, giving users
                    full visibility, financial confidence, and total peace of mind.
                  </p>

                  <p className="text-lg text-gray-700 leading-relaxed mb-6 text-justify">
                    At its core, Seeb represents a smarter way to get work done — with <strong>precision, accountability, and ease.</strong>
                  </p>

                  <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">With Seeb, you can:</h2>

                  <p className="text-lg text-gray-700 leading-relaxed mb-4 text-justify">
                    Through the Seeb App, users can easily access and manage <strong>150+ home and office retail services</strong>,
                    all available to book directly through the app — just like products. From false ceiling, electrical work,
                    painting, plumbing, carpentry, furniture, modular kitchen, light fittings, customized sofas, mattresses,
                    and curtains — Seeb makes it possible to handle every task on your own terms, in one simple, easy-to-use system.
                  </p>

                  <h3 className="text-xl font-semibold text-blue-700 mb-2">Instant Cost Transparency Example</h3>

                  <p className="text-lg text-gray-700 leading-relaxed mb-4 text-justify">
                    If you want to install a false ceiling in your 2BHK living room of 10x16 ft (160 sq. ft), Seeb instantly calculates your cost:
                    <br /><br />
                    • Basic design: ₹9,600<br />
                    • COB LED provision: ₹2,400<br />
                    ✅ <strong>Total: ₹12,000 only</strong>
                  </p>

                  <p className="text-lg text-gray-700 leading-relaxed mb-4 text-justify">
                    The same work usually costs ₹35,000–₹40,000 in the open market — that means you save up to 70%, with no hidden costs
                    and full transparency.
                  </p>

                  <p className="text-lg text-gray-700 leading-relaxed mb-4 text-justify">
                    At Seeb, what you design is exactly what you get. We don’t take any advance payment until materials reach your home.
                    Once you verify the delivery, you can pay online or offline — your choice.
                  </p>

                  <p className="text-lg text-gray-700 leading-relaxed mb-6 text-justify">
                    All our furniture is factory-made, and on-site work is managed by our skilled and verified team — from a single door to an entire flat.
                  </p>
                </div>
              )}
            </div>


            {active === "why" && (
              <section>
                <h2 className="text-3xl font-semibold text-blue-700 mb-4">Why Choose Seeb</h2>

                <p className="text-lg text-gray-700 leading-relaxed mb-4 text-justify">
                  <strong>Because Every Detail Matters — and So Does Your Trust.</strong><br />
                  Seeb isn’t just a service provider — it’s a complete digital platform that gives you total control over
                  every task related to your home, office, or retail work. We combine technology, transparency, and
                  time discipline to make execution simple, predictable, and stress-free.
                </p>

                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Here’s why thousands choose Seeb as their trusted execution partner 👇
                </p>

                <ul className="space-y-6 text-gray-700">
                  <li>
                    <strong>💎 1. 100% Transparency</strong><br />
                    No hidden charges, no middlemen, no confusion.
                    Every price, material, and update is visible in real time — because clarity builds confidence.
                  </li>

                  <li>
                    <strong>🧭 2. Full Control in Your Hands</strong><br />
                    You decide everything. From selecting designs and approving materials to tracking progress —
                    Seeb keeps you in command at every step.
                  </li>

                  <li>
                    <strong>🕒 3. On-Time Delivery Guarantee</strong><br />
                    We respect your time. Our coordination system ensures every task is executed with precision,
                    right when it’s promised — no delays, no excuses.
                  </li>

                  <li>
                    <strong>💰 4. No Advance Payments — No Cash, No Risk</strong><br />
                    At Seeb, we believe trust should be earned, not asked for. You never pay in advance.
                    Payment happens only after materials reach your site and you’re satisfied with the progress.
                    Every transaction happens securely through the Seeb App — no cash, no confusion,
                    just transparent, trackable, and verified payments.
                  </li>

                  <li>
                    <strong>📱 5. Smart Digital Experience</strong><br />
                    Book services, track updates, and get instant cost calculations — all through a single,
                    easy-to-use app interface.
                  </li>

                  <li>
                    <strong>🧰 6. Verified & Skilled Professionals</strong><br />
                    We work only with trained, certified teams who meet Seeb’s strict quality standards — ensuring
                    accuracy and accountability in every job.
                  </li>

                  <li>
                    <strong>🏭 7. Factory-Made Quality, On-Site Perfection</strong><br />
                    All furniture and modular components are factory-produced for consistency, then installed by our
                    skilled team for a flawless finish.
                  </li>

                  <li>
                    <strong>📉 8. Save Up to 70% on Market Prices</strong><br />
                    With direct pricing, controlled manufacturing, and zero commission gaps, you get the best value
                    without compromising quality.
                  </li>

                  <li>
                    <strong>🧩 9. 150+ Services, One Platform</strong><br />
                    From false ceilings to curtains, Seeb lets you book over 100 services directly through the app —
                    just like buying a product.
                  </li>

                  <li>
                    <strong>❤️ 10. Customer-First Promise</strong><br />
                    Every project we take is personal. Your satisfaction is our measure of success — not just completion.
                  </li>
                </ul>

                <p className="text-lg text-gray-700 leading-relaxed mt-8 text-justify">
                  <strong>The Seeb Difference</strong><br />
                  No confusion. No delays. No hidden costs.<br />
                  Just a transparent system that helps you design, book, and manage everything — effortlessly.<br />
                  <strong>Seeb — Because Smart People Choose Clarity.</strong>
                </p>
              </section>
            )}

            {active === "promises" && (
              <section>
                <h2 className="text-3xl font-semibold text-blue-700 mb-4">Seeb Promises</h2>

                <p className="text-lg text-gray-700 leading-relaxed mb-4 text-justify">
                  <strong>Because Your Trust Deserves More Than Words.</strong><br />
                  At Seeb, we believe that trust is built through actions — consistent, transparent, and accountable.
                  Every promise we make is backed by our system, process, and people — ensuring your journey from
                  booking to completion is smooth, honest, and stress-free.
                </p>

                <h3 className="text-2xl font-semibold text-blue-700 mt-8 mb-4">Our Core Promises to You</h3>
                <ul className="space-y-5 text-gray-700 text-lg leading-relaxed">
                  <li>
                    <strong>💎 1. Full Control in Your Hands</strong><br />
                    You decide, you approve, you track. Every stage — from booking to delivery — happens with your consent
                    and full visibility inside the Seeb App.
                  </li>

                  <li>
                    <strong>💰 2. Transparent & Fair Pricing</strong><br />
                    No hidden costs. No last-minute surprises. Every estimate and update is clear, itemized, and directly
                    linked to the progress of your work.
                  </li>

                  <li>
                    <strong>⏱️ 3. On-Time Delivery, Every Time</strong><br />
                    We are firm believers in timely execution. Every task is coordinated, monitored, and completed exactly
                    when promised — because your time matters.
                  </li>

                  <li>
                    <strong>🧰 4. Verified & Skilled Teams</strong><br />
                    Only verified professionals and trained specialists work through Seeb. Every job is executed with
                    precision, quality, and accountability.
                  </li>

                  <li>
                    <strong>🏭 5. Factory-Made Quality</strong><br />
                    All furniture and modular items are made in controlled environments to ensure finish consistency,
                    durability, and long-term value.
                  </li>

                  <li>
                    <strong>💳 6. No Advance Until Delivery</strong><br />
                    We don’t ask for advance payments until materials reach your home. You pay online or offline only after
                    verification — your money stays safe and in your control.
                  </li>

                  <li>
                    <strong>🔍 7. Digital Transparency at Every Step</strong><br />
                    Track your project, view updates, access bills, and communicate with your team — all in one place.
                    Seeb’s digital system eliminates confusion and brings complete clarity.
                  </li>

                  <li>
                    <strong>💬 8. Dedicated Support That Listens</strong><br />
                    Our coordination team stays connected throughout your journey — ensuring you’re heard, informed, and
                    satisfied.
                  </li>
                </ul>

                <h3 className="text-2xl font-semibold text-blue-700 mt-10 mb-4">Our Commitment</h3>
                <p className="text-lg text-gray-700 leading-relaxed text-justify">
                  At Seeb, we don’t just deliver work — we deliver peace of mind.
                  Every project reflects our promise to uphold transparency, punctuality, and perfection.<br />
                  <strong>Seeb — Where Every Promise Is Delivered.</strong>
                </p>
              </section>
            )}


            {active === "partner" && (
              <section>
                <h2 className="text-3xl font-semibold text-blue-700 mb-4">Our Partners</h2>

                <p className="text-lg text-gray-700 leading-relaxed mb-4 text-justify">
                  <strong>Quality You Can Trust</strong><br />
                  At Seeb, we believe that flawless execution begins with trusted materials and reliable brands.
                  That’s why we work exclusively with India’s most respected and premium names in the interior and
                  construction industry.
                </p>

                <p className="text-lg text-gray-700 leading-relaxed mb-4 text-justify">
                  Every partner we collaborate with shares our values — durability, design precision, and long-term
                  quality — ensuring your home not only looks stunning today but also stands strong for years to come.
                </p>

                <p className="text-lg text-gray-700 leading-relaxed mb-6 text-justify">
                  Seeb doesn’t just choose partners — we build with them. Every screw, surface, and finish in your space
                  comes from a brand known for excellence, ensuring consistency, safety, and longevity in every project.
                </p>

                <h3 className="text-2xl font-semibold text-blue-700 mt-10 mb-6">Our Verified Brand Partners</h3>

                <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                  <div>
                    <strong>🧰 Hardware Partners</strong><br />
                    <span className="text-blue-700 font-semibold">Ebco, Häfele, Onixy, Hettich</span><br />
                    Precision-engineered hardware for smooth functionality and lasting performance.
                  </div>

                  <div>
                    <strong>💡 Lighting Partner</strong><br />
                    <span className="text-blue-700 font-semibold">Wipro Lights</span><br />
                    Smart, energy-efficient lighting solutions that bring warmth and balance to your interiors.
                  </div>

                  <div>
                    <strong>🪡 Fabric & Curtain Partners</strong><br />
                    <span className="text-blue-700 font-semibold">D’Decor, MR Fabric, Bombay Traders</span><br />
                    Elegant and premium textiles that blend comfort, luxury, and design versatility.
                  </div>

                  <div>
                    <strong>🪵 Laminate & Surface Partners</strong><br />
                    <span className="text-blue-700 font-semibold">Merino, Royale Touche, Real Touch</span><br />
                    High-quality laminates with rich finishes and color consistency — made for Indian conditions.
                  </div>

                  <div>
                    <strong>🎨 Paint Partner</strong><br />
                    <span className="text-blue-700 font-semibold">Asian Paints</span><br />
                    Beautiful, durable wall finishes that reflect your personality and elevate every room.
                  </div>

                  <div>
                    <strong>🏗️ Ceiling & Gypsum Partner</strong><br />
                    <span className="text-blue-700 font-semibold">Saint-Gobain</span><br />
                    World-class gypsum and ceiling systems for clean, modern, and elegant interiors.
                  </div>

                  <div>
                    <strong>🔍 Glass & Mirror Partner</strong><br />
                    <span className="text-blue-700 font-semibold">Modi Glass</span><br />
                    Crystal-clear glass and mirror solutions ensuring quality, safety, and timeless appeal.
                  </div>

                  <div>
                    <strong>🧱 Tiles & Marble Partner</strong><br />
                    <span className="text-blue-700 font-semibold">Hindustan Granite</span><br />
                    Premium tiles, marble, and surface finishes that define luxury and strength.
                  </div>

                  <div>
                    <strong>🚰 Plumbing Hardware Partner</strong><br />
                    <span className="text-blue-700 font-semibold">Supreme Pipes</span><br />
                    Reliable plumbing solutions built for long-term performance and safety.
                  </div>

                  <div>
                    <strong>⚡ Electrical & Wire Partner</strong><br />
                    <span className="text-blue-700 font-semibold">Polycab Wires</span><br />
                    Trusted for quality, efficiency, and safety in every electrical installation.
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-blue-700 mt-10 mb-4">Built Only with the Best</h3>
                <p className="text-lg text-gray-700 leading-relaxed text-justify">
                  At Seeb, quality isn’t optional — it’s the foundation of everything we do.
                  We work only with these certified and industry-leading partners to ensure your home or workspace
                  is built with materials that meet the highest standards of craftsmanship, design, and reliability.
                </p>

                <p className="text-lg text-gray-700 leading-relaxed font-semibold mt-4">
                  Seeb + Our Partners = A Home Built to Last.
                </p>
              </section>
            )}

          </div>

          {/* Rest of the page sections (optional) */}
          {/* <section className="mt-12">
            <h2 className="text-3xl font-semibold text-blue-700 mb-4">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
              <div className="bg-white shadow-md p-6 rounded-xl">
                <h3 className="font-semibold mb-2">Room Scanning & Smart Floor Plans</h3>
                <p>Use your phone to scan your space or upload a layout — our AI instantly generates accurate 2D plans with walls, windows, and measurements.</p>
              </div>
              <div className="bg-white shadow-md p-6 rounded-xl">
                <h3 className="font-semibold mb-2">Choose from 100+ Design Themes</h3>
                <p>Explore a rich collection of curated design styles including Modern Minimalist, Boho Chic, South Indian Traditional, Kashmiri Heritage, Zen-Inspired, and more.</p>
              </div>
              <div className="bg-white shadow-md p-6 rounded-xl">
                <h3 className="font-semibold mb-2">Customize Wall-Wise & Element-Wise</h3>
                <p>Design everything from TV back panels and bed headboards to modular furniture, lighting layouts, and soft furnishings.</p>
              </div>
              <div className="bg-white shadow-md p-6 rounded-xl">
                <h3 className="font-semibold mb-2">Modular Booking System</h3>
                <p>Only pay for the services you need — such as false ceilings, wardrobes, study areas, modular kitchens, and more. No forced packages.</p>
              </div>
              <div className="bg-white shadow-md p-6 rounded-xl">
                <h3 className="font-semibold mb-2">Real-Time Tracking via App</h3>
                <p>Monitor budget, timeline, visual updates, and coordinate with our experts — all from your phone.</p>
              </div>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-3xl font-semibold text-blue-700 mb-4">Who We Serve</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Homeowners seeking smart, stress-free renovations</li>
              <li>Tenants and new buyers looking to personalize their space affordably</li>
              <li>Busy professionals needing end-to-end execution without hand-holding</li>
              <li>Families valuing both style and practicality in their home design</li>
              <li>We currently operate in Pune, Bangalore, and major Indian cities, and have delivered over 100 successful projects.</li>
            </ul>
          </section>

          <section className="mt-12">
            <h2 className="text-3xl font-semibold text-blue-700 mb-4">Our Mission</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Democratize access to high-quality interior design</li>
              <li>Eliminate inefficiencies and opacity from traditional design models</li>
              <li>Help people build homes that reflect their personality and purpose</li>
              <li>Bring world-class tools and aesthetics to Indian homes</li>
              <li>Deliver smarter spaces — faster, easier, and more affordably</li>
            </ul>
          </section>

          <section className="mt-12">
            <h2 className="text-3xl font-semibold text-blue-700 mb-4">Our Vision</h2>
            <p className="text-base text-gray-600">
              To become India’s most trusted interior tech brand, enabling every homeowner to create meaningful spaces they’re proud to live in — without stress or compromise.
            </p>
          </section> */}
        </div>
      </div>
    </>
  );
}
