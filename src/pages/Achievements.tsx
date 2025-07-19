import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Star, 
  Award, 
  Medal, 
  Crown, 
  Zap, 
  Target, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  Flame, 
  Brain,
  CheckCircle,
  Lock,
  ArrowLeft,
  Filter,
  Search,
  Sparkles,
  Calendar,
  Users,
  BookMarked,
  Activity,
  BarChart3,
  Timer,
  Lightbulb,
  Heart,
  Shield,
  Rocket,
  Gem,
  Palette,
  Music,
  Camera,
  Gamepad2,
  Code,
  Globe,
  Leaf,
  Coffee,
  Pizza,
  Sun,
  Moon,
  Cloud,
  Rainbow
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserQuizHistory } from "@/lib/quizFirestore";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUserAchievements, getUserBadges, checkAndUpdateAchievements, checkAndUpdateBadges } from "@/lib/achievementSystem";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconComponent: any;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt?: Date;
  requirements: string[];
  rewards?: {
    points?: number;
    title?: string;
    special?: string;
  };
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: Date;
  category: string;
}

const Achievements = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("achievements");

  // Icon mapping for achievements
  const iconMap: Record<string, any> = {
    'trophy': Trophy,
    'star': Star,
    'award': Award,
    'medal': Medal,
    'crown': Crown,
    'zap': Zap,
    'target': Target,
    'trending': TrendingUp,
    'clock': Clock,
    'book': BookOpen,
    'flame': Flame,
    'brain': Brain,
    'calendar': Calendar,
    'users': Users,
    'bookmarked': BookMarked,
    'activity': Activity,
    'chart': BarChart3,
    'timer': Timer,
    'lightbulb': Lightbulb,
    'heart': Heart,
    'shield': Shield,
    'rocket': Rocket,
    'gem': Gem,
    'palette': Palette,
    'music': Music,
    'camera': Camera,
    'gamepad': Gamepad2,
    'code': Code,
    'globe': Globe,
    'leaf': Leaf,
    'coffee': Coffee,
    'pizza': Pizza,
    'sun': Sun,
    'moon': Moon,
    'cloud': Cloud,
    'rainbow': Rainbow
  };

  // Fetch user data and generate achievements/badges
  const fetchUserData = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get achievements and badges from the achievement system
      const [userAchievements, userBadges] = await Promise.all([
        getUserAchievements(user.uid),
        getUserBadges(user.uid)
      ]);
      
      // Check and update achievements based on current progress
      const achievementResult = await checkAndUpdateAchievements(user.uid);
      const badgeResult = await checkAndUpdateBadges(user.uid);
      
      setAchievements(achievementResult.updatedAchievements);
      console.log('Loaded badges:', badgeResult.updatedBadges);
      setBadges(badgeResult.updatedBadges);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load achievements data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchUserData();
  }, [user?.uid]);

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || achievement.category === categoryFilter;
    const matchesRarity = rarityFilter === "all" || achievement.rarity === rarityFilter;
    return matchesSearch && matchesCategory && matchesRarity;
  });

  const filteredBadges = badges.filter(badge => {
    const matchesSearch = badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         badge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || badge.category === categoryFilter;
    const matchesRarity = rarityFilter === "all" || badge.rarity === rarityFilter;
    return matchesSearch && matchesCategory && matchesRarity;
  });

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const unlockedBadges = badges.filter(b => b.unlocked);
  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-200';
      case 'rare': return 'border-blue-200';
      case 'epic': return 'border-purple-200';
      case 'legendary': return 'border-yellow-200';
      default: return 'border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'participation': return 'bg-green-100 text-green-800';
      case 'performance': return 'bg-blue-100 text-blue-800';
      case 'efficiency': return 'bg-orange-100 text-orange-800';
      case 'consistency': return 'bg-purple-100 text-purple-800';
      case 'mastery': return 'bg-red-100 text-red-800';
      case 'special': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading achievements...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
              <Trophy className="h-10 w-10 text-yellow-500" />
              Achievements & Badges
              <Sparkles className="h-8 w-8 text-purple-500" />
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your progress, unlock achievements, and collect badges as you master your subjects
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-blue-600">{unlockedAchievements.length}</div>
              <div className="text-sm text-muted-foreground">Achievements Unlocked</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-green-600">{unlockedBadges.length}</div>
              <div className="text-sm text-muted-foreground">Badges Collected</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-purple-600">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-orange-600">
                {achievements.length > 0 ? Math.round((unlockedAchievements.length / achievements.length) * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search achievements and badges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="participation">Participation</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="efficiency">Efficiency</SelectItem>
              <SelectItem value="consistency">Consistency</SelectItem>
              <SelectItem value="special">Special</SelectItem>
            </SelectContent>
          </Select>
          <Select value={rarityFilter} onValueChange={setRarityFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rarities</SelectItem>
              <SelectItem value="common">Common</SelectItem>
              <SelectItem value="rare">Rare</SelectItem>
              <SelectItem value="epic">Epic</SelectItem>
              <SelectItem value="legendary">Legendary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Achievements ({unlockedAchievements.length}/{achievements.length})
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Badges ({unlockedBadges.length}/{badges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-6">
            {filteredAchievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAchievements.map((achievement) => {
                  const IconComponent = achievement.iconComponent;
                  return (
                    <Card 
                      key={achievement.id} 
                      className={`transition-all duration-300 hover:shadow-lg ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200' 
                          : 'bg-gray-50 border-gray-200'
                      } ${getRarityBorder(achievement.rarity)}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`text-3xl ${achievement.unlocked ? 'animate-bounce' : 'opacity-50'}`}>
                              {achievement.icon}
                            </div>
                            <div>
                              <CardTitle className={`text-lg ${achievement.unlocked ? 'text-amber-800' : 'text-gray-600'}`}>
                                {achievement.title}
                              </CardTitle>
                              <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                                {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          {achievement.unlocked && (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                          </div>
                          <Progress 
                            value={(achievement.progress / achievement.maxProgress) * 100} 
                            className="h-2" 
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Requirements:</div>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {achievement.requirements.map((req, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  achievement.unlocked ? 'bg-green-500' : 'bg-gray-300'
                                }`} />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {achievement.unlocked && achievement.rewards && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="text-sm font-medium text-green-800 mb-2">Rewards:</div>
                            <div className="space-y-1 text-xs text-green-700">
                              {achievement.rewards.points && (
                                <div>🎯 {achievement.rewards.points} points</div>
                              )}
                              {achievement.rewards.title && (
                                <div>👑 {achievement.rewards.title} title</div>
                              )}
                              {achievement.rewards.special && (
                                <div>✨ {achievement.rewards.special}</div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <div className="text-sm text-muted-foreground">
                            {achievement.points} points
                          </div>
                          {achievement.unlocked && (
                            <Badge variant="secondary" className="text-xs">
                              Unlocked!
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No achievements found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            {filteredBadges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBadges.map((badge) => {
                  const IconComponent = badge.icon;
                  return (
                    <Card 
                      key={badge.id} 
                      className={`transition-all duration-300 hover:shadow-lg ${
                        badge.unlocked 
                          ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' 
                          : 'bg-gray-50 border-gray-200'
                      } ${getRarityBorder(badge.rarity)}`}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className={`text-lg ${badge.unlocked ? 'text-blue-800' : 'text-gray-600'}`}>
                              {badge.name}
                            </CardTitle>
                            <div className="flex gap-2 mt-2">
                              <Badge className={`text-xs ${getRarityColor(badge.rarity)}`}>
                                {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                              </Badge>
                              <Badge className={`text-xs ${getCategoryColor(badge.category)}`}>
                                {badge.category.charAt(0).toUpperCase() + badge.category.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          {badge.unlocked && (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        {/* Badge Image Section - Direct display */}
                        <div className="flex justify-center">
                          {badge.imagePath ? (
                            <div className={`transition-all duration-300 ${
                              badge.unlocked 
                                ? 'ring-4 ring-green-200 scale-105' 
                                : 'ring-2 ring-gray-200 opacity-60'
                            }`}>
                              <img 
                                src={badge.imagePath} 
                                alt={badge.name}
                                className="h-32 w-32 object-contain drop-shadow-lg"
                                onError={(e) => {
                                  console.error(`Failed to load badge image: ${badge.imagePath}`, e);
                                  // Fallback to icon if image fails to load
                                  if (IconComponent) {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextSibling?.classList.remove('hidden');
                                  }
                                }}
                                onLoad={(e) => {
                                  console.log(`Successfully loaded badge image: ${badge.imagePath}`);
                                  // Hide icon when image loads successfully
                                  if (IconComponent) {
                                    e.currentTarget.nextSibling?.classList.add('hidden');
                                  }
                                }}
                              />
                              {/* Fallback icon (hidden by default) */}
                              {IconComponent && (
                                <div className={`w-32 h-32 ${badge.color} rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hidden ${
                                  badge.unlocked 
                                    ? 'ring-4 ring-green-200 scale-105' 
                                    : 'ring-2 ring-gray-200 opacity-60'
                                }`}>
                                  <IconComponent className="h-16 w-16 text-white" />
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className={`w-32 h-32 ${badge.color} rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                              badge.unlocked 
                                ? 'ring-4 ring-green-200 scale-105' 
                                : 'ring-2 ring-gray-200 opacity-60'
                            }`}>
                              {IconComponent && (
                                <IconComponent className="h-16 w-16 text-white" />
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Badge Description */}
                        <div className="text-center px-2">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {badge.description}
                          </p>
                        </div>
                        
                        {/* Status */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="text-xs text-muted-foreground">
                            {badge.unlocked ? 'Unlocked' : 'Locked'}
                          </div>
                          {badge.unlocked && (
                            <Badge variant="secondary" className="text-xs">
                              Unlocked!
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No badges found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Achievements; 