import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuizCard from "@/components/QuizCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Search, Filter, Tag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Player } from '@lottiefiles/react-lottie-player';
import gsap from "gsap";
import { useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getQuizzesForUsers } from "@/lib/quizFirestore";
import { useToast } from "@/hooks/use-toast";

const Quizzes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [creatorFilter, setCreatorFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  
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
                      (activeTab === "recommended" && ["NPTEL", "Technology"].includes(quiz.category || quiz.tags?.[0])) ||
                      (activeTab === "trending" && quiz.difficulty === "medium");
    
    return matchesSearch && matchesCategory && matchesSubject && matchesDifficulty && 
           matchesCreator && matchesTags && matchesTab;
  });

  useEffect(() => {
    // Animate preloader progress bar (same as HeroSection)
    gsap.to(progressBarRef.current, {
      width: "100%",
      duration: 2,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(preloaderRef.current, {
          opacity: 0,
          scale: 0.9,
          duration: 1,
          onComplete: () => {
            setLoading(false);
            gsap.to(mainContentRef.current, {
              opacity: 1,
              duration: 1,
              ease: "power2.out"
            });
          },
        });
      },
    });
  }, []);

  return (
    <>
      {/* Preloader overlay (same as HeroSection) */}
      {loading && (
        <div
          ref={preloaderRef}
          className="preloader fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
          style={{ transition: "opacity 1s, transform 1s", minHeight: "100vh" }}
        >
          <div className="text-5xl font-extrabold text-gray-700 mb-8 animate-pulse">
            Examify
          </div>
          <div className="w-64 h-2 bg-gray-200 rounded overflow-hidden">
            <div
              ref={progressBarRef}
              className="progress-bar h-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: 0 }}
            />
          </div>
        </div>
      )}

      {/* Main content, always rendered */}
      <div
        ref={mainContentRef}
        className={`min-h-screen flex flex-col transition-opacity duration-700 ${loading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <Navbar showInDashboard={true} />
        <main className="flex-grow pt-20">
          <div className="bg-secondary/30 py-8 sm:py-12">
            <div className="container mx-auto px-2 sm:px-4">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-4">All Quizzes</h1>
              <p className="text-base xs:text-lg text-muted-foreground max-w-2xl mb-6 sm:mb-8">
                Browse through our collection of quizzes designed for various subjects and difficulty levels. Find the perfect quiz to test your knowledge.
              </p>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4 sm:mb-6">
                <div className="overflow-x-auto scrollbar-none -mx-2 px-2 mb-2">
                  <TabsList className="bg-background/60 backdrop-blur-sm flex gap-2 min-w-max whitespace-nowrap">
                    <TabsTrigger value="all" className="min-w-[120px]">All Quizzes</TabsTrigger>
                    <TabsTrigger value="recommended" className="min-w-[180px]">Recommended for You</TabsTrigger>
                    <TabsTrigger value="trending" className="min-w-[160px]">Popular & Trending</TabsTrigger>
                  </TabsList>
                </div>
              </Tabs>
              <div className="bg-white dark:bg-gray-800 p-2 xs:p-4 rounded-lg shadow-sm">
                <div className="flex flex-col gap-3 xs:gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search quizzes..."
                      className="pl-10 text-sm xs:text-base"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 xs:gap-4">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full text-xs xs:text-sm">
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
                      <SelectTrigger className="w-full text-xs xs:text-sm">
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
                      <SelectTrigger className="w-full text-xs xs:text-sm">
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
                      <SelectTrigger className="w-full text-xs xs:text-sm">
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
                  <div className="flex flex-wrap gap-2 mt-1 xs:mt-2">
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
                      size="sm"
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
          <div className="container mx-auto px-2 sm:px-4 py-8">
            {loadingQuizzes ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <h3 className="text-lg xs:text-xl font-semibold mb-2">Loading quizzes...</h3>
                <p className="text-muted-foreground">
                  Please wait while we fetch the available quizzes.
                </p>
              </div>
            ) : filteredQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6">
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
                <h3 className="text-lg xs:text-xl font-semibold mb-2">No quizzes found</h3>
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
    </>
  );
};

export default Quizzes;
