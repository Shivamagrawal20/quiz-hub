
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import QuizCard from "./QuizCard";

const FeaturedQuiz = () => {
  const featuredQuizzes = [
    {
      id: "1",
      title: "Mathematics Basics",
      description: "Test your knowledge of essential math concepts and operations.",
      questionCount: 15,
      category: "Mathematics",
      difficulty: "easy" as const,
    },
    {
      id: "2",
      title: "World Geography",
      description: "Explore countries, capitals, and geographical features around the globe.",
      questionCount: 20,
      category: "Geography",
      difficulty: "medium" as const,
    },
    {
      id: "3",
      title: "Computer Science",
      description: "Challenge yourself with programming concepts and computer technologies.",
      questionCount: 25,
      category: "Technology",
      difficulty: "hard" as const,
    },
  ];

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Featured Quizzes</h2>
          <p className="text-muted-foreground">
            Start with these popular quizzes or explore our complete collection.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/quiz-section">View All Quizzes</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredQuizzes.map((quiz) => (
          <QuizCard key={quiz.id} {...quiz} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedQuiz;
