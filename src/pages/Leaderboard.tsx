
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Medal, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

const Leaderboard = () => {
  // Sample user data for leaderboard
  const users = [
    {
      id: "1",
      name: "Alex Johnson",
      username: "alex_j",
      avatar: "",
      points: 1240,
      quizzesTaken: 24,
      avgScore: 92,
      rank: 1,
      badge: "gold",
    },
    {
      id: "2",
      name: "Samantha Williams",
      username: "sam_will",
      avatar: "",
      points: 980,
      quizzesTaken: 18,
      avgScore: 88,
      rank: 2,
      badge: "silver",
    },
    {
      id: "3",
      name: "Michael Chen",
      username: "mike_c",
      avatar: "",
      points: 870,
      quizzesTaken: 20,
      avgScore: 84,
      rank: 3,
      badge: "bronze",
    },
    {
      id: "4",
      name: "Emily Rodriguez",
      username: "em_rod",
      avatar: "",
      points: 750,
      quizzesTaken: 15,
      avgScore: 82,
      rank: 4,
    },
    {
      id: "5",
      name: "David Kim",
      username: "dk_2000",
      avatar: "",
      points: 720,
      quizzesTaken: 16,
      avgScore: 78,
      rank: 5,
    },
    {
      id: "6",
      name: "Sophia Patel",
      username: "s_patel",
      avatar: "",
      points: 690,
      quizzesTaken: 14,
      avgScore: 80,
      rank: 6,
    },
    {
      id: "7",
      name: "James Wilson",
      username: "jwilson",
      avatar: "",
      points: 650,
      quizzesTaken: 12,
      avgScore: 76,
      rank: 7,
    },
    {
      id: "current",
      name: "You",
      username: "current_user",
      avatar: "",
      points: 580,
      quizzesTaken: 10,
      avgScore: 79,
      rank: 14,
      isCurrent: true,
    }
  ];
  
  // Get the badge color based on rank
  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case "gold": return "bg-yellow-500 text-black";
      case "silver": return "bg-gray-300 text-black";
      case "bronze": return "bg-amber-700 text-white";
      default: return "bg-primary/20 text-primary";
    }
  };
  
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="text-sm font-semibold">{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showInDashboard={true} />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link to="/userhub" className="inline-flex items-center text-primary hover:underline mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hub
            </Link>
            
            <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
            <p className="text-muted-foreground mb-6">See how you rank among other quiz takers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Position</CardTitle>
                <CardDescription>Overall ranking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <span className="text-3xl font-bold">14</span>
                  <Badge variant="outline" className="ml-2">Top 15%</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Points</CardTitle>
                <CardDescription>Total points earned</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center">
                <span className="text-3xl font-bold">580</span>
                <TrendingUp className="h-5 w-5 text-green-500 ml-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Users</CardTitle>
                <CardDescription>This week</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center">
                <span className="text-3xl font-bold">185</span>
                <Users className="h-5 w-5 text-primary ml-2" />
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="global" className="w-full">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="global" className="flex-1 md:flex-none">Global Rankings</TabsTrigger>
              <TabsTrigger value="weekly" className="flex-1 md:flex-none">Weekly Leaders</TabsTrigger>
              <TabsTrigger value="friends" className="flex-1 md:flex-none">Friends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="global" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted/30">
                        <tr>
                          <th className="px-4 py-3">Rank</th>
                          <th className="px-4 py-3">User</th>
                          <th className="px-4 py-3 text-right">Points</th>
                          <th className="px-4 py-3 text-center hidden md:table-cell">Quizzes</th>
                          <th className="px-4 py-3 text-center hidden md:table-cell">Avg. Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr 
                            key={user.id} 
                            className={`${user.isCurrent ? 'bg-primary/5 border-l-4 border-primary' : 'even:bg-muted/20'} hover:bg-muted/30`}
                          >
                            <td className="px-4 py-4 font-medium w-[50px]">
                              <div className="flex justify-center items-center w-8 h-8 rounded-full bg-muted/30">
                                {getMedalIcon(user.rank)}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback className={user.isCurrent ? "bg-primary text-white" : ""}>
                                    {user.name.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-muted-foreground text-xs">@{user.username}</div>
                                </div>
                                {user.badge && (
                                  <Badge className={`ml-2 ${getBadgeColor(user.badge)}`}>
                                    {user.badge.charAt(0).toUpperCase() + user.badge.slice(1)}
                                  </Badge>
                                )}
                                {user.isCurrent && (
                                  <Badge variant="outline" className="ml-2">You</Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right font-semibold">{user.points.toLocaleString()}</td>
                            <td className="px-4 py-4 text-center hidden md:table-cell">{user.quizzesTaken}</td>
                            <td className="px-4 py-4 text-center hidden md:table-cell">{user.avgScore}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="weekly" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Leaders</CardTitle>
                  <CardDescription>Rankings for the current week (May 1-7, 2025)</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8">Weekly leaderboard will be updated at the end of the week</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="friends" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Friends Leaderboard</CardTitle>
                  <CardDescription>See how you compare with your friends</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8">Connect with friends to see your personalized leaderboard</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
