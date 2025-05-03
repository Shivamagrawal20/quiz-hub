
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListCheck, LoaderCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface QuizCardProps {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

const difficultyColors = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800"
};

const QuizCard = ({ id, title, description, questionCount, category, difficulty }: QuizCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleStartQuiz = () => {
    setIsLoading(true);
  };
  
  return (
    <Card className="quiz-card-hover overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-md hover:translate-y-[-4px]">
      <div className={`h-2 w-full ${difficulty === "easy" ? "bg-green-400" : difficulty === "medium" ? "bg-yellow-400" : "bg-red-400"}`} />
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{title}</CardTitle>
          <Badge className={difficultyColors[difficulty]} variant="outline">
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ListCheck size={16} />
          <span>{questionCount} questions</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground mt-2">
          <Clock size={16} />
          <span>Estimated time: {Math.round(questionCount * 1.5)} min</span>
        </div>
        <Badge variant="outline" className="mt-3">
          {category}
        </Badge>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button 
          className="w-full relative" 
          asChild
          onClick={handleStartQuiz}
          disabled={isLoading}
        >
          <Link to={`/quiz/${id}`}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Loading Quiz...
              </span>
            ) : (
              "Take Quiz"
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
