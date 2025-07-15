
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedQuiz from "@/components/FeaturedQuiz";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, ListCheck, Search, BookText } from "lucide-react";
import { Link } from "react-router-dom";

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar showInDashboard={isLoggedIn} />
      <main className="flex-grow pt-20">
        <HeroSection />

        {/* Features Section */}
        <section className="py-10 sm:py-14 container mx-auto px-3 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">Why Choose Examify?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-xl shadow-md border hover:border-primary/50 transition-colors flex flex-col items-center text-center h-full"
              >
                <div className="mb-3 sm:mb-4">{feature.icon}</div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm md:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Quiz Section with horizontal scroll on mobile */}
        <section className="py-10 sm:py-14 container mx-auto px-3 sm:px-6">
          <FeaturedQuiz />
        </section>

        {/* Call to Action Section */}
        <section className="bg-secondary/50 py-10 sm:py-14">
          <div className="container mx-auto px-3 sm:px-6 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">Ready to Test Your Knowledge?</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-7">
              Join thousands of students who use Examify to test their knowledge, prepare for exams, 
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

export default Home;
