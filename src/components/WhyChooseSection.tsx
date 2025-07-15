import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Brain, Trophy, Zap, Users, ListChecks, FileText, Search } from "lucide-react";

const features = [
  {
    icon: <Brain className="w-8 h-8 text-blue-600" />, bg: "from-blue-100 to-blue-200", title: "AI-Powered Learning", desc: "Adaptive quizzes that learn from your performance and adjust difficulty in real-time.",
  },
  {
    icon: <Trophy className="w-8 h-8 text-purple-600" />, bg: "from-purple-100 to-purple-200", title: "Gamified Experience", desc: "Earn badges, climb leaderboards, and unlock achievements as you progress.",
  },
  {
    icon: <Zap className="w-8 h-8 text-indigo-500" />, bg: "from-indigo-100 to-indigo-200", title: "Real-time Results", desc: "Instant feedback and detailed analytics to track your learning journey.",
  },
  {
    icon: <Users className="w-8 h-8 text-cyan-600" />, bg: "from-cyan-100 to-cyan-200", title: "Collaborative Learning", desc: "Join study groups, compete with friends, and learn together.",
  },
];

const neonFeatures = [
  {
    icon: <ListChecks className="w-8 h-8 text-purple-500" />,
    title: "Interactive Quizzes",
    desc: "Engage with our interactive quizzes designed to test and expand your knowledge in various subjects.",
  },
  {
    icon: <FileText className="w-8 h-8 text-purple-500" />,
    title: "Comprehensive Topics",
    desc: "Access quizzes covering a wide range of academic subjects and topics for all educational levels.",
  },
  {
    icon: <Search className="w-8 h-8 text-purple-500" />,
    title: "Progress Tracking",
    desc: "Track your quiz performance and learning progress over time with detailed analytics.",
  },
];

const neonGlow = "0 0 16px 2px #a78bfa, 0 0 32px 4px #7b6cf6";

const WhyChooseSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visible && sectionRef.current) {
      gsap.to(sectionRef.current, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });
      gsap.to(".feature-card", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.2,
      });
    }
  }, [visible]);

  return (
    <div
      ref={sectionRef}
      className="relative z-10 w-full flex flex-col items-center justify-center py-24 px-4 bg-gradient-to-b from-white via-blue-50 to-purple-50"
      style={{ opacity: 0, transform: "translateY(40px)", transition: "opacity 0.5s, transform 0.5s" }}
    >
      {/* Subtle grid background overlay (theme-matching) */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{backgroundImage: "linear-gradient(rgba(120,120,180,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(120,120,180,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px"}} />
      {/* Headline */}
      <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
        Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Examify?</span>
      </h2>
      {/* Subheadline */}
      <p className="text-center text-lg md:text-xl text-blue-700 max-w-2xl mb-14">
        Experience the future of online learning with cutting-edge technology and innovative features designed for modern learners.
      </p>
      {/* Features Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-8">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`feature-card flex flex-col md:flex-row items-start gap-5 bg-white border border-blue-100 rounded-2xl px-8 py-7 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer opacity-0 translate-y-8`}
            style={{ transition: "opacity 0.5s, transform 0.5s" }}
          >
            <div className={`flex items-center justify-center rounded-xl bg-gradient-to-br ${f.bg} w-14 h-14 shadow-md`}>
              {f.icon}
            </div>
            <div>
              <div className="text-xl font-bold text-blue-900 mb-1">{f.title}</div>
              <div className="text-blue-700 text-base max-w-xs">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Neon Glow Features Grid (3 in a row) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {neonFeatures.map((f, i) => (
          <div
            key={f.title}
            className="feature-card flex flex-col items-center bg-white border border-blue-100 rounded-2xl px-8 py-7 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer opacity-0 translate-y-8 text-center"
            style={{
              transition: "opacity 0.5s, transform 0.5s, box-shadow 0.4s",
              boxShadow: hovered === i ? neonGlow : undefined,
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 w-14 h-14 shadow-md mb-3">
              {f.icon}
            </div>
            <div>
              <div className="text-xl font-bold text-blue-900 mb-1">{f.title}</div>
              <div className="text-blue-700 text-base max-w-xs">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseSection; 