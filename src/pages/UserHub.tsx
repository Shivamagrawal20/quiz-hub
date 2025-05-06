
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronRight, BookOpen, Upload, Clock, BarChart2, Trophy, Users } from "lucide-react";

// Animation for card hover effect
const cardAnimation = "transition-all duration-300 hover:shadow-lg hover:-translate-y-1";

const UserHub = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Navigation functions
  const navigateTo = (path: string) => {
    navigate(path);
  };
  
  // Mock user stats
  const stats = {
    quizzesTaken: 14,
    notesUploaded: 5,
    avgScore: 82,
    rank: 42
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
      
      <main className="flex-grow pt-20 pb-16 bg-gradient-to-b from-secondary/10 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to Your QuizHub</h1>
            <p className="text-muted-foreground">What would you like to do today?</p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <p className="text-muted-foreground text-sm">Quizzes Taken</p>
                <p className="text-3xl font-bold">{stats.quizzesTaken}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <p className="text-muted-foreground text-sm">Notes Uploaded</p>
                <p className="text-3xl font-bold">{stats.notesUploaded}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <p className="text-muted-foreground text-sm">Average Score</p>
                <p className="text-3xl font-bold">{stats.avgScore}%</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <p className="text-muted-foreground text-sm">Current Rank</p>
                <p className="text-3xl font-bold">#{stats.rank}</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Take Quiz Card */}
            <Card className={`${cardAnimation} bg-white border-l-4 border-l-primary`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" />
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
            <Card className={`${cardAnimation} bg-white border-l-4 border-l-blue-500`}>
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
                <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => navigateTo('/notes/upload')}>
                  Upload Notes <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* View Notes Card */}
            <Card className={`${cardAnimation} bg-white border-l-4 border-l-emerald-500`}>
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
                <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => navigateTo('/notes')}>
                  Browse Notes <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* Quiz History Card */}
            <Card className={`${cardAnimation} bg-white border-l-4 border-l-amber-500`}>
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
                <Button variant="outline" className="w-full border-amber-200 text-amber-700 hover:bg-amber-50" onClick={() => navigateTo('/history')}>
                  View History <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* Dashboard Card */}
            <Card className={`${cardAnimation} bg-white border-l-4 border-l-violet-500`}>
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
                <Button variant="outline" className="w-full border-violet-200 text-violet-700 hover:bg-violet-50" onClick={() => navigateTo('/dashboard')}>
                  Go to Dashboard <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* Leaderboard Card */}
            <Card className={`${cardAnimation} bg-white border-l-4 border-l-rose-500`}>
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
                <Button variant="outline" className="w-full border-rose-200 text-rose-700 hover:bg-rose-50" onClick={() => navigateTo('/leaderboard')}>
                  View Leaderboard <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Community Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Community</h2>
            <Card className="bg-white/80 backdrop-blur-sm">
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserHub;
