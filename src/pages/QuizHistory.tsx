
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Calendar, Clock, Medal } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";

const QuizHistory = () => {
  // Sample history data
  const quizHistory = [
    {
      id: "1",
      title: "Environmental Engineering Basics",
      date: "2025-05-05",
      score: 85,
      totalQuestions: 20,
      timeTaken: "18:24",
      category: "NPTEL"
    },
    {
      id: "2",
      title: "Data Structures and Algorithms",
      date: "2025-05-03",
      score: 72,
      totalQuestions: 25,
      timeTaken: "22:15",
      category: "Computer Science"
    },
    {
      id: "3", 
      title: "Biology 101",
      date: "2025-04-28",
      score: 90,
      totalQuestions: 15,
      timeTaken: "12:45",
      category: "Science"
    },
    {
      id: "4",
      title: "World History Overview",
      date: "2025-04-25",
      score: 65,
      totalQuestions: 30,
      timeTaken: "28:12",
      category: "History"
    }
  ];
  
  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-500 hover:bg-green-600";
    if (score >= 70) return "bg-blue-500 hover:bg-blue-600";
    if (score >= 50) return "bg-yellow-500 hover:bg-yellow-600";
    return "bg-red-500 hover:bg-red-600";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showInDashboard={true} />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link to="/userhub" className="inline-flex items-center text-primary hover:underline mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hub
            </Link>
            
            <h1 className="text-3xl font-bold mb-2">My Quiz History</h1>
            <p className="text-muted-foreground mb-6">Review your past quiz attempts and track your progress</p>
          </div>
          
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Quizzes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{quizHistory.length}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {(quizHistory.reduce((acc, quiz) => acc + quiz.score, 0) / quizHistory.length).toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Best Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-500">
                    {Math.max(...quizHistory.map(quiz => quiz.score))}%
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Completed Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {quizHistory.reduce((acc, quiz) => acc + quiz.totalQuestions, 0)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Recent Quiz Attempts</h2>
          
          <div className="space-y-4">
            {quizHistory.map(quiz => (
              <Card key={quiz.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-grow p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-medium">{quiz.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            {new Date(quiz.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {quiz.timeTaken}
                          </div>
                          <Badge variant="outline">{quiz.category}</Badge>
                        </div>
                      </div>
                      <Badge className={getScoreBadgeColor(quiz.score)}>
                        {quiz.score}%
                      </Badge>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Score</span>
                        <span>{quiz.score}%</span>
                      </div>
                      <Progress value={quiz.score} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {Math.round(quiz.score / 100 * quiz.totalQuestions)} correct out of {quiz.totalQuestions} questions
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col justify-between items-center bg-muted/30 p-4 md:p-6 md:w-[120px] md:shrink-0 md:border-l">
                    <Button variant="outline" size="sm" className="w-full">Review</Button>
                    <div className="md:mt-4 flex flex-col items-center">
                      <Medal className="h-5 w-5 text-yellow-500 md:mb-1" />
                      <span className="text-xs text-muted-foreground">Position #3</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default QuizHistory;
