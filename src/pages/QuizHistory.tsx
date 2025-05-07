
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";

const QuizHistory = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const features = [
    "Complete history of all quizzes you've taken",
    "Detailed analysis of your performance over time",
    "Visual charts showing progress by subject",
    "Review incorrect answers with explanations",
    "Compare your results with class averages"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showInDashboard />
      
      <main className="flex-grow pt-20">
        <div className="container px-4 py-6">
          <h1 className="text-3xl font-bold mb-6">Quiz History</h1>
          
          <ComingSoon 
            title="Quiz History"
            subtitle="Track your performance and progress"
            features={features}
            buttonText="Coming Soon"
            bgColor="from-amber-500 to-amber-600"
            textColor="text-amber-500"
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default QuizHistory;
