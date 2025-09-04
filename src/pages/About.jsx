import { Helmet } from "react-helmet";

export default function AboutUs() {
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
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <img
                src="/about-img.jpg"
                alt="About Seeb"
                className="rounded-3xl shadow-xl w-full object-cover"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">About Seeb</h1>
              <p className="text-lg text-gray-700 leading-relaxed mb-6 text-justify">
                <strong>Designing Dreams. Crafting Spaces.</strong><br />
                At Seeb, we believe that your home is more than just walls — it’s a reflection of who you are. That’s why we built India’s first AI-powered interior design platform to help homeowners design, visualize, and build their dream spaces — all in one place.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6 text-justify">
                Whether you’re moving into a new home, renovating an old one, or just refreshing a room, Seeb provides professional-grade interior design tools — without the high costs, delays, or guesswork.
              </p>
            </div>
          </div>

          <section className="mt-16">
            <h2 className="text-3xl font-semibold text-blue-700 mb-4">Why Seeb?</h2>
            <p className="text-base text-gray-600 leading-relaxed">
              Interior design can often feel overwhelming — from long project timelines and confusing packages to uncoordinated vendors and hidden charges. Seeb was created to solve all of this. We use a blend of AI technology, expert design, and transparent execution to bring efficiency, speed, and personalization to home design.
            </p>
          </section>

          <section className="mt-12">
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
          </section>
        </div>
      </div>
    </>
  );
}
