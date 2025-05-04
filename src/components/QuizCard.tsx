
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListCheck, LoaderCircle, Clock, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

interface QuizCardProps {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  completionRate?: number;
}

const difficultyColors = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800"
};

const QuizCard = ({ 
  id, 
  title, 
  description, 
  questionCount, 
  category, 
  difficulty,
  completionRate
}: QuizCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const handleStartQuiz = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/quiz/${id}`);
    }, 800);
  };
  
  return (
    <Card 
      className={`quiz-card-hover overflow-hidden h-full flex flex-col transition-all duration-300 ${
        isHovered ? "shadow-lg translate-y-[-8px]" : "hover:shadow-md hover:translate-y-[-4px]"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
        
        {completionRate !== undefined && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Completion rate</span>
              <span className="text-xs font-medium">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-1.5" />
          </div>
        )}
        
        <Badge variant="outline" className="mt-3">
          {category}
        </Badge>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button 
          className="w-full relative" 
          onClick={handleStartQuiz}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Loading Quiz...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Take Quiz
              <TrendingUp className={`h-4 w-4 transition-transform ${isHovered ? "translate-x-1" : ""}`} />
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
