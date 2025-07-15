
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play, LogIn, Target, Zap, Sparkles, Mouse } from "lucide-react";

const stats = [
  {
    icon: <Target className="w-7 h-7 text-blue-500" />,
    value: "10K+",
    label: "Active Users",
  },
  {
    icon: <Zap className="w-7 h-7 text-indigo-500" />,
    value: "500+",
    label: "Quizzes",
  },
  {
    icon: <Sparkles className="w-7 h-7 text-green-500" />,
    value: "95%",
    label: "Success Rate",
  },
];

const HeroSection = () => {
  // Preloader state
  const [loading, setLoading] = useState(true);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  // Hero content refs
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Animate preloader progress bar
    gsap.to(progressBarRef.current, {
      width: "100%",
      duration: 2,
      ease: "power2.out",
      onComplete: () => {
        // Fade and scale out preloader
        gsap.to(preloaderRef.current, {
          opacity: 0,
          scale: 0.9,
          duration: 1,
          onComplete: () => {
            setLoading(false);
          },
        });
      },
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      // Animate hero content in
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 60, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power2.out" }
      );
      gsap.fromTo(
        subRef.current,
        { opacity: 0, y: 40, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, delay: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, delay: 0.6, ease: "power2.out" }
      );
      // Dribble/bounce animation for CTA buttons
      gsap.to('.cta-dribble', {
        y: -8,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        ease: 'sine.inOut',
        delay: 1.5,
      });
      gsap.fromTo(
        statsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 1, ease: "power2.out" }
      );
      gsap.fromTo(
        scrollRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, delay: 1.3, ease: "power2.out" }
      );
      // Animate orbs floating
      orbRefs.current.forEach((el, i) => {
        if (el) {
          gsap.to(el, {
            y: 30 * (i % 2 === 0 ? 1 : -1),
            x: 20 * (i % 2 === 0 ? 1 : -1),
            repeat: -1,
            yoyo: true,
            duration: 3 + i,
            ease: "sine.inOut",
          });
        }
      });
    }
  }, [loading]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-gray-100 to-gray-200">
      {/* Subtle grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{backgroundImage: "linear-gradient(rgba(120,120,180,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(120,120,180,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px"}} />
      {/* Animated subtle orbs */}
      {[0,1,2].map((_, i) => (
        <div
          key={i}
          ref={el => (orbRefs.current[i] = el)}
          className={`absolute rounded-full blur-2xl opacity-20 z-0`}
          style={{
            width: 180,
            height: 180,
            top: i === 0 ? "10%" : i === 1 ? "60%" : "30%",
            left: i === 0 ? "70%" : i === 1 ? "15%" : "50%",
            background: i === 0 ? "#7b6cf6" : i === 1 ? "#4fd1fa" : "#a5b4fc",
            filter: "blur(40px)",
          }}
        />
      ))}
      {/* Preloader Overlay */}
      {loading && (
        <div
          ref={preloaderRef}
          className="preloader fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
          style={{ transition: "opacity 1s, transform 1s" }}
        >
          <div className="text-5xl font-extrabold text-gray-700 mb-8 animate-pulse">
            Examify
          </div>
          <div className="w-64 h-2 bg-gray-200 rounded overflow-hidden">
            <div
              ref={progressBarRef}
              className="progress-bar h-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: 0 }}
            />
          </div>
        </div>
      )}
      {/* Main Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full pt-32 pb-12"
        style={{ filter: loading ? "blur(10px)" : "none", opacity: loading ? 0 : 1, transition: "opacity 0.5s, filter 0.5s" }}>
        {/* Headline */}
        <h1 ref={headlineRef} className="text-center font-extrabold text-5xl md:text-6xl lg:text-7xl mb-2 text-gray-800">
          <span className="block">Welcome to</span>
          <span className="block text-6xl md:text-7xl lg:text-8xl mt-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Examify</span>
        </h1>
        {/* Subheadline */}
        <p ref={subRef} className="mt-6 text-lg md:text-2xl text-gray-600 max-w-2xl text-center">
          Where Learning Meets the Future. Sharpen your skills, test your limits, and unlock your potential in our immersive quiz universe.
        </p>
        {/* CTA Buttons */}
        <div ref={ctaRef} className="mt-10 flex gap-6 flex-wrap justify-center">
          <Link to="/quiz-section">
            <Button size="lg" className="cta-dribble flex items-center gap-2 px-8 py-3 text-lg bg-blue-600 text-white shadow hover:bg-purple-600 transition-colors">
              <Play className="w-5 h-5" /> Start Quiz
            </Button>
          </Link>
          <Link to="/signin">
            <Button variant="outline" size="lg" className="cta-dribble flex items-center gap-2 px-8 py-3 text-lg border-blue-400 text-blue-700 hover:bg-purple-50 transition-colors">
              Sign In <LogIn className="w-5 h-5" />
            </Button>
          </Link>
        </div>
        {/* Stats Cards */}
        <div ref={statsRef} className="mt-16 flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center items-center">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center bg-white border border-gray-200 rounded-2xl px-10 py-8 min-w-[200px] shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            >
              <div className="mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-blue-700 mb-1">{stat.value}</div>
              <div className="text-gray-500 text-base">{stat.label}</div>
            </div>
          ))}
        </div>
        {/* Scroll Indicator */}
        <div ref={scrollRef} className="mt-12 flex flex-col items-center animate-bounce opacity-80">
          <Mouse className="w-7 h-7 text-blue-400 mb-1" />
          <div className="w-1 h-6 bg-blue-400 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
