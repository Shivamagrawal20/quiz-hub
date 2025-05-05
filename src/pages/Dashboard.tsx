
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  ChevronRight,
  Home,
  BookOpen as Book,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { PerformanceDashboard } from "@/components/dashboard/PerformanceDashboard";
import { UserSettings } from "@/components/dashboard/UserSettings";
import { HelpCenter } from "@/components/dashboard/HelpCenter";
import { UpcomingQuizzes } from "@/components/dashboard/UpcomingQuizzes";

// Import the upcomingQuizzes mock data from the same file as UpcomingQuizzes
import { upcomingQuizzes } from "@/components/dashboard/UpcomingQuizzes";

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

// Dashboard views
type DashboardView = "home" | "performance" | "settings" | "help";

interface DashboardContentProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
}

const DashboardContent = ({ activeView, setActiveView }: DashboardContentProps) => {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const [activeQuizTab, setActiveQuizTab] = useState<"completed" | "upcoming">("completed");
  
  const handleQuizStart = (id: string) => {
    navigate(`/quiz/${id}`);
  };
  
  const progressPercentage = (userData.completedQuizzes / userData.totalQuizzes) * 100;

  // Render different views based on active view
  const renderActiveView = () => {
    switch (activeView) {
      case "performance":
        return <PerformanceDashboard />;
      case "settings":
        return <UserSettings />;
      case "help":
        return <HelpCenter />;
      default:
        return (
          <>
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
                <p className="text-3xl font-bold mt-2 truncate">
                  {Math.round(quizAttempts.reduce((acc, quiz) => acc + quiz.score, 0) / quizAttempts.length)}%
                </p>
                <p className="text-sm text-muted-foreground">Across all quizzes</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Next Quiz</h3>
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold mt-2 truncate">{userData.upcomingQuiz || "No upcoming quizzes"}</p>
                <p className="text-sm text-muted-foreground">
                  Ready to attempt
                </p>
              </div>
            </div>
            
            {/* Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
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
                      <div className="overflow-x-auto">
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
                    </div>
                  ) : (
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-4">Upcoming Quizzes</h2>
                      <div className="overflow-x-auto">
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
                    </div>
                  )}
                </div>
              </div>
              
              {/* Upcoming quizzes sidebar */}
              <div>
                <UpcomingQuizzes />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Exam Dashboard</h1>
        {isMobile && (
          <div className="flex gap-2">
            {activeView !== "home" && (
              <Button variant="outline" size="sm" onClick={() => setActiveView("home")}>
                Back to Dashboard
              </Button>
            )}
          </div>
        )}
      </div>
      
      {renderActiveView()}
    </div>
  );
};

const Dashboard = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState<string>("dashboard");
  const [activeView, setActiveView] = useState<DashboardView>("home");

  const handleNavClick = (nav: string) => {
    switch(nav) {
      case "dashboard":
        setActiveNav("dashboard");
        setActiveView("home");
        break;
      case "quizzes":
        navigate('/quizzes');
        break;
      case "performance":
        setActiveNav("performance");
        setActiveView("performance");
        break;
      case "settings":
        setActiveNav("settings");
        setActiveView("settings");
        break;
      case "help":
        setActiveNav("help");
        setActiveView("help");
        break;
      case "logout":
        navigate('/');
        break;
      default:
        setActiveNav("dashboard");
        setActiveView("home");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider defaultOpen={true}>
        <div className="flex flex-grow w-full">
          <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader className="h-14 flex items-center px-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-xl">Q</span>
                </div>
                <span className="font-bold text-lg">QuizHub</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Dashboard" 
                    isActive={activeNav === "dashboard"}
                    onClick={() => handleNavClick("dashboard")}
                  >
                    <Home className="mr-2 h-5 w-5" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Quizzes" 
                    isActive={activeNav === "quizzes"}
                    onClick={() => handleNavClick("quizzes")}
                  >
                    <Book className="mr-2 h-5 w-5" />
                    <span>Quizzes</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Performance" 
                    isActive={activeNav === "performance"}
                    onClick={() => handleNavClick("performance")}
                  >
                    <BarChart2 className="mr-2 h-5 w-5" />
                    <span>Performance</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Settings" 
                    isActive={activeNav === "settings"}
                    onClick={() => handleNavClick("settings")}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Help" 
                    isActive={activeNav === "help"}
                    onClick={() => handleNavClick("help")}
                  >
                    <HelpCircle className="mr-2 h-5 w-5" />
                    <span>Help</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Log Out" onClick={() => handleNavClick("logout")}>
                    <LogOut className="mr-2 h-5 w-5" />
                    <span>Log Out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>
          <SidebarInset className="p-0">
            <div className="pt-20 flex-grow">
              <DashboardContent activeView={activeView} setActiveView={setActiveView} />
            </div>
            <Footer />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
