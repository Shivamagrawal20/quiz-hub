
import { useState, useEffect } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Medal, Trophy, Star, Award, ArrowUp, ArrowDown, EqualIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

// Mock leaderboard data
const leaderboardData = [
  {
    id: "1",
    name: "Alex Johnson",
    avatarUrl: null,
    points: 2450,
    rank: 1,
    badge: "gold",
    change: "up"
  },
  {
    id: "2",
    name: "Sarah Williams",
    avatarUrl: null,
    points: 2340,
    rank: 2,
    badge: "gold",
    change: "same"
  },
  {
    id: "3",
    name: "Robert Chen",
    avatarUrl: null,
    points: 2290,
    rank: 3,
    badge: "gold",
    change: "up"
  },
  {
    id: "4",
    name: "Emma Davis",
    avatarUrl: null,
    points: 2150,
    rank: 4,
    badge: "silver",
    change: "down"
  },
  {
    id: "5",
    name: "Michael Brown",
    avatarUrl: null,
    points: 2020,
    rank: 5,
    badge: "silver",
    change: "up"
  },
  {
    id: "6",
    name: "Sophie Miller",
    avatarUrl: null,
    points: 1980,
    rank: 6,
    badge: "silver",
    change: "down"
  },
  {
    id: "7",
    name: "John Doe",
    avatarUrl: null,
    points: 1280,
    rank: 42,
    badge: "bronze",
    change: "up",
    isCurrentUser: true
  }
];

// Helper function to show badge icon based on rank
const BadgeIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Trophy className="h-5 w-5 text-amber-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
  if (rank === 3) return <Award className="h-5 w-5 text-amber-700" />;
  return null;
};

// Helper function to show change icon
const ChangeIcon = ({ change }: { change: string }) => {
  if (change === "up") return <ArrowUp className="h-3 w-3 text-green-500" />;
  if (change === "down") return <ArrowDown className="h-3 w-3 text-red-500" />;
  return <EqualIcon className="h-3 w-3 text-gray-500" />;
};

export function Leaderboard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [progressValue, setProgressValue] = useState(0);
  
  // Simulating data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setProgressValue(100);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Find the current user
  const currentUser = leaderboardData.find(user => user.isCurrentUser);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            Leaderboard
          </CardTitle>
          <CardDescription>
            See how you rank against other students.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground animate-pulse">Loading leaderboard data...</p>
              <Progress value={progressValue} className="h-2 transition-all duration-1000" />
            </div>
          ) : (
            <>
              {currentUser && (
                <Card className="mb-6 border-2 border-primary/20 bg-primary/5">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Your Current Position</CardTitle>
                  </CardHeader>
                  <CardContent className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                          {currentUser.rank}
                        </div>
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                          <AvatarImage src={currentUser.avatarUrl || undefined} alt={currentUser.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {currentUser.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{currentUser.name}</p>
                          <div className="flex items-center gap-1 text-xs">
                            <span>{currentUser.points} points</span>
                            <ChangeIcon change={currentUser.change} />
                          </div>
                        </div>
                      </div>
                      <Badge variant={currentUser.badge as any} className="uppercase">
                        {currentUser.badge}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                      <TableHead className="w-16 text-right">Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboardData
                      .filter(user => user.rank <= 10 || user.isCurrentUser) // Only show top 10 + current user
                      .map((user) => (
                        <TableRow 
                          key={user.id}
                          className={
                            user.isCurrentUser 
                              ? "bg-primary/5 border-l-2 border-primary" 
                              : "hover:bg-secondary/20"
                          }
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-1">
                              {user.rank}
                              <BadgeIcon rank={user.rank} />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                                <AvatarFallback>
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span>{user.name}</span>
                              {user.isCurrentUser && (
                                <Badge variant="outline" className="text-xs">You</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {user.points}
                          </TableCell>
                          <TableCell className="text-right">
                            <ChangeIcon change={user.change} />
                          </TableCell>
                        </TableRow>
                    ))}
                    
                    {currentUser && currentUser.rank > 10 && (
                      <TableRow className="text-muted-foreground">
                        <TableCell colSpan={4} className="text-center py-2">
                          <div className="flex items-center justify-center gap-1">
                            <span>•••</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between items-center border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Updated every 24 hours
          </p>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Coming Soon!", description: "More detailed leaderboard statistics will be available in the future." })}>
            View Details
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-6 w-6 text-amber-500" />
            Achievements
          </CardTitle>
          <CardDescription>
            Unlock achievements by completing quizzes and challenges.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-muted mb-4">
            <Trophy className="h-12 w-12 text-muted-foreground/40" />
          </div>
          <h3 className="text-xl font-bold mb-2">Coming Soon!</h3>
          <p className="text-muted-foreground max-w-md">
            We're working on an achievements system to reward your progress and quiz performance. Stay tuned for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
