import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronRight, BookOpen, Upload, Clock, BarChart2, Trophy, Users, BookMarked, Settings, Award, History, Bell, User, Target, Calendar, TrendingUp, Star, Zap, Brain, Target as TargetIcon, Medal, Crown, Flame, Lightbulb, Bookmark, CheckCircle, ArrowUpRight, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { UserSettings } from "@/components/dashboard/UserSettings";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserQuizHistory } from "@/lib/quizFirestore";
import { Badge } from "@/components/ui/badge";

interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  answers: Record<number, number>;
  completedAt: any;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

const UserHub = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [recentResults, setRecentResults] = useState<QuizResult[]>([]);
  const [quizStats, setQuizStats] = useState<any>(null);
  const [loadingResults, setLoadingResults] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Fetch quiz results and stats
  const fetchQuizData = async () => {
    console.log('UserHub useEffect - user:', user);
    console.log('UserHub useEffect - user?.uid:', user?.uid);
    
    if (!user?.uid) {
      console.log('No user UID found, skipping quiz data fetch');
      setLoadingResults(false);
      return;
    }

    try {
      setLoadingResults(true);
      
      console.log('About to call getUserQuizHistory...');
      const history = await getUserQuizHistory(user.uid);
      console.log('Quiz history fetched:', history);
      console.log('History length:', history.length);
      
      setRecentResults(history.slice(0, 5)); // Get last 5 results
      
      // Calculate stats from history
      if (history.length > 0) {
        const totalQuizzes = history.length;
        const totalScore = history.reduce((sum, result) => sum + result.score, 0);
        const averageScore = totalScore / totalQuizzes;
        const highestScore = Math.max(...history.map(result => result.score));
        const totalTime = history.reduce((sum, result) => sum + result.timeTaken, 0);
        const averageTime = totalTime / totalQuizzes;
        
        setQuizStats({
          totalQuizzes,
          averageScore,
          highestScore,
          totalTime,
          averageTime,
          improvement: history.length > 1 ? averageScore - (history.slice(-2, -1)[0]?.score || 0) : 0
        });
        
        console.log('Calculated stats:', {
          totalQuizzes,
          averageScore,
          highestScore,
          totalTime,
          averageTime
        });

        // Generate achievements based on performance
        generateAchievements(history, averageScore, totalQuizzes, highestScore);
      }
      
      toast({
        title: "Success",
        description: `Loaded ${history.length} quiz results`,
      });
      
    } catch (err) {
      console.error('Error fetching quiz data:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        user: user?.uid
      });
      toast({
        title: "Error",
        description: "Failed to load quiz results",
        variant: "destructive"
      });
    } finally {
      setLoadingResults(false);
    }
  };

  // Generate achievements based on user performance
  const generateAchievements = (history: QuizResult[], avgScore: number, totalQuizzes: number, highestScore: number) => {
    const newAchievements: Achievement[] = [
      {
        id: 'first-quiz',
        title: 'First Steps',
        description: 'Complete your first quiz',
        icon: '🎯',
        unlocked: totalQuizzes >= 1,
        progress: Math.min(totalQuizzes, 1),
        maxProgress: 1
      },
      {
        id: 'quiz-master',
        title: 'Quiz Master',
        description: 'Complete 10 quizzes',
        icon: '🏆',
        unlocked: totalQuizzes >= 10,
        progress: Math.min(totalQuizzes, 10),
        maxProgress: 10
      },
      {
        id: 'high-scorer',
        title: 'High Scorer',
        description: 'Achieve 90% or higher on any quiz',
        icon: '⭐',
        unlocked: highestScore >= 90,
        progress: Math.min(highestScore, 90),
        maxProgress: 90
      },
      {
        id: 'consistent',
        title: 'Consistent Performer',
        description: 'Maintain 80% average score',
        icon: '📈',
        unlocked: avgScore >= 80,
        progress: Math.min(avgScore, 80),
        maxProgress: 80
      },
      {
        id: 'speed-demon',
        title: 'Speed Demon',
        description: 'Complete a quiz in under 5 minutes',
        icon: '⚡',
        unlocked: history.some(result => result.timeTaken < 300),
        progress: history.some(result => result.timeTaken < 300) ? 1 : 0,
        maxProgress: 1
      },
      {
        id: 'perfect-score',
        title: 'Perfect Score',
        description: 'Get 100% on any quiz',
        icon: '👑',
        unlocked: highestScore >= 100,
        progress: Math.min(highestScore, 100),
        maxProgress: 100
      }
    ];
    
    setAchievements(newAchievements);
  };

  useEffect(() => {
    fetchQuizData();
  }, [user?.uid, toast]);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      const progressTimer = setTimeout(() => {
        setProgress(42);
      }, 300);
      
      return () => clearTimeout(progressTimer);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Helper function to format completion date
  const formatCompletionDate = (completedAt: any) => {
    const date = completedAt?.toDate?.() || new Date(completedAt) || new Date();
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to format time taken
  const formatTimeTaken = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Helper function to format total time
  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Navigation functions
  const navigateTo = (path: string) => {
    navigate(path);
  };
  
  // Animation classes
  const cardAnimation = "hover:scale-105 transition-transform duration-200";

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading your hub...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showInDashboard />
      <main className="flex-grow pt-20 pb-16 bg-gradient-to-b from-secondary/10 to-secondary/5 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-2 sm:px-4">
          {/* Redesigned Welcome Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 mb-8 px-2 sm:px-0">
            <Avatar className="h-16 w-16 border-2 border-primary/30 shadow">
              <AvatarImage src={profile?.photoURL || undefined} alt={profile?.name || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {profile?.name?.split(" ").map(n => n[0]).join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold flex flex-wrap items-center gap-2 text-center sm:text-left">
                <span role="img" aria-label="wave">👋</span>
                Welcome back, <span className="text-primary">{profile?.name || "User"}</span>!
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-muted-foreground text-base sm:text-lg justify-center sm:justify-start">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                Ready for your next challenge?
              </div>
            </div>
          </div>
          
          {/* Enhanced Stats & Progress */}
          <div className="flex flex-col lg:flex-row gap-8 px-2 sm:px-0">
            {/* Left: Stats & Progress */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Weekly Goal Card */}
              <Card className="overflow-hidden bg-gradient-to-r from-violet-500 to-purple-500 text-white border-none shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4">
                    <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-1">Weekly Goal</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <p className="text-base xs:text-lg sm:text-xl">Goal: <span className="font-bold">{profile?.goalThisWeek || 3}</span> quizzes</p>
                      <span className="px-4 py-1 bg-white/20 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">
                        {(profile?.streak || 0)} day streak 🔥
                      </span>
                    </div>
                    <div className="flex flex-col xs:flex-row items-center gap-2 xs:gap-4">
                      <Progress value={profile?.progress || 0} className="h-4 bg-white/30 flex-1 w-full xs:w-auto" />
                      <span className="text-base xs:text-lg font-semibold">{profile && profile.goalThisWeek ? Math.round(((profile.quizzesTaken || 0) % profile.goalThisWeek) / profile.goalThisWeek * 100) : 0}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
                {/* Progress Card */}
                <Card className="bg-white dark:bg-gray-800 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <BookMarked className="h-6 w-6 text-violet-500" />
                      <h3 className="text-xl font-medium">Progress</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-4xl font-bold">{quizStats?.totalQuizzes || profile?.quizzesTaken || 0} <span className="text-xl text-muted-foreground">/ {profile?.totalQuizzes || 0}</span></p>
                      <p className="text-muted-foreground">Quizzes completed</p>
                    </div>
                    <Progress value={profile && profile.totalQuizzes ? (quizStats?.totalQuizzes || profile?.quizzesTaken || 0) / profile.totalQuizzes * 100 : 0} className="mt-3 h-2" />
                  </CardContent>
                </Card>
                
                {/* Average Score Card */}
                <Card className="bg-white dark:bg-gray-800 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart2 className="h-6 w-6 text-blue-500" />
                      <h3 className="text-xl font-medium">Average Score</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-4xl font-bold">{quizStats?.averageScore?.toFixed(1) || profile?.avgScore || 0}%</p>
                      <p className="text-muted-foreground">Across all quizzes</p>
                    </div>
                    <p className="mt-3 text-amber-500 flex items-center gap-1">
                      <Trophy className="h-4 w-4" /> Top score: {quizStats?.highestScore?.toFixed(1) || profile?.topScore || 0}%
                    </p>
                  </CardContent>
                </Card>
                
                {/* Study Time Card */}
                <Card className="bg-white dark:bg-gray-800 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-6 w-6 text-green-500" />
                      <h3 className="text-xl font-medium">Study Time</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-2xl font-bold">{quizStats?.totalTime ? formatTotalTime(quizStats.totalTime) : "0m"}</p>
                      <p className="text-muted-foreground">Total time spent</p>
                    </div>
                    <p className="mt-3 text-green-500 flex items-center gap-1">
                      <Clock className="h-4 w-4" /> Avg: {quizStats?.averageTime ? formatTimeTaken(quizStats.averageTime) : "0m"}
                    </p>
                  </CardContent>
                </Card>
                
                {/* Performance Trend Card */}
                <Card className="bg-white dark:bg-gray-800 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-6 w-6 text-purple-500" />
                      <h3 className="text-xl font-medium">Performance</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-2xl font-bold">{quizStats?.improvement > 0 ? '+' : ''}{quizStats?.improvement?.toFixed(1) || 0}%</p>
                      <p className="text-muted-foreground">Recent improvement</p>
                    </div>
                    <p className="mt-3 text-purple-500 flex items-center gap-1">
                      <ArrowUpRight className="h-4 w-4" /> Keep it up!
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mt-10 px-2 sm:px-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl xs:text-2xl font-bold flex items-center gap-2">
                <span className="text-primary">🏆</span> Achievements
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </div>
          
          {/* Recent Quiz Results */}
          <div className="mt-10 px-2 sm:px-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl xs:text-2xl font-bold flex items-center gap-2">
                <span className="text-primary">📊</span> Recent Quiz Results
              </h2>
              <Link 
                to="/quiz-history" 
                className="text-primary hover:underline flex items-center gap-1 text-sm"
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            {loadingResults ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-muted-foreground">Loading results...</span>
              </div>
            ) : recentResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentResults.map((result) => (
                  <Card key={result.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold line-clamp-1">
                          {result.quizTitle}
                        </CardTitle>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          result.score >= 80 ? 'bg-green-100 text-green-700' :
                          result.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {result.score.toFixed(1)}%
                        </div>
                      </div>
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {formatCompletionDate(result.completedAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Questions:</span>
                          <span className="font-medium">{result.correctAnswers}/{result.totalQuestions}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium">{formatTimeTaken(result.timeTaken)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Accuracy:</span>
                          <span className="font-medium">
                            {result.totalQuestions > 0 ? Math.round((result.correctAnswers / result.totalQuestions) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => navigate(`/quiz-history`)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Target className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">No Quiz Results Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start taking quizzes to see your results here!
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={() => navigate('/quizzes')}>
                        Take Your First Quiz
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          console.log('Manual refresh triggered');
                          fetchQuizData();
                        }}
                      >
                        Refresh Data
                      </Button>
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">
                      Debug: User ID: {user?.uid || 'Not logged in'}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Study Insights */}
          {quizStats && quizStats.totalQuizzes > 0 && (
            <div className="mt-10 px-2 sm:px-0">
              <h2 className="text-xl xs:text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-primary">💡</span> Study Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Brain className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-blue-800">Learning Pattern</h3>
                        <p className="text-sm text-blue-600">
                          {quizStats.averageScore >= 80 ? 'Excellent performance! Keep up the great work.' :
                           quizStats.averageScore >= 60 ? 'Good progress! Focus on areas of improvement.' :
                           'Keep practicing! Review difficult topics regularly.'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Zap className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-800">Study Efficiency</h3>
                        <p className="text-sm text-green-600">
                          {quizStats.averageTime < 300 ? 'Fast learner! You complete quizzes quickly.' :
                           quizStats.averageTime < 600 ? 'Balanced pace! Good time management.' :
                           'Take your time! Focus on accuracy over speed.'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <TargetIcon className="h-8 w-8 text-purple-600" />
                      <div>
                        <h3 className="font-semibold text-purple-800">Next Goal</h3>
                        <p className="text-sm text-purple-600">
                          {quizStats.totalQuizzes < 5 ? 'Complete 5 quizzes to unlock more features!' :
                           quizStats.averageScore < 80 ? 'Aim for 80% average score!' :
                           'Try to achieve a perfect score on your next quiz!'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="mt-10 px-2 sm:px-0">
            <h2 className="text-xl xs:text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-primary">⚡</span> Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-2 sm:p-3 bg-gradient-to-br from-primary/10 to-primary/5 border-none shadow-md">
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
                  <Button className="w-full h-8 text-sm py-1" onClick={() => navigateTo('/quizzes')}>Go</Button>
                </CardFooter>
              </Card>
              
              <Card className={`${cardAnimation} bg-gradient-to-br from-blue-100 to-blue-50 border-none shadow-md`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-6 w-6 text-blue-500" /> Upload Notes
                  </CardTitle>
                  <CardDescription>Share your notes with the community</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Help others by uploading your study notes and resources.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigateTo('/upload-notes')}>Go</Button>
                </CardFooter>
              </Card>
              
              <Card className={`${cardAnimation} bg-gradient-to-br from-green-100 to-green-50 border-none shadow-md`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookMarked className="h-6 w-6 text-green-600" /> View Notes
                  </CardTitle>
                  <CardDescription>Browse and download notes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Access notes uploaded by other users for your subjects.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigateTo('/view-notes')}>Go</Button>
                </CardFooter>
              </Card>
              
              <Card className={`${cardAnimation} bg-gradient-to-br from-yellow-100 to-yellow-50 border-none shadow-md`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-6 w-6 text-yellow-600" /> Quiz History
                  </CardTitle>
                  <CardDescription>Review your past quiz attempts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">See your previous quiz scores and progress over time.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigateTo('/quiz-history')}>Go</Button>
                </CardFooter>
              </Card>
              
              <Card className={`${cardAnimation} bg-gradient-to-br from-purple-100 to-purple-50 border-none shadow-md`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-purple-600" /> Leaderboard
                  </CardTitle>
                  <CardDescription>See how you rank</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Check your position on the leaderboard and compete with others.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigateTo('/leaderboard')}>Go</Button>
                </CardFooter>
              </Card>
              
              <Card className={`${cardAnimation} bg-gradient-to-br from-pink-100 to-pink-50 border-none shadow-md`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-6 w-6 text-pink-600" /> Notifications
                  </CardTitle>
                  <CardDescription>Stay updated</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Get the latest updates, reminders, and announcements.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigateTo('/notifications')}>Go</Button>
                </CardFooter>
              </Card>
              
              <Card className={`${cardAnimation} bg-gradient-to-br from-gray-100 to-gray-50 border-none shadow-md`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-6 w-6 text-gray-600" /> My Profile
                  </CardTitle>
                  <CardDescription>Manage your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Edit your profile details and preferences.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigateTo('/my-profile')}>Go</Button>
                </CardFooter>
              </Card>
              
              <Card className={`${cardAnimation} bg-gradient-to-br from-indigo-100 to-indigo-50 border-none shadow-md`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-6 w-6 text-indigo-600" /> Settings
                  </CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Adjust your app settings and preferences.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigateTo('/settings')}>Go</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserHub;
