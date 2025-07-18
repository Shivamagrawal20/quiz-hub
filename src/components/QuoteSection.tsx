import { useRef } from "react";
import { useScrollOpacity } from "@/hooks/useScrollOpacity";

const quote = "Learning isn’t about knowing all the answers — it’s about asking the right questions. Examify makes every question count.";

const QuoteSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const opacity = useScrollOpacity(sectionRef);
  const words = quote.split(" ");
  const stagger = 0.04;

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex justify-center items-center px-0 -mt-24"
      style={{ minHeight: 400 }}
    >
      {/* SVG Slanted Background */}
      <svg
        viewBox="0 0 1920 400"
        width="100%"
        height="400"
        preserveAspectRatio="none"
        className="absolute left-0 top-0 w-full h-full"
        style={{ zIndex: 1, filter: "drop-shadow(0 8px 32px rgba(31,41,55,0.18))" }}
      >
        <polygon
          points="0,80 1920,0 1920,360 0,320"
          fill="#0f172a"
        />
      </svg>
      {/* Quote Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center" style={{ minHeight: 400 }}>
        <div className="max-w-4xl mx-auto px-4 py-24">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight flex flex-wrap justify-center gap-x-2 gap-y-2 text-center">
            {words.map((word, i) => {
              const wordOpacity = Math.max(
                0,
                Math.min(1, (opacity - i * stagger) / (1 - (words.length - 1) * stagger))
              );
              return (
                <span
                  key={i}
                  style={{
                    color: `rgba(255,255,255,${wordOpacity})`,
                    transition: "color 0.3s",
                    display: "inline-block",
                    whiteSpace: "pre",
                  }}
                >
                  {word + " "}
                </span>
              );
            })}
          </h2>
          <p
            className="mt-6 text-lg text-center"
            style={{
              color: `rgba(203,213,225,${opacity})`,
              transition: "color 0.3s",
            }}
          >
            — Examify Team
          </p>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection; 