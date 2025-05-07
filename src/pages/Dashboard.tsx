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
  RotateCcw,
  Calendar,
  Bell,
  Tag,
  Sun,
  Moon,
  Timer,
  Flag
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { PerformanceDashboard } from "@/components/dashboard/PerformanceDashboard";
import { UserSettings } from "@/components/dashboard/UserSettings";
import { HelpCenter } from "@/components/dashboard/HelpCenter";
import { UpcomingQuizzes } from "@/components/dashboard/UpcomingQuizzes";
import { ProfileSection } from "@/components/dashboard/ProfileSection";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

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
  rank: 42,
  streak: 4,
  goalThisWeek: 3,
  achievements: [
    { id: 1, name: "First Quiz", icon: "Award", progress: 100 },
    { id: 2, name: "Quiz Streak", icon: "Trophy", progress: 40 },
    { id: 3, name: "Top 10%", icon: "Star", progress: 100 },
  ]
};

// Mock quiz attempts with added time data
const quizAttempts = [
  { 
    id: "1", 
    title: "Medical Ethics", 
    score: 85, 
    date: "2025-04-28", 
    status: "completed", 
    correctAnswers: 17,
    totalQuestions: 20,
    timeSpent: "14:22",
    tags: ["Ethics", "Medical"]
  },
  { 
    id: "2", 
    title: "Cardiology", 
    score: 76, 
    date: "2025-04-25", 
    status: "completed", 
    correctAnswers: 19,
    totalQuestions: 25,
    timeSpent: "18:45",
    tags: ["Cardio", "Medical"]
  },
  { 
    id: "3", 
    title: "Neurology", 
    score: 92, 
    date: "2025-04-20", 
    status: "completed", 
    correctAnswers: 23,
    totalQuestions: 25,
    timeSpent: "11:50",
    tags: ["Neuro", "Medical"]
  },
];

// Mock notifications
const notifications = [
  {
    id: 1,
    title: "Upcoming Quiz",
    message: "Don't forget your Cardiology quiz tomorrow at 10:00 AM",
    time: "1 hour ago",
    unread: true
  },
  {
    id: 2,
    title: "Performance Update",
    message: "You're in the top 10% of Neurology quiz takers!",
    time: "3 hours ago",
    unread: true
  },
  {
    id: 3,
    title: "New Quiz Available",
    message: "Check out the new Pathology quiz now available",
    time: "Yesterday",
    unread: false
  }
];

// Dashboard views
type DashboardView = "home" | "performance" | "settings" | "help" | "leaderboard" | "calendar";

interface DashboardContentProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
}

const DashboardContent = ({ activeView, setActiveView }: DashboardContentProps) => {
  const navigate = useNavigate();
  const [activeQuizTab, setActiveQuizTab] = useState<"completed" | "upcoming">("completed");
  const [progressValue, setProgressValue] = useState(0);
  const [scoreFilter, setScoreFilter] = useState([0]);
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const handleQuizStart = (id: string) => {
    navigate(`/quiz/${id}`);
  };
  
  const handleReviewAnswers = (id: string) => {
    toast({
      title: "Review Mode Activated",
      description: `Loading review for ${quizAttempts.find(q => q.id === id)?.title}`,
    });
    setTimeout(() => navigate(`/quiz/${id}?review=true`), 1000);
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

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // On mount, check localStorage for theme preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (storedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      // fallback to system preference
      const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(darkModePreference);
      if (darkModePreference) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

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
      case "calendar":
        return (
          <Card className="bg-white rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>Upcoming quizzes calendar</CardDescription>
            </CardHeader>
            <CardContent className="h-[600px] flex items-center justify-center">
              <div className="text-center">
                <Calendar className="h-16 w-16 mx-auto text-primary opacity-50" />
                <h3 className="text-xl font-medium mt-4">Calendar View Coming Soon</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  We're working on a calendar view to help you visualize your upcoming quizzes.
                  This feature will be available in the next update.
                </p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return (
          <>
            {/* Goal Tracker Banner */}
            <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white mb-8 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="space-y-2 mb-4 md:mb-0">
                    <h3 className="text-xl font-bold">Your goal this week: {userData.goalThisWeek} quizzes</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-white/90">
                        You're {Math.round((userData.completedQuizzes % userData.goalThisWeek) / userData.goalThisWeek * 100)}% there. Let's crush it! 💪
                      </p>
                      <Badge className="bg-white/20 text-white">{userData.streak} day streak 🔥</Badge>
                    </div>
                    <Progress value={40} className="h-2 bg-white/30" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="default" className="bg-white text-purple-500 hover:bg-white/90">
                      Start a Quiz Now
                    </Button>
                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                      View All Quizzes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              
              <Card className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Achievements</h3>
                  <Medal className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex -space-x-2 mt-2">
                  {userData.achievements.map((achievement, index) => (
                    <div 
                      key={achievement.id}
                      className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center border-2 border-white text-white"
                      title={achievement.name}
                    >
                      {achievement.icon === "Trophy" && <Trophy className="h-4 w-4" />}
                      {achievement.icon === "Award" && <Award className="h-4 w-4" />}
                      {achievement.icon === "Star" && <Star className="h-4 w-4" />}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  3/12 achievements unlocked
                </p>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 mt-1" 
                  onClick={() => {}}
                >
                  View all achievements
                  <ChevronRight className="h-4 w-4" />
                </Button>
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
                      <div className="ml-auto flex items-center px-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => setActiveView("calendar")}
                        >
                          <Calendar className="h-4 w-4" />
                          Calendar View
                        </Button>
                      </div>
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
                              <TableHead>Time</TableHead>
                              <TableHead>Tags</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredQuizzes.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
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
                                    <div className="flex items-center">
                                      <Timer className="h-3 w-3 mr-1 text-muted-foreground" />
                                      <span>{quiz.timeSpent}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                      {quiz.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 text-xs flex items-center gap-0.5">
                                          <Tag className="h-2.5 w-2.5" />
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => handleReviewAnswers(quiz.id)}
                                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                      >
                                        <BookOpen className="h-3.5 w-3.5 mr-1" />
                                        Review
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => handleQuizStart(quiz.id)}
                                        className="text-green-600 border-green-200 hover:bg-green-50"
                                      >
                                        <RotateCcw className="h-3.5 w-3.5 mr-1" />
                                        Retake
                                      </Button>
                                    </div>
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
          </>
        );
    }
  };

  return (
    <div className="container px-4 py-6">
      {/* Fixed the JSX structure here */}
      <div>
        {renderActiveView()}
      </div>
      
      {/* Notifications Panel */}
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="relative"
            title="Notifications"
          >
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            {notifications.some(n => n.unread) && (
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full"></span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-4 border rounded-lg ${notification.unread ? "border-primary/30 bg-primary/5" : "border-muted"}`}
              >
                <div className="flex justify-between">
                  <h4 className="font-medium">{notification.title}</h4>
                  {notification.unread && (
                    <Badge variant="secondary" className="text-xs font-normal">New</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const Dashboard = () => {
  useScrollToTop();
  const [activeView, setActiveView] = useState<DashboardView>("home");

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col pt-16">
        <div className="flex-grow">
          <DashboardContent activeView={activeView} setActiveView={setActiveView} />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
