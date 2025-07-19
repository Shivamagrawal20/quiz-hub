import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuizCard from "@/components/QuizCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Tag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getQuizzesForUsers } from "@/lib/quizFirestore";
import { useToast } from "@/hooks/use-toast";

const QuizSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [creatorFilter, setCreatorFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, role } = useAuth();
  const { toast } = useToast();
  
  // Fetch quizzes from Firestore
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!isLoggedIn) return;
      
      setLoadingQuizzes(true);
      try {
        const fetchedQuizzes = await getQuizzesForUsers(role);
        setQuizzes(fetchedQuizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        toast({
          title: "Error loading quizzes",
          description: "Failed to load quizzes. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoadingQuizzes(false);
      }
    };
    
    fetchQuizzes();
  }, [isLoggedIn, role, toast]);
  
  // Redirect logged in users to the Quizzes page
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/quizzes");
    }
  }, [isLoggedIn, navigate]);
  
  // Get unique values for filters
  const categories = [...new Set(quizzes.map(quiz => quiz.category || quiz.tags?.[0] || 'General'))];
  const subjects = [...new Set(quizzes.map(quiz => quiz.subject || quiz.tags?.[1] || 'General'))];
  const creators = [...new Set(quizzes.map(quiz => quiz.creator || 'Admin'))];
  
  // Get all unique tags
  const allTags = [...new Set(quizzes.flatMap(quiz => quiz.tags || []))];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  // Filter quizzes based on search, filters, and tabs
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          quiz.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || (quiz.category || quiz.tags?.[0]) === categoryFilter;
    const matchesSubject = subjectFilter === "all" || (quiz.subject || quiz.tags?.[1]) === subjectFilter;
    const matchesDifficulty = difficultyFilter === "all" || quiz.difficulty === difficultyFilter;
    const matchesCreator = creatorFilter === "all" || (quiz.creator || 'Admin') === creatorFilter;
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => (quiz.tags || []).includes(tag));
    
    // Tab filtering
    const matchesTab = activeTab === "all" || 
                      (activeTab === "recommended" && ["Mathematics", "Science"].includes(quiz.category || quiz.tags?.[0])) ||
                      (activeTab === "trending" && quiz.difficulty === "medium");
    
    return matchesSearch && matchesCategory && matchesSubject && matchesDifficulty && 
           matchesCreator && matchesTags && matchesTab;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="bg-secondary/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Quiz Section</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              Browse through our collection of quizzes designed for various subjects and difficulty levels. Find the perfect quiz to test your knowledge.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <Button 
                variant="default" 
                className="px-6"
                onClick={() => navigate("/signin")}
              >
                Sign In for More Features
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/signup")}
              >
                Create Account
              </Button>
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="bg-background/60 backdrop-blur-sm">
                <TabsTrigger value="all">All Quizzes</TabsTrigger>
                <TabsTrigger value="recommended">Featured</TabsTrigger>
                <TabsTrigger value="trending">Popular</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search quizzes..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Category" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Subject" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={creatorFilter} onValueChange={setCreatorFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Creator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Creators</SelectItem>
                      {creators.map(creator => (
                        <SelectItem key={creator} value={creator}>{creator}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {allTags.map(tag => (
                    <Badge 
                      key={tag} 
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setCategoryFilter("all");
                      setSubjectFilter("all");
                      setDifficultyFilter("all");
                      setCreatorFilter("all");
                      setSelectedTags([]);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {loadingQuizzes ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Loading quizzes...</h3>
              <p className="text-muted-foreground">
                Please wait while we fetch the available quizzes.
              </p>
            </div>
          ) : filteredQuizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {filteredQuizzes.map(quiz => (
                  <QuizCard 
                    key={quiz.id} 
                    id={quiz.id}
                    title={quiz.title || 'Untitled Quiz'} 
                    description={quiz.description || 'No description available'}
                    questionCount={quiz.questions?.length || quiz.questionCount || 0}
                    category={quiz.category || quiz.tags?.[0] || 'General'}
                    difficulty={quiz.difficulty || 'medium'}
                    estimatedTime={quiz.estimatedTime?.formatted}
                    tags={quiz.tags}
                    creator={quiz.creator}
                    visibility={quiz.visibility}
                  />
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No quizzes found</h3>
              <p className="text-muted-foreground">
                {!isLoggedIn 
                  ? "Please sign in to view available quizzes."
                  : "Try adjusting your search or filters to find more quizzes."
                }
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default QuizSection;
