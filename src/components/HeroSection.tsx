
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-b from-secondary/30 to-background pt-24 pb-16">
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Learn and Test Your Knowledge with{" "}
            <span className="gradient-text">QuizHub</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Engage with interactive quizzes designed to help you master any subject.
            Perfect for students of all levels.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link to="/quiz-section">Start Quizzing</Link>
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-400/20 rounded-3xl blur-2xl" />
            <div className="relative bg-white p-6 rounded-2xl shadow-lg">
              <div className="bg-primary/10 p-4 rounded-xl mb-4">
                <h3 className="font-semibold text-lg mb-2">Sample Quiz Question</h3>
                <p className="text-muted-foreground">What is the capital of France?</p>
                <div className="mt-3 space-y-2">
                  <div className="p-2 border rounded-lg hover:bg-primary/5 cursor-pointer transition-colors">
                    A) London
                  </div>
                  <div className="p-2 border rounded-lg bg-primary text-white cursor-pointer">
                    B) Paris
                  </div>
                  <div className="p-2 border rounded-lg hover:bg-primary/5 cursor-pointer transition-colors">
                    C) Berlin
                  </div>
                  <div className="p-2 border rounded-lg hover:bg-primary/5 cursor-pointer transition-colors">
                    D) Madrid
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Question 1 of 10</p>
                </div>
                <Button size="sm">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default HeroSection;
