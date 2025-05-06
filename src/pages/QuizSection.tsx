
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuizCard from "@/components/QuizCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Tag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const QuizSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [creatorFilter, setCreatorFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  
  const allQuizzes = [
    {
      id: "1",
      title: "Mathematics Basics",
      description: "Test your knowledge of essential math concepts and operations.",
      questionCount: 15,
      category: "Mathematics",
      subject: "Math",
      difficulty: "easy" as const,
      creator: "Admin",
      tags: ["math", "basics"],
    },
    {
      id: "2",
      title: "World Geography",
      description: "Explore countries, capitals, and geographical features around the globe.",
      questionCount: 20,
      category: "Geography",
      subject: "Social Studies",
      difficulty: "medium" as const,
      creator: "Teacher",
      tags: ["geography", "world"],
    },
    {
      id: "3",
      title: "Computer Science",
      description: "Challenge yourself with programming concepts and computer technologies.",
      questionCount: 25,
      category: "Technology",
      subject: "Computer Science",
      difficulty: "hard" as const,
      creator: "Admin",
      tags: ["programming", "technology"],
    },
    {
      id: "4",
      title: "Biology 101",
      description: "Learn about cells, organisms, and the basics of life science.",
      questionCount: 18,
      category: "Science",
      subject: "Biology",
      difficulty: "easy" as const,
      creator: "Teacher",
      tags: ["biology", "cells", "science"],
    },
    {
      id: "5",
      title: "World History",
      description: "Journey through important historical events and civilizations.",
      questionCount: 22,
      category: "History",
      subject: "History",
      difficulty: "medium" as const,
      creator: "Admin",
      tags: ["history", "civilization"],
    },
    {
      id: "6",
      title: "Advanced Physics",
      description: "Dive into complex physics theories and quantum mechanics.",
      questionCount: 15,
      category: "Science",
      subject: "Physics",
      difficulty: "hard" as const,
      creator: "Professor",
      tags: ["physics", "quantum"],
    },
    {
      id: "7",
      title: "English Literature",
      description: "Explore famous works of literature and their authors.",
      questionCount: 20,
      category: "Literature",
      subject: "English",
      difficulty: "medium" as const,
      creator: "Teacher",
      tags: ["literature", "english"],
    },
    {
      id: "8",
      title: "Basic Chemistry",
      description: "Learn about elements, compounds, and chemical reactions.",
      questionCount: 15,
      category: "Science",
      subject: "Chemistry",
      difficulty: "easy" as const,
      creator: "Admin",
      tags: ["chemistry", "elements"],
    },
    {
      id: "9",
      title: "Art History",
      description: "Discover famous artists, art movements, and masterpieces.",
      questionCount: 18,
      category: "Arts",
      subject: "Art",
      difficulty: "medium" as const,
      creator: "Professor",
      tags: ["art", "history"],
    },
  ];
  
  // Get unique values for filters
  const categories = [...new Set(allQuizzes.map(quiz => quiz.category))];
  const subjects = [...new Set(allQuizzes.map(quiz => quiz.subject))];
  const creators = [...new Set(allQuizzes.map(quiz => quiz.creator))];
  
  // Get all unique tags
  const allTags = [...new Set(allQuizzes.flatMap(quiz => quiz.tags))];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  // Filter quizzes based on search, filters, and tabs
  const filteredQuizzes = allQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || quiz.category === categoryFilter;
    const matchesSubject = subjectFilter === "all" || quiz.subject === subjectFilter;
    const matchesDifficulty = difficultyFilter === "all" || quiz.difficulty === difficultyFilter;
    const matchesCreator = creatorFilter === "all" || quiz.creator === creatorFilter;
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => quiz.tags.includes(tag));
    
    // Tab filtering
    const matchesTab = activeTab === "all" || 
                      (activeTab === "recommended" && ["Mathematics", "Science"].includes(quiz.category)) ||
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
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="bg-background/60 backdrop-blur-sm">
                <TabsTrigger value="all">All Quizzes</TabsTrigger>
                <TabsTrigger value="recommended">Recommended for You</TabsTrigger>
                <TabsTrigger value="trending">Popular & Trending</TabsTrigger>
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
          {filteredQuizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map(quiz => (
                <QuizCard 
                  key={quiz.id} 
                  id={quiz.id}
                  title={quiz.title} 
                  description={quiz.description}
                  questionCount={quiz.questionCount}
                  category={quiz.category}
                  difficulty={quiz.difficulty}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No quizzes found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find more quizzes.
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
