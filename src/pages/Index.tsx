
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedQuiz from "@/components/FeaturedQuiz";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookText, Search, ListCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose QuizHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-md border hover:border-primary/50 transition-colors"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        <FeaturedQuiz />
        
        <section className="bg-secondary/50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Test Your Knowledge?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of students who use QuizHub to test their knowledge, prepare for exams, 
              and enhance their learning experience.
            </p>
            <Button asChild size="lg">
              <Link to="/quiz-section">
                Explore All Quizzes <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
