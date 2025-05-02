
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListCheck } from "lucide-react";

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
  return (
    <Card className="quiz-card-hover overflow-hidden h-full flex flex-col">
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
        <Badge variant="outline" className="mt-3">
          {category}
        </Badge>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button className="w-full">Take Quiz</Button>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
