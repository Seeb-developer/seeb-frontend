import { useEffect, useState } from 'react';
import { Download, ArrowDown, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import ContactFormModal from '../components/ContactFormModal';
import { ServicesGrid } from '../components/ServicesGridSection';

const LandingPage = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

    const [showAll, setShowAll] = useState(false);

    const comparisonData = [
        ["Instant Floor Plan & 3D Design", "✅ Done in minutes via app", "❌ 2–7 days after site visit", "❌ Usually not available"],
        ["Style-Based Room Design (100+ themes)", "✅ Wall-wise, element-wise AI", "⚠ Limited catalogs & options", "❌ No design assistance"],
        ["Execution Team", "✅ Verified Skilled Teams", "⚠ Subcontracted labor", "⚠ Unknown local teams"],
        ["Budget Estimate", "✅ Real-time cost preview", "❌ Shared after design discussion", "❌ Often manual + variable"],
        ["Transparency", "✅ Full breakdown of work & price", "⚠ Confusing packages", "❌ No breakdown or clarity"],
        ["Experience Center Support", "✅ Yes, in major cities", "⚠ Sometimes available", "❌ Not available"],
        ["Execution Speed", "⚡ 10–45 days", "45–90 days", "30–90 days"],
        ["Affordability", "₹₹ Pay only for what you need", "₹₹₹ 40–60% higher", "₹ Low cost, but low guarantee"],
        ["Revisions / Changes", "✅ Digital changes anytime", "⚠ Complex or chargeable", "❌ Not possible"],
        ["App Control", "✅ Full control via mobile app", "❌ Mostly offline", "❌ Manual calls"],
        ["Factory Finish & Warranty", "✅ 10 yrs furniture, 1 yr work", "✅ Usually 5–10 yrs", "❌ No guarantee"],
        ["Material Options", "✅ All major Indian brands", "⚠ Limited to partner vendors", "⚠ Only what vendor sources"],
        ["Payment Flexibility", "✅ Stage-wise payments", "⚠ Milestone-based but rigid", "⚠ Lump sum, advance-heavy"],
        ["Support Availability", "✅ Live chat + call + WhatsApp", "✅ Call-based support", "❌ No dedicated support"],
        ["Customer Feedback System", "✅ Built-in rating & feedback", "⚠ Not always collected", "❌ No formal review system"],
        ["Design Ownership", "✅ All designs belong to user", "⚠ Agency owns base design", "❌ No design ownership"],
        ["Quotation Validity", "✅ 30-day lock on quotes", "⚠ 7–15 day validity", "❌ No written quote timeline"],
        ["Custom Furniture Options", "✅ Factory-made, customized", "⚠ Semi-custom; some modular", "❌ Site-built only"],
        ["Digital Walkthroughs", "✅ Auto-generated for each design", "⚠ Manually shown or emailed", "❌ Not available"],
        ["Live Project Tracking", "✅ Track tasks & visits via app", "⚠ Site engineer updates manually", "❌ No digital tracking"]
    ];

    const visibleData = showAll ? comparisonData : comparisonData.slice(0, 10);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    //     useEffect(() => {
    //     const interval = setInterval(() => {
    //       setModalOpen(true);
    //     }, 20000); // 15000ms = 15 seconds

    //     return () => clearInterval(interval); // Cleanup on unmount
    //   }, []);

    const scrollToSection = (href) => {
        if (href === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setIsMobileMenuOpen(false);
    };

    const navItems = [
        { label: 'Home', href: '#' },
        { label: 'Services', href: '#services' },
        { label: 'Designs', href: '#designs' },
        { label: 'Floor Plan', href: '#floorplan' },
        { label: 'Offer', href: '#offer' },
        { label: 'Contact', href: '#support' },
    ];

    const services = [
        { name: 'Wardrobe', image: '/service-icons/wardrobe-3.jpeg' },
        { name: 'False Ceiling', image: '/service-icons/ceiling-2.jpeg' },
        { name: 'Modular Kitchen', image: '/service-icons/kitchen-2.jpeg' },
        { name: 'Painting & Wallpaper', image: '/service-icons/wallpaper.jpeg' },
        { name: 'Paneling', image: '/service-icons/pannel-2.jpeg' },
        { name: 'Electrical', image: '/service-icons/eletrical-2.jpeg' },
        { name: 'Sliding Doors', image: '/service-icons/door-1.jpeg' },
        { name: 'Custom Work', image: '/service-icons/custom.jpeg' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0e0e0e] to-[#1a1a1a] text-white">
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-28">
                    <a href='/landing-page'>
                        <img src="/logo_name.png" alt="" className='h-16' />
                        <p className='text-sm'>Designing Dreams, Crafting Space.</p>
                    </a>
                    {/* <div className="hidden md:flex space-x-8">
                        {navItems.map((item) => (
                            <button key={item.label} onClick={() => scrollToSection(item.href)} className="text-white hover:text-[#facc15] px-3 py-2 text-base font-medium transition-colors">
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div> */}
                </div>
                {/* {isMobileMenuOpen && (
                    <div className="md:hidden bg-black/95 backdrop-blur-md px-4 py-4">
                        {navItems.map((item) => (
                            <button key={item.label} onClick={() => scrollToSection(item.href)} className="text-white hover:text-[#facc15] block px-3 py-2 text-base font-medium">
                                {item.label}
                            </button>
                        ))}
                    </div>
                )} */}
            </nav>

            {/* Hero Section */}
            <section
                id="hero"
                className="min-h-screen relative flex flex-col items-center justify-center text-center px-4 pt-32 bg-cover bg-center"
                style={{ backgroundImage: "url('/bg-img-1.jpg')" }}            >
                <div className="absolute inset-0 bg-black bg-opacity-70 z-0" />
                <div className="relative z-10 max-w-7xl w-full">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#facc15] leading-tight">
                        Interior Design Ka Headache Khatam
                    </h1>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mt-4">
                        Sirf SEEB App Se
                    </h2>
                    {/* <p className="text-lg md:text-xl text-gray-300 font-medium max-w-4xl mx-auto mt-6 leading-relaxed">
                        Create your floor plan → Select your style → View 3D designs → Book only the services you need.
                    </p> */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
                        {/* <button className="bg-[#facc15] text-black font-semibold px-8 py-4 rounded-full text-lg hover:bg-[#facc15]/90 transition-all duration-300 hover:scale-105 flex items-center"
                            onClick={() => window.open('https://play.google.com/store/apps/details?id=your.android.app', '_blank')}
                        >
                            <Download className="mr-2 h-5 w-5" /> Download App (Android)
                        </button>
                        <button className="border border-[#facc15] text-[#facc15] px-8 py-4 rounded-full text-lg hover:bg-[#facc15] hover:text-black transition-all duration-300 hover:scale-105 flex items-center"
                            onClick={() => window.open('https://apps.apple.com/us/app/seeb-desgin/id6747076134', '_blank')}
                        >
                            <Download className="mr-2 h-5 w-5" /> iOS App
                        </button> */}
                        <button className="bg-[#facc15] text-black font-semibold px-8 py-4 rounded-full text-lg hover:bg-[#facc15]/90 transition-all duration-300 hover:scale-105 flex items-center"
                            onClick={() => window.open('https://wa.me/917709899729')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-whatsapp me-2" viewBox="0 0 16 16">
                                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                            </svg> Whatsapp
                        </button>
                        <button className="border border-[#facc15] text-[#facc15] px-8 py-4 rounded-full text-lg hover:bg-[#facc15] hover:text-black transition-all duration-300 hover:scale-105 flex items-center"
                            onClick={() => window.location.href = 'tel:18005703133'}
                        >
                            <Phone className="mr-2 h-5 w-5" />  Call Now
                        </button>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
                    <ArrowDown className="text-[#facc15] h-8 w-8" />
                </div>
            </section>

            {/* steps Section */}
            <section id="steps" className="py-20 bg-black text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-[#facc15] mb-16">How It Works</h2>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6">
                    {[
                        {
                            title: '1. Select Room',
                            image: '/screens/png-1.png',
                        },
                        {
                            title: '2. Create Floor Plan',
                            image: '/screens/png-2.png',
                        },
                        {
                            title: '3. Select Style',
                            image: '/screens/png-3.png',
                        },
                        {
                            title: '4. View 3D Design',
                            image: '/screens/png-4.png',
                        },

                    ].map((step, index) => (
                        <div key={index} className="flex flex-col items-center space-y-4">
                            <div className="h-[500px] flex items-center justify-center">
                                <img
                                    src={step.image}
                                    alt={step.title}
                                    className="object-contain w-full h-full"
                                />
                            </div>
                            <h3 className="text-white text-lg font-semibold">{step.title}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* Video Section */}
            <section id="welcome-video" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold text-[#facc15]">How SEEB Works – Full Control in Your Hands</h2>
                        <div className="relative max-w-4xl mx-auto">
                            <div className="aspect-video bg-black/50 rounded-2xl border border-[#facc15]/20 overflow-hidden backdrop-blur-sm">
                                <iframe
                                    className="w-full h-full rounded-2xl"
                                    src="https://www.youtube.com/embed/YmL_n61Ko2Q?autoplay=1&mute=1&loop=1&playlist=YmL_n61Ko2Q&controls=1&playsinline=1"
                                    title="YouTube video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            </div>
                        </div>

                        <div className="max-w-3xl mx-auto space-y-6">
                            <p className="text-lg font-medium text-gray-300 leading-relaxed text-center">
                                Floor plan, design, booking — sab kuch ek app mein. Jo dikhega wahi banega.
                            </p>
                            <div className="flex justify-center">
                                <button className="border border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-black px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 flex items-center"
                                    onClick={() => window.open("https://www.seeb.in")}
                                >
                                    Start Floor Plan <ArrowRight className="ml-2 h-5 w-5" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* Services Section */}
            {/* <section id="services" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-[#facc15]">
                            Execution is Our Backbone – Design is Free
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                            {services.map((service, index) => (
                                <div
                                    key={index}
                                    className="text-center space-y-3 backdrop-blur-sm hover:border-[#facc15]/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                                > */}
            {/* <div className="flex justify-center">
                                        <img
                                            src={service.image}
                                            alt={service.name}
                                            className="w-24 h-24 object-contain"
                                        />
                                    </div>
                                    <h3 className="text-white font-semibold text-sm md:text-base">
                                        {service.name}
                                    </h3> */}

            {/* <div>
                                        <img
                                            src={service.image}
                                            alt={service.name}
                                            className="rounded-xl mb-2 h-44 object-cover"
                                        />
                                        <h3 className="text-white font-semibold text-sm md:text-base">
                                            {service.name}
                                        </h3>
                                    </div>
                                </div>

                            ))}
                        </div>
                        <div className="bg-gradient-to-r from-[#facc15]/10 to-transparent border border-[#facc15]/20 rounded-2xl p-8 max-w-4xl mx-auto backdrop-blur-sm">
                            <p className="text-xl md:text-2xl text-white font-semibold mb-6">
                                Book any service → Floor plan + 3D design is free
                            </p>
                            <div className='flex justify-center'>
                                <button
                                    className="bg-[#facc15] text-black font-semibold px-8 py-4 text-lg rounded-full hover:bg-[#facc15]/90 transition-all duration-300 hover:scale-105 flex items-center"
                                    onClick={() => window.location.href = 'tel:18005703133'}
                                >
                                    <Phone className="mr-2 h-5 w-5" /> Book Now
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </section> */}


            <section className='text-black'>
                <h2 className='text-3xl md:text-5xl font-bold text-[#facc15] text-center mb-12'>Execution is Our Backbone – Design is Free</h2>
                <ServicesGrid />
            </section>

            {/* Floor Plan Section */}
            <section id="floorplan" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-5xl font-bold text-[#facc15]">
                                Start With Floor Plan – App Ya Manual Entry
                            </h2>
                            <div className="space-y-4 text-lg text-gray-300">
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-[#facc15] rounded-full mt-3 flex-shrink-0"></div>
                                    <p>Scan with LiDAR or manually enter room sizes</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-[#facc15] rounded-full mt-3 flex-shrink-0"></div>
                                    <p>Instant layout generation</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-[#facc15] rounded-full mt-3 flex-shrink-0"></div>
                                    <p>Used to build accurate designs</p>
                                </div>
                            </div>
                            <button className="bg-[#facc15] text-black font-semibold px-8 py-4 text-lg rounded-full hover:bg-black hover:text-[#facc15] border border-transparent hover:border-[#facc15] transition-all duration-300 hover:scale-105 flex items-center"
                                onClick={() => window.open("https://www.seeb.in")}
                            >
                                Start Floor Plan <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                        </div>
                        <div className="relative">
                            <div className="bg-black/40 border border-[#facc15]/20 rounded-2xl p-8 backdrop-blur-sm">
                                <img src="/fp-2.png" alt="floorplan-image" className='w-full rounded-md' />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Design Explorer Section */}
            <section id="designs" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="bg-black/40 border border-[#facc15]/20 rounded-2xl p-8 backdrop-blur-sm">
                                <img src="/test-2.png" alt="floorplan-image" className='w-full rounded-md' />

                            </div>
                        </div>
                        <div className="space-y-8 order-1 lg:order-2">
                            <h2 className="text-3xl md:text-5xl font-bold text-[#facc15]">
                                Wall-Wise, Element-Wise Design – What You See Is What You Get
                            </h2>
                            <div className="space-y-4 text-lg text-gray-300">
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-[#facc15] rounded-full mt-3 flex-shrink-0"></div>
                                    <p>Preview 3D layout</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-[#facc15] rounded-full mt-3 flex-shrink-0"></div>
                                    <p>See element clarity: TV unit, curtain wall, bed wall</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-[#facc15] rounded-full mt-3 flex-shrink-0"></div>
                                    <p>Real colors, factory precision</p>
                                </div>
                            </div>
                            <button className="border border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-black px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 flex items-center"
                                onClick={() => window.open("https://www.seeb.in")}
                            >
                                Try Design Tool <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section id="comparison" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-[#facc15]">SEEB vs Others</h2>
                        <div className="max-w-full overflow-x-auto">
                            <div className="min-w-[900px] bg-black/40 border border-[#facc15]/20 rounded-2xl overflow-hidden backdrop-blur-sm">
                                {/* Table Header */}
                                <div className="grid grid-cols-4 bg-[#facc15]/10 border-b border-[#facc15]/20">
                                    <div className="p-4 font-bold text-[#facc15] text-left">Feature / Service</div>
                                    <div className="p-4 font-bold text-[#facc15] text-center">SEEB App</div>
                                    <div className="p-4 font-bold text-[#facc15] text-center">Traditional Companies</div>
                                    <div className="p-4 font-bold text-[#facc15] text-center">Local Contractors</div>
                                </div>

                                {/* Dynamic Rows */}
                                {visibleData.map(([feature, seeb, traditional, local], index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-4 border-t border-[#facc15]/10 hover:bg-[#facc15]/5 transition duration-200"
                                    >
                                        <div className="p-4 text-white text-left">{feature}</div>
                                        <div className="p-4 text-green-400 text-center">{seeb}</div>
                                        <div className="p-4 text-yellow-400 text-center">{traditional}</div>
                                        <div className="p-4 text-red-400 text-center">{local}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-6">
                                <button
                                    onClick={() => setShowAll(!showAll)}
                                    className="text-lg text-[#facc15] border-b-2 border-[#facc15] hover:text-white transition duration-200"
                                >
                                    {showAll ? "Show Less" : "Show More"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Offer Banner Section */}
            <section id="offer" className="py-12 relative ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-[#facc15] to-[#facc15]/80 rounded-2xl p-8 md:p-12 text-center text-black">
                        <div className="space-y-6">
                            <h2 className="text-2xl md:text-4xl font-bold">
                                Book any single service → Get design + floor plan absolutely FREE.
                            </h2>
                            <p className="text-lg md:text-xl font-medium">
                                No extra design charges. No package force.
                            </p>
                            <button className="bg-black text-[#facc15] hover:bg-gray-900 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
                                onClick={() => window.open("https://www.seeb.in")}
                            >
                                Claim Offer Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Execution Section */}
            <section id="execution" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-[#facc15]">
                            How SEEB Executes Projects
                        </h2>
                        <div className="max-w-4xl mx-auto">
                            <div className="space-y-8">
                                {[
                                    { number: '01', title: 'Floor plan and design finalized' },
                                    { number: '02', title: 'Choose service' },
                                    { number: '03', title: 'In-house skilled team assigned' },
                                    { number: '04', title: 'Factory or site work done' },
                                    { number: '05', title: 'Pay in stages' },
                                    { number: '06', title: 'Installation + warranty' },
                                ].map((step, index, array) => (
                                    <div key={step.number} className="relative">
                                        <div className="flex items-center space-x-6 bg-black/40 border border-[#facc15]/20 rounded-2xl p-6 backdrop-blur-sm hover:border-[#facc15]/50 transition-all duration-300">
                                            <div className="flex-shrink-0 w-16 h-16 bg-[#facc15] text-black rounded-full flex items-center justify-center font-bold text-lg">
                                                {step.number}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <h3 className="text-lg md:text-xl font-semibold text-white">
                                                    {step.title}
                                                </h3>
                                            </div>
                                        </div>
                                        {index < array.length - 1 && (
                                            <div className="absolute left-8 top-full w-0.5 h-8 bg-[#facc15]/30"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* <section id="video-testimonial" className="py-20 bg-black text-center px-4">
                <div className="max-w-7xl mx-auto space-y-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#facc15]">
                        What Our Customers Say
                    </h2>
                    <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                        Hear directly from SEEB users — why they loved our service and how it transformed their space.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                        <div className="rounded-xl overflow-hidden shadow-lg border border-[#facc15]/20">
                            <iframe
                                className="w-full aspect-video"
                                src="https://www.youtube.com/embed/YOUR_VIDEO_ID_1"
                                title="Customer Testimonial 1"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>

                        <div className="rounded-xl overflow-hidden shadow-lg border border-[#facc15]/20">
                            <iframe
                                className="w-full aspect-video"
                                src="https://www.youtube.com/embed/YOUR_VIDEO_ID_2"
                                title="Customer Testimonial 2"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            </section> */}


            {/* App Download Section */}
            <section id="download" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-[#facc15]">
                            Download SEEB App for Full Control
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                            {["Floor plan", "Design", "Booking", "Order tracking"].map((feature) => (
                                <div
                                    key={feature}
                                    className="bg-black/40 border border-[#facc15]/20 rounded-xl p-6 backdrop-blur-sm hover:border-[#facc15]/50 transition-all duration-300"
                                >
                                    <h3 className="text-white font-semibold text-lg text-center">{feature}</h3>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            {/* <button
                                className="bg-[#facc15] text-black hover:bg-[#facc15]/90 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 flex items-center"
                                onClick={() => window.open('https://play.google.com/store/apps/details?id=your.android.app', '_blank')}
                            >
                                <Download className="mr-2 h-5 w-5" /> Download Android
                            </button> */}

                            <button
                                className="border border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-black px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 flex items-center"
                                onClick={() => window.open('https://apps.apple.com/us/app/seeb-desgin/id6747076134', '_blank')}
                            >
                                <Download className="mr-2 h-5 w-5" /> Download iOS
                            </button>
                        </div>

                    </div>
                </div>
            </section>


            {/* Support / Chat Section */}
            <section id="support" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-[#facc15]">
                            Need Help? We're Here.
                        </h2>

                        {/* Centered contact cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center max-w-3xl mx-auto">
                            {[
                                {
                                    icon: <Phone className="h-8 w-8" />,
                                    title: 'Toll-Free',
                                    description: '18005703133',
                                    action: 'Call Now',
                                    url: 'tel:18005703133'
                                },
                                {
                                    icon: <MessageCircle className="h-8 w-8" />,
                                    title: 'WhatsApp',
                                    description: 'Chat Now',
                                    action: 'Start Chat',
                                    url: 'https://wa.me/917709899729'
                                }
                            ].map((option, index) => (
                                <div
                                    key={index}
                                    className="bg-black/40 border border-[#facc15]/20 rounded-2xl p-6 text-center backdrop-blur-sm hover:border-[#facc15]/50 transition-all duration-300 hover:scale-105"
                                >
                                    <div className="text-[#facc15] flex justify-center mb-4">
                                        {option.icon}
                                    </div>
                                    <h3 className="text-white font-semibold text-lg">{option.title}</h3>
                                    <p className="text-gray-300 text-sm mb-4">{option.description}</p>
                                    <a
                                        href={option.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block border border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-black w-full py-2 rounded-md transition-all duration-300 text-center"
                                    >
                                        {option.action}
                                    </a>
                                </div>
                            ))}
                        </div>

                        {/* Address Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    label: 'Factory Address',
                                    address: `S.No. 29/13B, Wadachiwadi Road,\nJakat Naka, Undri,\nPune, Maharashtra - 411060`
                                },
                                {
                                    label: 'Head Office Address',
                                    address: `WTC Tower 2, Floor 2,\nOffice No. 217, Kharadi,\nPune, Maharashtra - 411014`
                                },
                                {
                                    label: 'Experience Center Address',
                                    address: `Royale Heritage Mall, Upper Ground Floor,\n Shop No. 10, NIBM, Undri,\n Pune, Maharashtra 411048`
                                }
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-black/40 border border-[#facc15]/20 rounded-2xl p-6 text-left backdrop-blur-sm hover:border-[#facc15]/50 transition-all duration-300 hover:scale-105"
                                >
                                    <h4 className="text-[#facc15] font-semibold text-lg mb-2">{item.label}</h4>
                                    <p className="text-gray-300 text-sm whitespace-pre-line">{item.address}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-12">
                            <p className="text-gray-400 text-center border-t border-[#facc15]/20 pt-8">
                                © 2024 SEEB DESIGN PVT LTD. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* <button
                onClick={() => setModalOpen(true)}
                className="bg-[#facc15] text-black px-6 py-3 rounded-full font-semibold hover:bg-[#facc15]/90 transition"
            >
                Contact Us
            </button> */}

            <ContactFormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

        </div>
    );
};

export default LandingPage;
