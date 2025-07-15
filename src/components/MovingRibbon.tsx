import React from "react";

const MovingRibbon = () => (
  <div className="relative w-full overflow-hidden bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 py-2">
    <div className="animate-ribbon whitespace-nowrap text-white font-semibold text-base px-4">
      🚀 Join the learners — Unlock your potential with Examify! 🎓
    </div>
    <style>{`
      @keyframes ribbon {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
      .animate-ribbon {
        display: inline-block;
        min-width: 100vw;
        animation: ribbon 18s linear infinite;
      }
    `}</style>
  </div>
);

export default MovingRibbon; 