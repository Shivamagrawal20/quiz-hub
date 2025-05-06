
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronRight, BookOpen, Upload, Clock, BarChart2, Trophy, Users, BookMarked, Settings, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Animation for card hover effect
const cardAnimation = "transition-all duration-300 hover:shadow-lg hover:-translate-y-1";

const UserHub = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("User");
  const [progress, setProgress] = useState(0);
  
  // Simulate loading state
  useEffect(() => {
    // Mock loading user data
    const timer = setTimeout(() => {
      setIsLoading(false);
      setUsername("John");
      
      // Animate progress
      const progressTimer = setTimeout(() => {
        setProgress(42); // 42% progress towards weekly goal
      }, 300);
      
      return () => clearTimeout(progressTimer);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Navigation functions
  const navigateTo = (path: string) => {
    navigate(path);
  };
  
  // Mock user stats
  const stats = {
    quizzesTaken: 12,
    totalQuizzes: 26,
    notesUploaded: 5,
    avgScore: 84,
    streak: 4,
    topScore: 92,
    achievementsUnlocked: 3,
    totalAchievements: 12,
    nextQuiz: "Cardiology"
  };

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
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">👋 Welcome back, {username}!</h1>
            <p className="text-muted-foreground">Your learning journey continues here.</p>
          </div>
          
          {/* Weekly Goal Stats Banner - Inspired by the image */}
          <Card className="mb-10 overflow-hidden bg-gradient-to-r from-violet-500 to-purple-500 text-white border-none shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <h2 className="text-3xl font-bold mb-2">Your goal this week: 3 quizzes</h2>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <p className="text-xl">You're {Math.round((stats.quizzesTaken % 3) / 3 * 100)}% there. Let's crush it! 💪</p>
                    <span className="px-4 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                      {stats.streak} day streak 🔥
                    </span>
                  </div>
                  
                  <Progress value={progress} className="h-3 bg-white/30" />
                </div>
                
                <div className="flex items-center justify-end gap-4">
                  <Button 
                    size="lg" 
                    className="bg-white text-violet-700 hover:bg-white/90 font-semibold text-lg px-6 shadow-lg"
                    onClick={() => navigateTo('/quiz/random')}
                  >
                    Start a Quiz Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="bg-transparent text-white border-white hover:bg-white/10 font-semibold"
                    onClick={() => navigateTo('/quizzes')}
                  >
                    View All Quizzes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Progress Card */}
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <BookMarked className="h-6 w-6 text-violet-500" />
                  <h3 className="text-xl font-medium">Progress</h3>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-5xl font-bold">{stats.quizzesTaken} <span className="text-2xl text-muted-foreground">/ {stats.totalQuizzes}</span></p>
                  <p className="text-muted-foreground">Quizzes completed</p>
                </div>
                <Progress value={(stats.quizzesTaken / stats.totalQuizzes) * 100} className="mt-3 h-2" />
              </CardContent>
            </Card>
            
            {/* Average Score */}
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart2 className="h-6 w-6 text-blue-500" />
                  <h3 className="text-xl font-medium">Average Score</h3>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-5xl font-bold">{stats.avgScore}%</p>
                  <p className="text-muted-foreground">Across all quizzes</p>
                </div>
                <p className="mt-3 text-amber-500 flex items-center gap-1">
                  <Trophy className="h-4 w-4" /> Top score: {stats.topScore}%
                </p>
              </CardContent>
            </Card>
            
            {/* Next Quiz */}
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-6 w-6 text-violet-500" />
                  <h3 className="text-xl font-medium">Next Quiz</h3>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-2xl font-bold">{stats.nextQuiz}</p>
                  <p className="text-muted-foreground">Ready to attempt</p>
                </div>
                <Link to="/quizzes" className="mt-3 text-violet-500 flex items-center hover:underline">
                  View all upcoming <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
            
            {/* Achievements */}
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-6 w-6 text-violet-500" />
                  <h3 className="text-xl font-medium">Achievements</h3>
                </div>
                <div className="flex gap-2 my-2">
                  <div className="rounded-full p-2 bg-violet-100 text-violet-500 dark:bg-violet-900/30">
                    <Award className="h-6 w-6" />
                  </div>
                  <div className="rounded-full p-2 bg-amber-100 text-amber-500 dark:bg-amber-900/30">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div className="rounded-full p-2 bg-blue-100 text-blue-500 dark:bg-blue-900/30">
                    <Award className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">{stats.achievementsUnlocked}/{stats.totalAchievements}</p>
                  <p className="text-muted-foreground">Achievements unlocked</p>
                </div>
                <Link to="/achievements" className="mt-3 text-violet-500 flex items-center hover:underline">
                  View all achievements <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Navigation Cards */}
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Take Quiz Card */}
            <Card className={`${cardAnimation} bg-white border-l-4 border-l-primary dark:bg-gray-800 dark:border-l-violet-500`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary dark:text-violet-400" />
                  Take Quiz
                </CardTitle>
                <CardDescription>Practice your knowledge with our quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Choose from a variety of quizzes in different subjects and topics.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => navigateTo('/quizzes')}>
                  Browse Quizzes <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* Upload Notes Card */}
            <Card className={`${cardAnimation} bg-white border-l-4 border-l-blue-500 dark:bg-gray-800`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-6 w-6 text-blue-500" />
                  Upload Notes
                </CardTitle>
                <CardDescription>Share your study notes with the community</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Upload and organize your notes to help others and earn points.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20" onClick={() => navigateTo('/notes/upload')}>
                  Upload Notes <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* View Notes Card */}
            <Card className={`${cardAnimation} bg-white border-l-4 border-l-emerald-500 dark:bg-gray-800`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-emerald-500" />
                  View Notes
                </CardTitle>
                <CardDescription>Access study materials from the community</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Browse and search through notes shared by other students.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/20" onClick={() => navigateTo('/notes')}>
                  Browse Notes <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* Quiz History Card */}
            <Card className={`${cardAnimation} bg-white border-l-4 border-l-amber-500 dark:bg-gray-800`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-amber-500" />
                  Quiz History
                </CardTitle>
                <CardDescription>Review your past quiz attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  See your performance history and review previous quiz attempts.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/20" onClick={() => navigateTo('/history')}>
                  View History <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* Dashboard Card */}
            <Card className={`${cardAnimation} bg-white border-l-4 border-l-violet-500 dark:bg-gray-800`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-6 w-6 text-violet-500" />
                  Dashboard
                </CardTitle>
                <CardDescription>View your detailed performance analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Access comprehensive stats, progress tracking, and insights.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-violet-200 text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-400 dark:hover:bg-violet-900/20" onClick={() => navigateTo('/dashboard')}>
                  Go to Dashboard <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* Leaderboard Card */}
            <Card className={`${cardAnimation} bg-white border-l-4 border-l-rose-500 dark:bg-gray-800`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-rose-500" />
                  Leaderboard
                </CardTitle>
                <CardDescription>See how you rank among other students</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Check the rankings and compete with other students.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/20" onClick={() => navigateTo('/leaderboard')}>
                  View Leaderboard <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Community Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Community</h2>
            <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/90">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-medium mb-2">Connect with Other Students</h3>
                    <p className="text-muted-foreground mb-4 md:mb-0">
                      Join study groups, discuss topics, and collaborate with peers.
                    </p>
                  </div>
                  <Button className="flex items-center gap-2" onClick={() => navigateTo('/community')}>
                    <Users className="h-4 w-4" />
                    Explore Community
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Quick Settings</h2>
            <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/90">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-medium mb-2">Manage Your Account</h3>
                    <p className="text-muted-foreground mb-4 md:mb-0">
                      Update profile, change password, and adjust preferences.
                    </p>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2" onClick={() => navigateTo('/settings')}>
                    <Settings className="h-4 w-4" />
                    Profile Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserHub;
