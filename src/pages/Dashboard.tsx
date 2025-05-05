
import { useState, useEffect } from "react";
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
  ChevronRight,
  Home,
  BookOpen as Book,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  Trophy,
  Sparkles,
  User,
  Medal,
  Award,
  Star,
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
import { ProfileSection } from "@/components/dashboard/ProfileSection";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Import the upcomingQuizzes mock data from the same file as UpcomingQuizzes
import { upcomingQuizzes } from "@/components/dashboard/UpcomingQuizzes";

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatarUrl: null,
  role: "Medical Student",
  completedQuizzes: 12,
  totalQuizzes: 26,
  upcomingQuiz: "Cardiology Quiz",
  points: 1280,
  rank: 42
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
type DashboardView = "home" | "performance" | "settings" | "help" | "leaderboard";

interface DashboardContentProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
}

const DashboardContent = ({ activeView, setActiveView }: DashboardContentProps) => {
  const navigate = useNavigate();
  const { isMobile, open } = useSidebar();
  const [activeQuizTab, setActiveQuizTab] = useState<"completed" | "upcoming">("completed");
  const [progressValue, setProgressValue] = useState(0);
  const [scoreFilter, setScoreFilter] = useState([0]);
  const { toast } = useToast();
  
  const handleQuizStart = (id: string) => {
    navigate(`/quiz/${id}`);
  };
  
  const progressPercentage = (userData.completedQuizzes / userData.totalQuizzes) * 100;
  
  // Gradually animate progress bar on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(progressPercentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [progressPercentage]);
  
  // Filter quizzes based on score slider
  const filteredQuizzes = quizAttempts.filter(quiz => quiz.score >= scoreFilter[0]);
  
  const handleScoreFilterChange = (value: number[]) => {
    setScoreFilter(value);
    toast({
      title: "Score Filter Applied",
      description: `Showing quizzes with scores ${value[0]}% and above`,
      duration: 2000,
    });
  };

  // Render different views based on active view
  const renderActiveView = () => {
    switch (activeView) {
      case "performance":
        return <PerformanceDashboard />;
      case "settings":
        // We've removed the profile from settings, showing simplified settings
        return <UserSettings />;
      case "help":
        return <HelpCenter />;
      case "leaderboard":
        return <Leaderboard />;
      default:
        return (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Progress</h3>
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <p className="text-3xl font-bold mt-2">{userData.completedQuizzes} / {userData.totalQuizzes}</p>
                <p className="text-sm text-muted-foreground mb-3">Quizzes completed</p>
                <Progress value={progressValue} className="h-2" />
              </Card>
              
              <Card className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Average Score</h3>
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <p className="text-3xl font-bold mt-2 truncate">
                  {Math.round(quizAttempts.reduce((acc, quiz) => acc + quiz.score, 0) / quizAttempts.length)}%
                </p>
                <p className="text-sm text-muted-foreground">Across all quizzes</p>
                {quizAttempts.length > 0 && (
                  <div className="mt-3 flex items-center text-xs">
                    <Trophy className="h-3 w-3 mr-1 text-amber-500" />
                    <span>Top score: {Math.max(...quizAttempts.map(q => q.score))}%</span>
                  </div>
                )}
              </Card>
              
              <Card className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Next Quiz</h3>
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold mt-2 truncate">{userData.upcomingQuiz || "No upcoming quizzes"}</p>
                <p className="text-sm text-muted-foreground">
                  Ready to attempt
                </p>
                {upcomingQuizzes.length > 0 && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 mt-2" 
                    onClick={() => setActiveQuizTab("upcoming")}
                  >
                    View all upcoming
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </Card>
            </div>
            
            {/* Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                {/* Quiz History Section */}
                <Card className="bg-white rounded-lg shadow-sm mb-8">
                  <div className="border-b">
                    <div className="flex">
                      <button 
                        onClick={() => setActiveQuizTab("completed")}
                        className={`px-6 py-4 text-sm font-medium ${
                          activeQuizTab === "completed" 
                            ? "border-b-2 border-primary text-primary" 
                            : "text-muted-foreground hover:text-foreground transition-colors"
                        }`}
                      >
                        Completed Quizzes
                      </button>
                      <button 
                        onClick={() => setActiveQuizTab("upcoming")}
                        className={`px-6 py-4 text-sm font-medium ${
                          activeQuizTab === "upcoming" 
                            ? "border-b-2 border-primary text-primary" 
                            : "text-muted-foreground hover:text-foreground transition-colors"
                        }`}
                      >
                        Upcoming Quizzes
                      </button>
                    </div>
                  </div>
                  
                  {activeQuizTab === "completed" ? (
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Quiz History</h2>
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Filter by minimum score: {scoreFilter[0]}%</p>
                            <Slider
                              value={scoreFilter}
                              onValueChange={handleScoreFilterChange}
                              max={100}
                              step={5}
                              className="w-[160px]"
                            />
                          </div>
                        </div>
                      </div>
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
                            {filteredQuizzes.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                  No quizzes match your filter criteria
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredQuizzes.map((quiz) => (
                                <TableRow key={quiz.id} className="hover:bg-secondary/20 transition-colors group">
                                  <TableCell className="font-medium">{quiz.title}</TableCell>
                                  <TableCell>{new Date(quiz.date).toLocaleDateString()}</TableCell>
                                  <TableCell>
                                    <div className="flex flex-col">
                                      <span className="font-semibold">
                                        {quiz.score}%
                                        {quiz.score >= 90 && <Sparkles className="inline h-3 w-3 ml-1 text-amber-500" />}
                                      </span>
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
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleQuizStart(quiz.id)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      Retake
                                      <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
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
                              <TableRow key={quiz.id} className="hover:bg-secondary/20 transition-colors group">
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
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
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
                </Card>
              </div>
              
              {/* Upcoming quizzes sidebar */}
              <div>
                <UpcomingQuizzes />
              </div>
            </div>

            {/* Profile Section */}
            <ProfileSection />
          </>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
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

// Profile section component for the sidebar
const SidebarProfile = () => {
  const { open } = useSidebar();
  
  return (
    <div className={`p-4 border-t transition-all duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-primary/20">
          <AvatarImage src={userData.avatarUrl || undefined} alt={userData.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {userData.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className={`transition-all duration-200 ${open ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
          <p className="font-medium text-sm">{userData.name}</p>
          <p className="text-xs text-muted-foreground">{userData.role}</p>
          <div className="flex items-center mt-1 text-xs gap-1">
            <Trophy className="h-3 w-3 text-amber-500" />
            <span>{userData.points} pts</span>
            <span className="text-muted-foreground mx-1">•</span>
            <span>Rank #{userData.rank}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component to separate concerns and avoid nesting useSidebar calls
const DashboardSidebar = ({ 
  activeNav, 
  setActiveNav,
  handleNavClick 
}: { 
  activeNav: string; 
  setActiveNav: (nav: string) => void;
  handleNavClick: (nav: string) => void;
}) => {
  const { open, setOpen } = useSidebar();
  
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xl">Q</span>
          </div>
          <span className="font-bold text-lg">QuizHub</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setOpen(!open)}
          className="p-0 h-8 w-8"
        >
          {open ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
        </Button>
      </SidebarHeader>
      
      {/* Add profile section below the header */}
      <SidebarProfile />
      
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Dashboard" 
              isActive={activeNav === "dashboard"}
              onClick={() => handleNavClick("dashboard")}
              className="hover:bg-secondary/50 transition-colors"
            >
              <Home className="mr-2 h-5 w-5" />
              <span>Dashboard</span>
              
              {/* Add interactive animation for active item */}
              {activeNav === "dashboard" && (
                <span className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r-md animate-pulse" />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Quizzes" 
              isActive={activeNav === "quizzes"}
              onClick={() => handleNavClick("quizzes")}
              className="hover:bg-secondary/50 transition-colors"
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
              className="hover:bg-secondary/50 transition-colors"
            >
              <BarChart2 className="mr-2 h-5 w-5" />
              <span>Performance</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Add Leaderboard menu item */}
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Leaderboard" 
              isActive={activeNav === "leaderboard"}
              onClick={() => handleNavClick("leaderboard")}
              className="hover:bg-secondary/50 transition-colors"
            >
              <Trophy className="mr-2 h-5 w-5" />
              <span>Leaderboard</span>
              {/* Add "New" badge */}
              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary text-[10px] h-4">
                NEW
              </Badge>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Settings" 
              isActive={activeNav === "settings"}
              onClick={() => handleNavClick("settings")}
              className="hover:bg-secondary/50 transition-colors"
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
              className="hover:bg-secondary/50 transition-colors"
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
            <SidebarMenuButton 
              tooltip="Log Out" 
              onClick={() => handleNavClick("logout")}
              className="hover:bg-secondary/50 transition-colors hover:text-red-500"
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
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
      case "leaderboard":
        setActiveNav("leaderboard");
        setActiveView("leaderboard");
        break;
      case "logout":
        navigate('/');
        break;
      default:
        setActiveNav("dashboard");
        setActiveView("home");
    }
  };

  // Wrap the entire dashboard with SidebarProvider and add the Navbar
  return (
    <>
      <Navbar showInDashboard={true} />
      <div className="min-h-screen flex flex-col pt-16">
        <SidebarProvider defaultOpen={true}>
          <div className="flex flex-grow w-full">
            <DashboardSidebar 
              activeNav={activeNav} 
              setActiveNav={setActiveNav} 
              handleNavClick={handleNavClick} 
            />
            <SidebarInset className="p-0">
              <div className="pt-4 flex-grow">
                <DashboardContent activeView={activeView} setActiveView={setActiveView} />
              </div>
              <Footer />
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
};

export default Dashboard;
