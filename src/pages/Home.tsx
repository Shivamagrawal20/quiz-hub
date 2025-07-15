
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import QuoteSection from "@/components/QuoteSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import FeaturedQuiz from "@/components/FeaturedQuiz";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, ListCheck, Search, BookText, Target, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import SlantedRibbon from "@/components/SlantedRibbon";
import WaveDivider from "@/components/WaveDivider";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import confetti from "canvas-confetti";

const Home = () => {
  const { isLoggedIn } = useAuth();
  const features = [
    {
      icon: <ListCheck className="h-10 w-10 text-primary" />,
      title: "Interactive Quizzes",
      description:
        "Engage with our interactive quizzes designed to test and expand your knowledge in various subjects.",
    },
    {
      icon: <BookText className="h-10 w-10 text-primary" />,
      title: "Comprehensive Topics",
      description:
        "Access quizzes covering a wide range of academic subjects and topics for all educational levels.",
    },
    {
      icon: <Search className="h-10 w-10 text-primary" />,
      title: "Progress Tracking",
      description:
        "Track your quiz performance and learning progress over time with detailed analytics.",
    },
  ];

  const ctaCardRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const getStartedBtnRef = useRef(null);
  const learnMoreBtnRef = useRef(null);
  const clockIconRef = useRef(null);

  useEffect(() => {
    // Card entrance
    if (ctaCardRef.current) {
      gsap.fromTo(
        ctaCardRef.current,
        { opacity: 0, y: 60, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" }
      );
      // Floating effect
      gsap.to(ctaCardRef.current, {
        y: "+=12",
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: "sine.inOut",
      });
    }
    // Headline and subheadline
    if (headlineRef.current) {
      gsap.fromTo(headlineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2 });
    }
    if (subRef.current) {
      gsap.fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.4 });
    }
  }, []);

  // --- Card Glow on Hover ---
  const handleCardHover = () => {
    if (ctaCardRef.current) {
      gsap.to(ctaCardRef.current, {
        boxShadow: "0 0 48px 8px #7b6cf6cc, 0 0 0 6px #a5b4fc55",
        scale: 1.025,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };
  const handleCardLeave = () => {
    if (ctaCardRef.current) {
      gsap.to(ctaCardRef.current, {
        boxShadow: "0 0 32px 0 #4fd1fa33, 0 0 48px 8px #7b6cf633, 0 0 0 4px #e0e7ef",
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  // --- Button Gradient Animation & Ripple ---
  const handleBtnHover = (e) => {
    const btn = e.currentTarget;
    // Animate gradient (for Get Started)
    if (btn.classList.contains("cta-btn-gradient")) {
      gsap.to(btn, { backgroundPosition: "100% 0", duration: 0.6, ease: "power2.out" });
    }
    // Icon animation (spin)
    if (btn.querySelector(".inline-flex")) {
      gsap.to(btn.querySelector(".inline-flex"), { rotate: 20, scale: 1.15, duration: 0.3, ease: "power2.out" });
    }
  };
  const handleBtnLeave = (e) => {
    const btn = e.currentTarget;
    // Reset gradient
    if (btn.classList.contains("cta-btn-gradient")) {
      gsap.to(btn, { backgroundPosition: "0 0", duration: 0.6, ease: "power2.out" });
    }
    // Reset icon
    if (btn.querySelector(".inline-flex")) {
      gsap.to(btn.querySelector(".inline-flex"), { rotate: 0, scale: 1, duration: 0.3, ease: "power2.out" });
    }
  };

  // --- Ripple Effect ---
  const createRipple = (event) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.className = "ripple";
    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  };

  // --- Confetti on Get Started ---
  const handleGetStartedClick = (e) => {
    createRipple(e);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#4fd1fa", "#7b6cf6", "#a5b4fc", "#6366f1"],
    });
  };

  // --- Add ripple to Learn More button ---
  useEffect(() => {
    const btn = learnMoreBtnRef.current;
    if (btn) {
      btn.addEventListener("click", createRipple);
      return () => btn.removeEventListener("click", createRipple);
    }
  }, []);

  // --- Ripple CSS ---
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900" style={{ colorScheme: 'light' }}>
      <Navbar showInDashboard={isLoggedIn} />
      <main className="flex-grow pt-20">
        <HeroSection />
        <QuoteSection />
        <SlantedRibbon />
        <div className="-mt-32">
          <WhyChooseSection />
        </div>
        <WaveDivider />
        <FeaturedQuiz />
        <SlantedRibbon />
        {/* Call to Action Section - Neon Glow Card */}
        <section className="w-full flex justify-center items-center min-h-[60vh] py-8 md:py-16 bg-transparent">
          <div
            ref={ctaCardRef}
            className="relative bg-white rounded-3xl shadow-xl px-4 py-8 md:px-8 md:py-12 w-full max-w-lg sm:max-w-xl md:max-w-3xl flex flex-col items-center border border-transparent mx-auto cta-card"
            style={{boxShadow: "0 0 32px 0 #4fd1fa33, 0 0 48px 8px #7b6cf633, 0 0 0 4px #e0e7ef"}}
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <div className="flex justify-center w-full mb-4">
              <Target className="w-10 h-10 md:w-14 md:h-14 text-cyan-500" />
            </div>
            <h2 ref={headlineRef} className="text-2xl md:text-4xl font-extrabold text-gray-900 text-center mb-4">Ready to Start Your Journey?</h2>
            <p ref={subRef} className="text-base md:text-lg text-gray-600 text-center mb-8 md:mb-10 max-w-xs sm:max-w-md md:max-w-2xl">Join thousands of learners who are already mastering their skills with Examify.</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 w-full justify-center">
              <Button
                ref={getStartedBtnRef}
                size="lg"
                className="w-full sm:flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 text-white text-base md:text-lg font-semibold py-5 md:py-6 rounded-xl flex items-center justify-center gap-3 shadow-lg cta-btn-gradient relative overflow-hidden"
                onClick={handleGetStartedClick}
                onMouseEnter={handleBtnHover}
                onMouseLeave={handleBtnLeave}
              >
                <span ref={clockIconRef} className="inline-flex items-center"><Clock className="w-6 h-6" /></span> Get Started
              </Button>
              <Button
                ref={learnMoreBtnRef}
                size="lg"
                variant="outline"
                className="w-full sm:flex-1 bg-[#23262b] text-white text-base md:text-lg font-semibold py-5 md:py-6 rounded-xl border border-gray-600 hover:bg-gray-800 transition-colors relative overflow-hidden cta-btn-outline"
                onMouseEnter={handleBtnHover}
                onMouseLeave={handleBtnLeave}
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <style>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          background: rgba(255,255,255,0.5);
          pointer-events: none;
          z-index: 10;
        }
        @keyframes ripple {
          to {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
