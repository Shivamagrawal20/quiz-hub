const SlantedRibbon = () => (
  <div className="relative w-full overflow-hidden" style={{ zIndex: 2 }}>
    <svg
      viewBox="0 0 1920 160"
      width="100%"
      height="160"
      preserveAspectRatio="none"
      className="block"
      style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
    >
      <polygon
        points="0,0 1920,40 1920,160 0,120"
        fill="url(#ribbon-gradient)"
        filter="url(#ribbon-shadow)"
      />
      <defs>
        <linearGradient id="ribbon-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <filter id="ribbon-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#6366f1" floodOpacity="0.18" />
        </filter>
      </defs>
    </svg>
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ zIndex: 2, height: "160px" }}
    >
      <span className="text-white font-extrabold text-2xl md:text-4xl text-center drop-shadow-lg px-4">
        🚀 Join the learners — Unlock your potential with Examify! 🎓
      </span>
    </div>
  </div>
);

export default SlantedRibbon; 