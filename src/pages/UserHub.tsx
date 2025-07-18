import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronRight, BookOpen, Upload, Clock, BarChart2, Trophy, Users, BookMarked, Settings, Award, History, Bell, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { UserSettings } from "@/components/dashboard/UserSettings";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";

// Animation for card hover effect
const cardAnimation = "transition-all duration-300 hover:shadow-lg hover:-translate-y-1";

const UserHub = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false); // just for loading spinner if needed
  const [progress, setProgress] = useState(0);
  
  // Simulate loading state
  useEffect(() => {
    // Mock loading user data
    const timer = setTimeout(() => {
      setIsLoading(false);
      // setUsername("John"); // This line is removed as per the edit hint
      
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
  // const stats = {
  //   quizzesTaken: 12,
  //   totalQuizzes: 26,
  //   notesUploaded: 5,
  //   avgScore: 84,
  //   streak: 4,
  //   topScore: 92,
  //   achievementsUnlocked: 3,
  //   totalAchievements: 12,
  //   nextQuiz: "Cardiology"
  // };

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
          {/* Stats & Progress */}
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
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
                {/* Progress, Average Score, Next Quiz, Achievements cards */}
                <Card className="bg-white dark:bg-gray-800 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <BookMarked className="h-6 w-6 text-violet-500" />
                      <h3 className="text-xl font-medium">Progress</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-4xl font-bold">{profile?.quizzesTaken || 0} <span className="text-xl text-muted-foreground">/ {profile?.totalQuizzes || 0}</span></p>
                      <p className="text-muted-foreground">Quizzes completed</p>
                    </div>
                    <Progress value={profile && profile.totalQuizzes ? (profile.quizzesTaken || 0) / profile.totalQuizzes * 100 : 0} className="mt-3 h-2" />
                  </CardContent>
                </Card>
                <Card className="bg-white dark:bg-gray-800 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart2 className="h-6 w-6 text-blue-500" />
                      <h3 className="text-xl font-medium">Average Score</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-4xl font-bold">{profile?.avgScore || 0}%</p>
                      <p className="text-muted-foreground">Across all quizzes</p>
                    </div>
                    <p className="mt-3 text-amber-500 flex items-center gap-1">
                      <Trophy className="h-4 w-4" /> Top score: {profile?.topScore || 0}%
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white dark:bg-gray-800 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-6 w-6 text-violet-500" />
                      <h3 className="text-xl font-medium">Next Quiz</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-2xl font-bold">{profile?.nextQuiz || "-"}</p>
                      <p className="text-muted-foreground">Ready to attempt</p>
                    </div>
                    <Link to="/quizzes" className="mt-3 text-violet-500 flex items-center hover:underline">
                      View all upcoming <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </CardContent>
                </Card>
                <Card className="bg-white dark:bg-gray-800 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-6 w-6 text-yellow-500" />
                      <h3 className="text-xl font-medium">Achievements</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-4xl font-bold">{profile?.achievementsUnlocked || 0} <span className="text-xl text-muted-foreground">/ {profile?.totalAchievements || 0}</span></p>
                      <p className="text-muted-foreground">Unlocked</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          {/* Quick Actions - now below stats */}
          <div className="mt-10 px-2 sm:px-0">
            <h2 className="text-xl xs:text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-primary">⚡</span> Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Example of a more compact card: */}
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
                  <Button className="w-full h-8 text-sm py-1">Go</Button>
                </CardFooter>
              </Card>
              <Card className={`${cardAnimation} bg-gradient-to-br from-blue-100 to-blue-50 border-none shadow-md`}> <CardHeader><CardTitle className="flex items-center gap-2"><Upload className="h-6 w-6 text-blue-500" /> Upload Notes</CardTitle><CardDescription>Share your notes with the community</CardDescription></CardHeader><CardContent><p className="text-sm">Help others by uploading your study notes and resources.</p></CardContent><CardFooter><Button className="w-full" onClick={() => navigateTo('/upload-notes')}>Go</Button></CardFooter></Card>
              <Card className={`${cardAnimation} bg-gradient-to-br from-green-100 to-green-50 border-none shadow-md`}> <CardHeader><CardTitle className="flex items-center gap-2"><BookMarked className="h-6 w-6 text-green-600" /> View Notes</CardTitle><CardDescription>Browse and download notes</CardDescription></CardHeader><CardContent><p className="text-sm">Access notes uploaded by other users for your subjects.</p></CardContent><CardFooter><Button className="w-full" onClick={() => navigateTo('/view-notes')}>Go</Button></CardFooter></Card>
              <Card className={`${cardAnimation} bg-gradient-to-br from-yellow-100 to-yellow-50 border-none shadow-md`}> <CardHeader><CardTitle className="flex items-center gap-2"><History className="h-6 w-6 text-yellow-600" /> Quiz History</CardTitle><CardDescription>Review your past quiz attempts</CardDescription></CardHeader><CardContent><p className="text-sm">See your previous quiz scores and progress over time.</p></CardContent><CardFooter><Button className="w-full" onClick={() => navigateTo('/quiz-history')}>Go</Button></CardFooter></Card>
              <Card className={`${cardAnimation} bg-gradient-to-br from-purple-100 to-purple-50 border-none shadow-md`}> <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-6 w-6 text-purple-600" /> Leaderboard</CardTitle><CardDescription>See how you rank</CardDescription></CardHeader><CardContent><p className="text-sm">Check your position on the leaderboard and compete with others.</p></CardContent><CardFooter><Button className="w-full" onClick={() => navigateTo('/leaderboard')}>Go</Button></CardFooter></Card>
              <Card className={`${cardAnimation} bg-gradient-to-br from-pink-100 to-pink-50 border-none shadow-md`}> <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-6 w-6 text-pink-600" /> Notifications</CardTitle><CardDescription>Stay updated</CardDescription></CardHeader><CardContent><p className="text-sm">Get the latest updates, reminders, and announcements.</p></CardContent><CardFooter><Button className="w-full" onClick={() => navigateTo('/notifications')}>Go</Button></CardFooter></Card>
              <Card className={`${cardAnimation} bg-gradient-to-br from-gray-100 to-gray-50 border-none shadow-md`}> <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-6 w-6 text-gray-600" /> My Profile</CardTitle><CardDescription>Manage your account</CardDescription></CardHeader><CardContent><p className="text-sm">Edit your profile details and preferences.</p></CardContent><CardFooter><Button className="w-full" onClick={() => navigateTo('/my-profile')}>Go</Button></CardFooter></Card>
              <Card className={`${cardAnimation} bg-gradient-to-br from-indigo-100 to-indigo-50 border-none shadow-md`}> <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-6 w-6 text-indigo-600" /> Settings</CardTitle><CardDescription>Customize your experience</CardDescription></CardHeader><CardContent><p className="text-sm">Adjust your app settings and preferences.</p></CardContent><CardFooter><Button className="w-full" onClick={() => navigateTo('/settings')}>Go</Button></CardFooter></Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserHub;
