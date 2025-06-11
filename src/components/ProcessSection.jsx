
const processSteps = [
  {
    icon: <img src="/Scan-Room.png" alt="Step 1 Icon" className="w-full h-32 mb-2 object-contain" />,
    title: "Step 1: Scan Your Room",
    description: "Use your phone’s LiDAR or upload a floor plan. Seeb auto-detects walls, windows, and measurements. No scanner? Just enter dimensions manually."
  },
  {
    icon: <img src="/Chose-Your-Style.png" alt="Step 2 Icon" className="w-full h-32 mb-2 object-contain" />,
    title: "Step 2: Choose Your Style",
    description: "Pick from 100+ styles like Modern, Boho, Royal, etc. Define furniture, color palette, and materials to reflect your personality."
  },
  {
    icon: <img src="/AI-genrate-design.png" alt="Step 3 Icon" className="w-full h-32 mb-2 object-contain" />,
    title: "Step 3: AI Designs Your Space",
    description: "Seeb’s AI creates 2 photorealistic 3D views per room with full wall and element-wise control to mix-match styles consistently."
  },
  {
    icon: <img src="/review-edit.png" alt="Step 4 Icon" className="w-full h-32 mb-2 object-contain" />,
    title: "Step 4: Review + Edit Elements",
    description: "Tweak individual elements — from beds to curtains — right from the Seeb app. Customize sizes, materials, and styles easily."
  },
  {
    icon: <img src="/Book-team.png" alt="Step 5 Icon" className="w-full h-32 mb-2 object-contain" />,
    title: "Step 5: Book Skilled Execution Team",
    description: "Once you finalize your design, book our verified team for precise factory-finish + on-site services like wall paneling, furniture, and lighting."
  },
  {
    icon: <img src="/Live-Project.png" alt="Step 6 Icon" className="w-full h-32 mb-2 object-contain" />,
    title: "Step 6: Live Project Tracker",
    description: "Track execution progress, team visits, payment milestones, and delivery timelines — all from your phone."
  },
  {
    icon: <img src="/Dream-home.png" alt="Step 7 Icon" className="w-full h-32 mb-2 object-contain" />,
    title: "Step 7: Enjoy Your Dream Space",
    description: "Step into your beautifully transformed space with factory-quality finish and a 10-year warranty on all furniture."
  },
];

export function OurProcess() {
  return (
    <section className="py-14 px-4 sm:px-6 md:px-12 lg:px-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
          Step-by-Step Process
        </h2>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
          India’s first <span className="font-semibold text-blue-600">AI-powered interior execution platform</span> — combining factory-finish precision with on-site expert services.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 mx-auto">
        {processSteps.map((step, index) => (
          <div
            key={index}
            className="w-full sm:w-[300px]  text-center bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow"           
          >
            <div className="mb-4 flex justify-center">{step.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>


    </section>
  );
}

export default OurProcess;
