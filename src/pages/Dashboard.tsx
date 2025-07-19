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
  Flame,
  TrendingUp,
  Target,
  Zap,
  Brain,
  Target as TargetIcon,
  CheckCircle,
  ArrowUpRight,
  Activity,
  Bookmark,
  Lightbulb,
  Crown,
  Clock as ClockIcon,
  Users,
  Eye,
  BookMarked,
  Upload,
  Download,
  Share2,
  Heart,
  MessageCircle,
  ThumbsUp,
  AlertCircle,
  Info,
  Plus,
  Minus,
  Filter,
  Search,
  RefreshCw,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCw,
  RotateCcw as RotateCcwIcon,
  ZoomIn,
  ZoomOut,
  Move,
  Copy,
  Scissors,
  Type,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Video,
  File,
  Folder,
  Trash2,
  Edit,
  Save,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Send,
  Mail,
  Phone,
  MapPin,
  Globe,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  SignalZero,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Battery as BatteryIcon,
  BatteryCharging as BatteryChargingIcon,
  Signal as SignalIcon,
  SignalHigh as SignalHighIcon,
  SignalMedium as SignalMediumIcon,
  SignalLow as SignalLowIcon,
  SignalZero as SignalZeroIcon
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
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getUserQuizHistory } from "@/lib/quizFirestore";

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

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: string;
}

interface StudyInsight {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
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
  const [quizStats, setQuizStats] = useState<any>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [studyInsights, setStudyInsights] = useState<StudyInsight[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Fetch comprehensive dashboard data
  const fetchDashboardData = async () => {
    if (!user?.uid) {
      setLoadingData(false);
      return;
    }

    try {
      setLoadingData(true);
      
      // Fetch quiz history from Firestore
      const history = await getUserQuizHistory(user.uid);
      setQuizHistory(history);
      
      // Calculate comprehensive stats
      if (history.length > 0) {
        const totalQuizzes = history.length;
        const totalScore = history.reduce((sum, result) => sum + result.score, 0);
        const averageScore = totalScore / totalQuizzes;
        const highestScore = Math.max(...history.map(result => result.score));
        const totalTime = history.reduce((sum, result) => sum + result.timeTaken, 0);
        const averageTime = totalTime / totalQuizzes;
        const recentScores = history.slice(0, 5).map(result => result.score);
        const improvement = recentScores.length > 1 ? 
          recentScores[0] - recentScores[recentScores.length - 1] : 0;
        
        setQuizStats({
          totalQuizzes,
          averageScore,
          highestScore,
          totalTime,
          averageTime,
          improvement,
          recentScores,
          totalQuestions: history.reduce((sum, result) => sum + result.totalQuestions, 0),
          correctAnswers: history.reduce((sum, result) => sum + result.correctAnswers, 0),
          accuracy: history.reduce((sum, result) => sum + result.correctAnswers, 0) / 
                   history.reduce((sum, result) => sum + result.totalQuestions, 0) * 100
        });

        // Generate achievements
        generateAchievements(history, averageScore, totalQuizzes, highestScore);
        
        // Generate study insights
        generateStudyInsights(history, averageScore, totalQuizzes, highestScore, averageTime);
        
        // Generate recent activity
        generateRecentActivity(history);
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  };

  // Generate achievements based on performance
  const generateAchievements = (history: any[], avgScore: number, totalQuizzes: number, highestScore: number) => {
    const newAchievements: Achievement[] = [
      {
        id: 'first-quiz',
        title: 'First Steps',
        description: 'Complete your first quiz',
        icon: '🎯',
        unlocked: totalQuizzes >= 1,
        progress: Math.min(totalQuizzes, 1),
        maxProgress: 1,
        category: 'participation'
      },
      {
        id: 'quiz-master',
        title: 'Quiz Master',
        description: 'Complete 10 quizzes',
        icon: '🏆',
        unlocked: totalQuizzes >= 10,
        progress: Math.min(totalQuizzes, 10),
        maxProgress: 10,
        category: 'participation'
      },
      {
        id: 'high-scorer',
        title: 'High Scorer',
        description: 'Achieve 90% or higher on any quiz',
        icon: '⭐',
        unlocked: highestScore >= 90,
        progress: Math.min(highestScore, 90),
        maxProgress: 90,
        category: 'performance'
      },
      {
        id: 'consistent',
        title: 'Consistent Performer',
        description: 'Maintain 80% average score',
        icon: '📈',
        unlocked: avgScore >= 80,
        progress: Math.min(avgScore, 80),
        maxProgress: 80,
        category: 'performance'
      },
      {
        id: 'speed-demon',
        title: 'Speed Demon',
        description: 'Complete a quiz in under 5 minutes',
        icon: '⚡',
        unlocked: history.some(result => result.timeTaken < 300),
        progress: history.some(result => result.timeTaken < 300) ? 1 : 0,
        maxProgress: 1,
        category: 'efficiency'
      },
      {
        id: 'perfect-score',
        title: 'Perfect Score',
        description: 'Get 100% on any quiz',
        icon: '👑',
        unlocked: highestScore >= 100,
        progress: Math.min(highestScore, 100),
        maxProgress: 100,
        category: 'performance'
      },
      {
        id: 'streak-master',
        title: 'Streak Master',
        description: 'Maintain a 7-day quiz streak',
        icon: '🔥',
        unlocked: (profile?.streak || 0) >= 7,
        progress: Math.min(profile?.streak || 0, 7),
        maxProgress: 7,
        category: 'consistency'
      },
      {
        id: 'accuracy-expert',
        title: 'Accuracy Expert',
        description: 'Maintain 95% accuracy across all quizzes',
        icon: '🎯',
        unlocked: quizStats?.accuracy >= 95,
        progress: Math.min(quizStats?.accuracy || 0, 95),
        maxProgress: 95,
        category: 'performance'
      }
    ];
    
    setAchievements(newAchievements);
  };

  // Generate study insights
  const generateStudyInsights = (history: any[], avgScore: number, totalQuizzes: number, highestScore: number, avgTime: number) => {
    const insights: StudyInsight[] = [];
    
    if (avgScore < 70) {
      insights.push({
        id: 'improve-accuracy',
        title: 'Focus on Accuracy',
        description: 'Your average score is below 70%. Consider reviewing difficult topics and taking practice quizzes.',
        icon: '🎯',
        category: 'performance',
        priority: 'high'
      });
    }
    
    if (avgTime > 600) {
      insights.push({
        id: 'time-management',
        title: 'Improve Time Management',
        description: 'You\'re taking longer than average on quizzes. Practice time management techniques.',
        icon: '⏱️',
        category: 'efficiency',
        priority: 'medium'
      });
    }
    
    if (totalQuizzes < 5) {
      insights.push({
        id: 'more-practice',
        title: 'More Practice Needed',
        description: 'Complete more quizzes to get better insights into your learning patterns.',
        icon: '📚',
        category: 'participation',
        priority: 'high'
      });
    }
    
    if (highestScore >= 90) {
      insights.push({
        id: 'excellent-progress',
        title: 'Excellent Progress!',
        description: 'You\'ve achieved high scores. Consider challenging yourself with more difficult quizzes.',
        icon: '🌟',
        category: 'motivation',
        priority: 'low'
      });
    }
    
    setStudyInsights(insights);
  };

  // Generate recent activity
  const generateRecentActivity = (history: any[]) => {
    const activities = history.slice(0, 5).map((result, index) => ({
      id: result.id,
      type: 'quiz_completed',
      title: `Completed ${result.quizTitle}`,
      description: `Scored ${result.score.toFixed(1)}% (${result.correctAnswers}/${result.totalQuestions})`,
      time: result.completedAt?.toDate?.() || new Date(),
      icon: result.score >= 80 ? '🎉' : result.score >= 60 ? '👍' : '📝',
      score: result.score
    }));
    
    setRecentActivity(activities);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.uid]);

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

  // Helper functions
  const formatTimeTaken = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatCompletionDate = (completedAt: any) => {
    const date = completedAt?.toDate?.() || new Date(completedAt) || new Date();
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-secondary/10 to-secondary/5 dark:from-gray-900 dark:to-gray-950">
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // --- Enhanced Dashboard Layout ---
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-secondary/10 to-secondary/5 dark:from-gray-900 dark:to-gray-950">
      {/* Hero/Welcome Card */}
      <div className="container mx-auto px-2 sm:px-4 mt-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl shadow-lg p-4 sm:p-8">
          <Avatar className="h-16 w-16 border-2 border-primary/30">
            <AvatarImage src={profile?.avatarUrl || undefined} alt="Profile" />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {profile?.name?.split(' ').map(n => n[0]).join('') || <User className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-primary mb-1">Welcome back, {profile?.name || "User"}!</h1>
            <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-base sm:text-lg justify-center sm:justify-start">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span>Ready for your next challenge?</span>
            </div>
          </div>
          <div className="flex gap-2 ml-auto">
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchDashboardData}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Quiz Streak Tracker Card */}
      <div className="container mx-auto px-2 sm:px-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 px-2 sm:px-0">
          <Card className="flex-1 bg-gradient-to-r from-orange-100 to-yellow-50 rounded-xl shadow-md flex flex-col xs:flex-row items-center gap-4 p-4">
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-orange-200">
              <Flame className="h-8 w-8 text-orange-500 animate-pulse" />
            </div>
            <div className="flex flex-col items-center xs:items-start text-center xs:text-left">
              <span className="text-base xs:text-lg font-semibold text-orange-700">Quiz Streak</span>
              <span className="text-2xl xs:text-3xl font-bold text-orange-600">{profile?.streak || 0} <span className="text-base font-medium">day{profile?.streak === 1 ? '' : 's'}</span></span>
              {profile?.streak > 0 ? (
                <span className="text-xs xs:text-sm text-orange-700 mt-1">🔥 Keep it up! You're on a roll!</span>
              ) : (
                <span className="text-xs xs:text-sm text-muted-foreground mt-1">Start a quiz today to begin your streak!</span>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Enhanced Stats Cards Section */}
      <div className="container mx-auto px-2 sm:px-4 mb-10">
        <h2 className="text-lg xs:text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-primary" /> Performance Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Progress Card */}
          <Card className="bg-gradient-to-br from-blue-100 to-blue-50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Progress</h3>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold mt-1">{quizStats?.totalQuizzes || 0} / {profile?.totalQuizzes || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Quizzes completed</p>
            <Progress value={progressValue} className="mt-2 h-2" />
          </Card>

          {/* Average Score Card */}
          <Card className="bg-gradient-to-br from-green-100 to-green-50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Avg. Score</h3>
              <BarChart2 className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold mt-1">{quizStats?.averageScore?.toFixed(1) || 0}%</p>
            <p className="text-xs text-muted-foreground mt-1">Across all quizzes</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <Trophy className="h-3 w-3" /> Top: {quizStats?.highestScore?.toFixed(1) || 0}%
            </p>
          </Card>

          {/* Study Time Card */}
          <Card className="bg-gradient-to-br from-purple-100 to-purple-50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Study Time</h3>
              <Clock className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-lg font-semibold mt-1">{quizStats?.totalTime ? formatTotalTime(quizStats.totalTime) : "0m"}</p>
            <p className="text-xs text-muted-foreground mt-1">Total time spent</p>
            <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Avg: {quizStats?.averageTime ? formatTimeTaken(quizStats.averageTime) : "0m"}
            </p>
          </Card>

          {/* Accuracy Card */}
          <Card className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Accuracy</h3>
              <Target className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold mt-1">{quizStats?.accuracy?.toFixed(1) || 0}%</p>
            <p className="text-xs text-muted-foreground mt-1">Overall accuracy</p>
            <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> {quizStats?.correctAnswers || 0}/{quizStats?.totalQuestions || 0} correct
            </p>
          </Card>
        </div>
      </div>

      {/* Performance Trends */}
      {quizStats && quizStats.recentScores && quizStats.recentScores.length > 1 && (
        <div className="container mx-auto px-2 sm:px-4 mb-10">
          <h2 className="text-lg xs:text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Performance Trends
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-emerald-100 to-emerald-50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
                <div>
                  <h3 className="font-semibold text-emerald-800">Recent Improvement</h3>
                  <p className="text-sm text-emerald-600">
                    {quizStats.improvement > 0 ? '+' : ''}{quizStats.improvement.toFixed(1)}% improvement
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-100 to-indigo-50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-indigo-600" />
                <div>
                  <h3 className="font-semibold text-indigo-800">Score Range</h3>
                  <p className="text-sm text-indigo-600">
                    {Math.min(...quizStats.recentScores).toFixed(1)}% - {Math.max(...quizStats.recentScores).toFixed(1)}%
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Study Insights */}
      {studyInsights.length > 0 && (
        <div className="container mx-auto px-2 sm:px-4 mb-10">
          <h2 className="text-lg xs:text-xl font-bold mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" /> Study Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studyInsights.map((insight) => (
              <Card key={insight.id} className={`p-4 rounded-xl border-l-4 ${
                insight.priority === 'high' ? 'border-l-red-500 bg-red-50' :
                insight.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                'border-l-green-500 bg-green-50'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{insight.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{insight.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {insight.priority} priority
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Section */}
      <div className="container mx-auto px-2 sm:px-4 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg xs:text-xl font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" /> Achievements & Badges
          </h2>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              {achievements.filter(a => a.unlocked).length}/{achievements.length} Unlocked
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/achievements')}
              className="text-xs"
            >
              View All
            </Button>
          </div>
        </div>
        
        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`transition-all duration-300 ${
                achievement.unlocked 
                  ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`text-2xl ${achievement.unlocked ? 'animate-bounce' : 'opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${achievement.unlocked ? 'text-amber-800' : 'text-gray-600'}`}>
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="flex-1 h-2" 
                        />
                        <span className="text-xs text-muted-foreground">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      {achievement.unlocked && (
                        <div className="flex items-center gap-1 mt-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">Unlocked!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-center py-8">No achievements yet. Start taking quizzes to unlock badges!</div>
        )}
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="container mx-auto px-2 sm:px-4 mb-10">
          <h2 className="text-lg xs:text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" /> Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <Card key={activity.id} className="p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time.toLocaleDateString()} at {activity.time.toLocaleTimeString()}
                    </p>
                  </div>
                  {activity.score && (
                    <Badge variant={activity.score >= 80 ? "default" : activity.score >= 60 ? "secondary" : "destructive"}>
                      {activity.score.toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Quiz History Section */}
      <div className="container mx-auto px-2 sm:px-4 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg xs:text-xl font-bold flex items-center gap-2">
            <History className="h-5 w-5 text-primary" /> Quiz History
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filter by score:</span>
            <Slider
              value={scoreFilter}
              onValueChange={handleScoreFilterChange}
              max={100}
              min={0}
              step={10}
              className="w-24"
            />
            <span className="text-sm font-medium">{scoreFilter[0]}%+</span>
          </div>
        </div>
        
        <Card className="rounded-xl shadow-md p-0 overflow-x-auto">
          <table className="min-w-full text-xs xs:text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Quiz</th>
                <th className="px-4 py-2 text-left font-semibold">Score</th>
                <th className="px-4 py-2 text-left font-semibold">Accuracy</th>
                <th className="px-4 py-2 text-left font-semibold">Time</th>
                <th className="px-4 py-2 text-left font-semibold">Date</th>
                <th className="px-4 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuizzes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">No quiz attempts found.</td>
                </tr>
              ) : (
                filteredQuizzes.map((attempt) => (
                  <tr key={attempt.id} className="border-b last:border-0 hover:bg-primary/5 transition-colors">
                    <td className="px-4 py-2 font-medium">{attempt.quizTitle}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span>{attempt.score.toFixed(1)}%</span>
                        <Badge variant={
                          attempt.score >= 80 ? "default" : 
                          attempt.score >= 60 ? "secondary" : "destructive"
                        }>
                          {attempt.correctAnswers}/{attempt.totalQuestions}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {attempt.totalQuestions > 0 ? Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100) : 0}%
                    </td>
                    <td className="px-4 py-2">{formatTimeTaken(attempt.timeTaken)}</td>
                    <td className="px-4 py-2">{formatCompletionDate(attempt.completedAt)}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReviewAnswers(attempt.id)}
                          className="h-6 px-2 text-xs"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-2 sm:px-4 mb-10">
        <h2 className="text-lg xs:text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-2 sm:p-3 bg-gradient-to-br from-primary/10 to-primary/5 border-none shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="py-2 px-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-5 w-5 text-primary" /> Take Quiz
              </CardTitle>
              <CardDescription className="text-xs">Practice your knowledge with our quizzes</CardDescription>
            </CardHeader>
            <CardContent className="py-1 px-3">
              <p className="text-xs">Choose from a variety of quizzes in different subjects and topics.</p>
            </CardContent>
            <CardFooter className="py-2 px-3">
              <Button className="w-full h-8 text-sm py-1" onClick={() => navigate('/quizzes')}>Go</Button>
            </CardFooter>
          </Card>

          <Card className="p-2 sm:p-3 bg-gradient-to-br from-blue-100 to-blue-50 border-none shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="py-2 px-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Upload className="h-5 w-5 text-blue-500" /> Upload Notes
              </CardTitle>
              <CardDescription className="text-xs">Share your notes with the community</CardDescription>
            </CardHeader>
            <CardContent className="py-1 px-3">
              <p className="text-xs">Help others by uploading your study notes and resources.</p>
            </CardContent>
            <CardFooter className="py-2 px-3">
              <Button className="w-full h-8 text-sm py-1" onClick={() => navigate('/upload-notes')}>Go</Button>
            </CardFooter>
          </Card>

          <Card className="p-2 sm:p-3 bg-gradient-to-br from-green-100 to-green-50 border-none shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="py-2 px-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookMarked className="h-5 w-5 text-green-600" /> View Notes
              </CardTitle>
              <CardDescription className="text-xs">Browse and download notes</CardDescription>
            </CardHeader>
            <CardContent className="py-1 px-3">
              <p className="text-xs">Access notes uploaded by other users for your subjects.</p>
            </CardContent>
            <CardFooter className="py-2 px-3">
              <Button className="w-full h-8 text-sm py-1" onClick={() => navigate('/view-notes')}>Go</Button>
            </CardFooter>
          </Card>

          <Card className="p-2 sm:p-3 bg-gradient-to-br from-yellow-100 to-yellow-50 border-none shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="py-2 px-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="h-5 w-5 text-yellow-600" /> Quiz History
              </CardTitle>
              <CardDescription className="text-xs">Review your past quiz attempts</CardDescription>
            </CardHeader>
            <CardContent className="py-1 px-3">
              <p className="text-xs">See your previous quiz scores and progress over time.</p>
            </CardContent>
            <CardFooter className="py-2 px-3">
              <Button className="w-full h-8 text-sm py-1" onClick={() => navigate('/quiz-history')}>Go</Button>
            </CardFooter>
          </Card>

          <Card className="p-2 sm:p-3 bg-gradient-to-br from-purple-100 to-purple-50 border-none shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="py-2 px-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="h-5 w-5 text-purple-600" /> Leaderboard
              </CardTitle>
              <CardDescription className="text-xs">See how you rank</CardDescription>
            </CardHeader>
            <CardContent className="py-1 px-3">
              <p className="text-xs">Check your position on the leaderboard and compete with others.</p>
            </CardContent>
            <CardFooter className="py-2 px-3">
              <Button className="w-full h-8 text-sm py-1" onClick={() => navigate('/leaderboard')}>Go</Button>
            </CardFooter>
          </Card>

          <Card className="p-2 sm:p-3 bg-gradient-to-br from-pink-100 to-pink-50 border-none shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="py-2 px-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-5 w-5 text-pink-600" /> Notifications
              </CardTitle>
              <CardDescription className="text-xs">Stay updated</CardDescription>
            </CardHeader>
            <CardContent className="py-1 px-3">
              <p className="text-xs">Get the latest updates, reminders, and announcements.</p>
            </CardContent>
            <CardFooter className="py-2 px-3">
              <Button className="w-full h-8 text-sm py-1" onClick={() => navigate('/notifications')}>Go</Button>
            </CardFooter>
          </Card>

          <Card className="p-2 sm:p-3 bg-gradient-to-br from-gray-100 to-gray-50 border-none shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="py-2 px-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5 text-gray-600" /> My Profile
              </CardTitle>
              <CardDescription className="text-xs">Manage your account</CardDescription>
            </CardHeader>
            <CardContent className="py-1 px-3">
              <p className="text-xs">Edit your profile details and preferences.</p>
            </CardContent>
            <CardFooter className="py-2 px-3">
              <Button className="w-full h-8 text-sm py-1" onClick={() => navigate('/my-profile')}>Go</Button>
            </CardFooter>
          </Card>

          <Card className="p-2 sm:p-3 bg-gradient-to-br from-indigo-100 to-indigo-50 border-none shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="py-2 px-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="h-5 w-5 text-indigo-600" /> Settings
              </CardTitle>
              <CardDescription className="text-xs">Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="py-1 px-3">
              <p className="text-xs">Adjust your app settings and preferences.</p>
            </CardContent>
            <CardFooter className="py-2 px-3">
              <Button className="w-full h-8 text-sm py-1" onClick={() => navigate('/settings')}>Go</Button>
            </CardFooter>
          </Card>
        </div>
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
