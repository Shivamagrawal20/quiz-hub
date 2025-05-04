
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Mock upcoming quizzes - export so it can be used by Dashboard.tsx
export const upcomingQuizzes = [
  { id: "nptel1", title: "Environmental Engineering", date: "2025-05-10", duration: "60 min" },
  { id: "4", title: "Gastroenterology", date: "2025-05-15", duration: "45 min" },
  { id: "5", title: "Emergency Medicine", date: "2025-05-20", duration: "30 min" },
  { id: "6", title: "Dermatology Basics", date: "2025-05-25", duration: "45 min" },
];

export function UpcomingQuizzes() {
  const navigate = useNavigate();
  const [loadingQuizId, setLoadingQuizId] = useState<string | null>(null);
  
  const handleQuizStart = (id: string) => {
    setLoadingQuizId(id);
    // Use setTimeout to show loading state before navigating
    setTimeout(() => {
      navigate(`/quiz/${id}`);
      setLoadingQuizId(null); // Reset loading state in case navigation fails
    }, 800);
  };
  
  const isUpcoming = (date: string) => {
    const quizDate = new Date(date);
    const currentDate = new Date();
    return quizDate > currentDate && quizDate.getTime() - currentDate.getTime() < 3 * 24 * 60 * 60 * 1000;
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Upcoming Quizzes</CardTitle>
        <Badge variant="outline" className="bg-primary/10 text-primary">
          {upcomingQuizzes.length} Quizzes
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {upcomingQuizzes.map((quiz) => (
            <div key={quiz.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              <div>
                <h3 className="font-medium">{quiz.title}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span>
                    {new Date(quiz.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <Badge variant="outline" className={`flex items-center gap-1 ${
                    isUpcoming(quiz.date) ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    <Clock className="h-3 w-3" /> {quiz.duration}
                    {isUpcoming(quiz.date) && <span className="ml-1">Soon</span>}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuizStart(quiz.id)}
                disabled={loadingQuizId === quiz.id}
                className="flex items-center"
              >
                {loadingQuizId === quiz.id ? (
                  <span className="flex items-center">
                    <span className="animate-pulse">Loading...</span>
                  </span>
                ) : (
                  <>
                    Take Quiz
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button variant="outline" className="w-full" onClick={() => navigate('/quizzes')}>
          View All Quizzes
        </Button>
      </CardFooter>
    </Card>
  );
}
