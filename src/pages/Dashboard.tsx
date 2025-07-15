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
  Flag,
  History,
  Flame
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
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const { profile, user } = useAuth();
  const [quizHistory, setQuizHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      const q = query(
        collection(db, "users", user.uid, "quizHistory"),
        orderBy("date", "desc")
      );
      const snapshot = await getDocs(q);
      setQuizHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchHistory();
  }, [user]);
  
  const handleQuizStart = (id: string) => {
    navigate(`/quiz/${id}`);
  };
  
  const handleReviewAnswers = (id: string) => {
    toast({
      title: "Review Mode Activated",
      description: `Loading review for ${quizHistory.find(q => q.id === id)?.title}`,
    });
    setTimeout(() => navigate(`/quiz/${id}?review=true`), 1000);
  };
  
  const progressPercentage = profile && profile.totalQuizzes ? (profile.completedQuizzes || 0) / profile.totalQuizzes * 100 : 0;
  
  // Gradually animate progress bar on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(progressPercentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [progressPercentage]);
  
  // Filter quizzes based on score slider
  const filteredQuizzes = quizHistory.filter(quiz => quiz.score >= scoreFilter[0]);
  
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

  // --- Modern Dashboard Layout ---
        return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-secondary/10 to-secondary/5 dark:from-gray-900 dark:to-gray-950">
      {/* Hero/Welcome Card */}
      <div className="container mx-auto px-2 sm:px-4 mt-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl shadow-lg p-6 sm:p-8">
          <Avatar className="h-16 w-16 border-2 border-primary/30">
            <AvatarImage src={profile?.avatarUrl || undefined} alt="Profile" />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {profile?.name?.split(' ').map(n => n[0]).join('') || <User className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center sm:items-start">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-1">Welcome back, {profile?.name || "User"}!</h1>
            <div className="flex items-center gap-2 text-muted-foreground text-lg">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span>Ready for your next challenge?</span>
            </div>
          </div>
        </div>
      </div>
      {/* Quiz Streak Tracker Card */}
      <div className="container mx-auto px-2 sm:px-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Card className="flex-1 bg-gradient-to-r from-orange-100 to-yellow-50 rounded-xl shadow-md flex items-center gap-4 p-4">
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-orange-200">
              <Flame className="h-8 w-8 text-orange-500 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-orange-700">Quiz Streak</span>
              <span className="text-3xl font-bold text-orange-600">{profile?.streak || 0} <span className="text-base font-medium">day{profile?.streak === 1 ? '' : 's'}</span></span>
              {profile?.streak > 0 ? (
                <span className="text-sm text-orange-700 mt-1">🔥 Keep it up! You're on a roll!</span>
              ) : (
                <span className="text-sm text-muted-foreground mt-1">Start a quiz today to begin your streak!</span>
              )}
              </div>
          </Card>
                  </div>
                </div>
      {/* Stat Cards Section */}
      <div className="container mx-auto px-2 sm:px-4 mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-primary" /> Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Progress Card */}
          <Card className="bg-gradient-to-br from-blue-100 to-blue-50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Progress</h3>
              <BookOpen className="h-4 w-4 text-blue-500" />
                </div>
            <p className="text-2xl font-bold mt-1">{profile?.completedQuizzes || 0} / {profile?.totalQuizzes || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Quizzes completed</p>
              </Card>
          {/* Average Score Card */}
          <Card className="bg-gradient-to-br from-green-100 to-green-50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Avg. Score</h3>
              <BarChart2 className="h-4 w-4 text-green-500" />
                </div>
            <p className="text-2xl font-bold mt-1">{profile?.avgScore || 0}%</p>
            <p className="text-xs text-muted-foreground mt-1">Across all quizzes</p>
              </Card>
          {/* Next Quiz Card */}
          <Card className="bg-gradient-to-br from-purple-100 to-purple-50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Next Quiz</h3>
              <BookOpen className="h-4 w-4 text-purple-500" />
                </div>
            <p className="text-lg font-semibold mt-1">{profile?.upcomingQuiz || "-"}</p>
            <p className="text-xs text-muted-foreground mt-1">Scheduled</p>
              </Card>
          {/* Achievements Card */}
          <Card className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Achievements</h3>
              <Trophy className="h-4 w-4 text-yellow-500" />
                </div>
            <p className="text-2xl font-bold mt-1">{profile?.achievementsUnlocked || 0} / {profile?.totalAchievements || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Unlocked</p>
              </Card>
            </div>
      </div>
      {/* Achievements & Badges Section */}
      <div className="container mx-auto px-2 sm:px-4 mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" /> Achievements & Badges
        </h2>
        {profile?.achievements && profile.achievements.length > 0 ? (
          <div className="flex flex-wrap gap-6">
            <TooltipProvider>
              {profile.achievements.map((ach) => {
                const Icon = require('lucide-react')[ach.icon] || Trophy;
                return (
                  <Tooltip key={ach.id}>
                    <TooltipTrigger asChild>
                      <button 
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 shadow-md transition-all duration-200 focus:outline-none ${ach.unlocked ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 bg-gray-100 opacity-60'}`}
                        tabIndex={0}
                        aria-label={ach.name}
                      >
                        <Icon className={`h-10 w-10 ${ach.unlocked ? 'text-yellow-500' : 'text-gray-400'}`} />
                        <span className="font-medium text-base">{ach.name}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-center">
                      <div className="font-semibold mb-1">{ach.name}</div>
                      <div className="text-sm mb-1">{ach.description}</div>
                      {!ach.unlocked && (
                        <div className="text-xs text-muted-foreground mt-1">How to unlock: {ach.unlockHint}</div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
                    </div>
                  ) : (
          <div className="text-muted-foreground text-center py-8">No achievements yet. Start taking quizzes to unlock badges!</div>
        )}
      </div>
      {/* Quiz History Section */}
      <div className="container mx-auto px-2 sm:px-4 mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <History className="h-5 w-5 text-primary" /> Quiz History
        </h2>
        <Card className="rounded-xl shadow-md p-0 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Quiz</th>
                <th className="px-4 py-2 text-left font-semibold">Score</th>
                <th className="px-4 py-2 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {quizHistory.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">No quiz attempts yet.</td>
                </tr>
              ) : (
                quizHistory.map((attempt) => (
                  <tr key={attempt.id} className="border-b last:border-0 hover:bg-primary/5 transition-colors">
                    <td className="px-4 py-2 font-medium">{attempt.title}</td>
                    <td className="px-4 py-2">{attempt.score} / {attempt.totalQuestions} ({Math.round((attempt.score / attempt.totalQuestions) * 100)}%)</td>
                    <td className="px-4 py-2">{attempt.date && attempt.date.toDate ? attempt.date.toDate().toLocaleDateString() : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
          </div>
    </div>
  );
};

const Dashboard = () => {
  useScrollToTop();
  const { isLoggedIn } = useAuth();
  const [activeView, setActiveView] = useState<DashboardView>("home");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showInDashboard={isLoggedIn} />
      <main className="flex-grow pt-20 pb-16 bg-gradient-to-b from-secondary/10 to-secondary/5 dark:from-gray-900 dark:to-gray-950">
        <DashboardContent activeView={activeView} setActiveView={setActiveView} />
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
