
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BookOpen, 
  BarChart3,
  ChevronRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useScrollToTop } from "@/hooks/useScrollToTop";

// Mock user data
const userData = {
  name: "John Doe",
  completedQuizzes: 12,
  totalQuizzes: 26,
  upcomingQuiz: "Cardiology Quiz",
};

// Mock quiz attempts
const quizAttempts = [
  { 
    id: "1", 
    title: "Medical Ethics", 
    score: 85, 
    date: "2025-04-28", 
    status: "completed", 
    correctAnswers: 17,
    totalQuestions: 20
  },
  { 
    id: "2", 
    title: "Cardiology", 
    score: 76, 
    date: "2025-04-25", 
    status: "completed", 
    correctAnswers: 19,
    totalQuestions: 25
  },
  { 
    id: "3", 
    title: "Neurology", 
    score: 92, 
    date: "2025-04-20", 
    status: "completed", 
    correctAnswers: 23,
    totalQuestions: 25
  },
];

// Mock upcoming quizzes
const upcomingQuizzes = [
  { id: "nptel1", title: "Environmental Engineering", date: "2025-05-10", duration: "60 min" },
  { id: "4", title: "Gastroenterology", date: "2025-05-15", duration: "45 min" },
];

const Dashboard = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const [activeQuizTab, setActiveQuizTab] = useState<"completed" | "upcoming">("completed");
  
  const handleQuizStart = (id: string) => {
    navigate(`/quiz/${id}`);
  };
  
  const progressPercentage = (userData.completedQuizzes / userData.totalQuizzes) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <div className="pt-20 flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Your Exam Dashboard</h1>
          
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Progress</h3>
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold mt-2">{userData.completedQuizzes} / {userData.totalQuizzes}</p>
              <p className="text-sm text-muted-foreground mb-3">Quizzes completed</p>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Average Score</h3>
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold mt-2">
                {quizAttempts.reduce((acc, quiz) => acc + quiz.score, 0) / quizAttempts.length}%
              </p>
              <p className="text-sm text-muted-foreground">Across all quizzes</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Next Quiz</h3>
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold mt-2">{upcomingQuizzes[0]?.title || "No upcoming quizzes"}</p>
              <p className="text-sm text-muted-foreground">
                {upcomingQuizzes[0] ? `Scheduled for ${new Date(upcomingQuizzes[0].date).toLocaleDateString()}` : ""}
              </p>
            </div>
          </div>
          
          {/* Quiz History Section */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="border-b">
              <div className="flex">
                <button 
                  onClick={() => setActiveQuizTab("completed")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeQuizTab === "completed" 
                      ? "border-b-2 border-primary text-primary" 
                      : "text-muted-foreground"
                  }`}
                >
                  Completed Quizzes
                </button>
                <button 
                  onClick={() => setActiveQuizTab("upcoming")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeQuizTab === "upcoming" 
                      ? "border-b-2 border-primary text-primary" 
                      : "text-muted-foreground"
                  }`}
                >
                  Upcoming Quizzes
                </button>
              </div>
            </div>
            
            {activeQuizTab === "completed" ? (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Quiz History</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quiz Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quizAttempts.map((quiz) => (
                      <TableRow key={quiz.id}>
                        <TableCell className="font-medium">{quiz.title}</TableCell>
                        <TableCell>{new Date(quiz.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold">{quiz.score}%</span>
                            <span className="text-xs text-muted-foreground">
                              {quiz.correctAnswers}/{quiz.totalQuestions} correct
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleQuizStart(quiz.id)}>
                            Retake
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Upcoming Quizzes</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quiz Name</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingQuizzes.map((quiz) => (
                      <TableRow key={quiz.id}>
                        <TableCell className="font-medium">{quiz.title}</TableCell>
                        <TableCell>{new Date(quiz.date).toLocaleDateString()}</TableCell>
                        <TableCell>{quiz.duration}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            <Clock className="mr-1 h-3 w-3" /> Upcoming
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleQuizStart(quiz.id)}
                          >
                            Take Quiz
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
