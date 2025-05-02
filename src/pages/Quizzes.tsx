
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuizCard from "@/components/QuizCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Search } from "lucide-react";

const Quizzes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  
  const allQuizzes = [
    {
      id: "nptel1",
      title: "Introduction to Environmental Engineering and Science",
      description: "Learn about fundamental and sustainability concepts in environmental engineering.",
      questionCount: 30,
      category: "NPTEL",
      difficulty: "medium" as const,
    },
    {
      id: "3",
      title: "Computer Science",
      description: "Challenge yourself with programming concepts and computer technologies.",
      questionCount: 25,
      category: "Technology",
      difficulty: "hard" as const,
    },
    {
      id: "4",
      title: "Biology 101",
      description: "Learn about cells, organisms, and the basics of life science.",
      questionCount: 18,
      category: "Science",
      difficulty: "easy" as const,
    },
    {
      id: "5",
      title: "World History",
      description: "Journey through important historical events and civilizations.",
      questionCount: 22,
      category: "History",
      difficulty: "medium" as const,
    },
    {
      id: "6",
      title: "Advanced Physics",
      description: "Dive into complex physics theories and quantum mechanics.",
      questionCount: 15,
      category: "Science",
      difficulty: "hard" as const,
    },
    {
      id: "7",
      title: "English Literature",
      description: "Explore famous works of literature and their authors.",
      questionCount: 20,
      category: "Literature",
      difficulty: "medium" as const,
    },
    {
      id: "8",
      title: "Basic Chemistry",
      description: "Learn about elements, compounds, and chemical reactions.",
      questionCount: 15,
      category: "Science",
      difficulty: "easy" as const,
    },
    {
      id: "9",
      title: "Art History",
      description: "Discover famous artists, art movements, and masterpieces.",
      questionCount: 18,
      category: "Arts",
      difficulty: "medium" as const,
    },
  ];
  
  // Get unique categories for filter
  const categories = [...new Set(allQuizzes.map(quiz => quiz.category))];
  
  // Filter quizzes based on search and filters
  const filteredQuizzes = allQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "" || quiz.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === "" || quiz.difficulty === difficultyFilter;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="bg-secondary/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">All Quizzes</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              Browse through our collection of quizzes designed for various subjects and difficulty levels. Find the perfect quiz to test your knowledge.
            </p>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search quizzes..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 md:flex gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Difficulties</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setCategoryFilter("");
                      setDifficultyFilter("");
                    }}
                  >
                    Reset
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
                <QuizCard key={quiz.id} {...quiz} />
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

export default Quizzes;
