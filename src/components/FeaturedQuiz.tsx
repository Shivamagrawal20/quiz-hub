
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import QuizCard from "./QuizCard";
import gsap from "gsap";

const FeaturedQuiz = () => {
  const featuredQuizzes = [
    {
      id: "nptel1",
      title: "Introduction to Environmental Engineering and Science",
      description: "Learn about fundamental and sustainability concepts in environmental engineering.",
      questionCount: 30,
      category: "NPTEL",
      difficulty: "medium" as const,
    },
  ];

  // Animation refs
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (cardRefs.current.length > 0) {
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 40, scale: 0.95, rotateZ: 3 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateZ: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power2.out",
        }
      );
    }
  }, []);

  // 3D tilt effect handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, idx: number) => {
    const card = cardRefs.current[idx];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 8; // max 8deg
    const rotateY = ((x - centerX) / centerX) * -8;
    gsap.to(card, {
      scale: 1.04,
      boxShadow: "0 8px 32px 0 rgba(80,80,255,0.15), 0 0 16px 2px #6366f1",
      rotateX,
      rotateY,
      duration: 0.3,
      ease: "power2.out",
    });
  };
  const handleMouseLeave = (idx: number) => {
    const card = cardRefs.current[idx];
    if (!card) return;
    gsap.to(card, {
      scale: 1,
      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.06)",
      rotateX: 0,
      rotateY: 0,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  return (
    <section className="relative py-16 w-screen left-1/2 right-1/2 -translate-x-1/2 flex flex-col items-center justify-center bg-gradient-to-b from-white via-gray-100 to-gray-200 overflow-hidden">
      {/* Subtle grid background overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{backgroundImage: "linear-gradient(rgba(120,120,180,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(120,120,180,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px"}} />
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center">
        <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
          Featured <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Quizzes</span>
        </h2>
        <p className="text-center text-lg md:text-xl text-blue-700 max-w-2xl mb-6">
          Start with these popular quizzes or explore our complete collection.
        </p>
        <Button
          asChild
          variant="outline"
          className="transition-transform duration-200 hover:scale-105 hover:shadow-lg animate-pulse-on-hover mb-10"
        >
          <Link to="/quizzes">View All Quizzes</Link>
        </Button>
        <div className="flex justify-center items-center w-full">
          {featuredQuizzes.map((quiz, idx) => (
            <div
              key={quiz.id}
              className="w-full max-w-md cursor-pointer"
              ref={el => (cardRefs.current[idx] = el)}
              style={{ opacity: 0, boxShadow: "0 2px 8px 0 rgba(0,0,0,0.06)", willChange: "transform" }}
              onMouseMove={e => handleMouseMove(e, idx)}
              onMouseLeave={() => handleMouseLeave(idx)}
            >
              <QuizCard {...quiz} />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .animate-pulse-on-hover:hover {
          animation: pulseBtn 0.7s;
        }
        @keyframes pulseBtn {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
      `}</style>
    </section>
  );
};

export default FeaturedQuiz;
