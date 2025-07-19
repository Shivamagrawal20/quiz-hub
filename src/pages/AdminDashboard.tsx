import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Flame, BarChart2, Trophy, BookOpen, History, User, Trash2, Edit2, Clock, Eye, EyeOff, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { getAllQuizzes, createQuiz, getAllUsers, getAllQuizHistories, updateQuizVisibility } from "@/lib/quizFirestore";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const TAG_OPTIONS = ["Science", "Maths", "Ethics", "NPTEL", "Technology", "General", "Other"];

const generateQuizId = () => {
  return `quiz-${Math.random().toString(36).substr(2, 9)}`;
};

// Mock quizzes for now
const mockQuizzes = [
  {
    id: "quiz-abc123",
    title: "Science Basics",
    tags: ["Science"],
    description: "A quiz on basic science concepts.",
  },
  {
    id: "quiz-math456",
    title: "Maths Challenge",
    tags: ["Maths", "NPTEL"],
    description: "Test your math skills!",
  },
  {
    id: "quiz-ethics789",
    title: "Medical Ethics",
    tags: ["Ethics"],
    description: "Quiz on medical ethics and best practices.",
  },
];

const AdminDashboard = () => {
  const { isLoggedIn, role, profile } = useAuth();
  const isAdmin = isLoggedIn && (role === "admin" || role === "administrator");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quizList, setQuizList] = useState<any[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [userList, setUserList] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [quizHistoryList, setQuizHistoryList] = useState<any[]>([]);
  const [loadingQuizHistory, setLoadingQuizHistory] = useState(false);

  useEffect(() => {
    async function fetchQuizzes() {
      setLoadingQuizzes(true);
      try {
        const quizzes = await getAllQuizzes();
        setQuizList(quizzes);
      } catch (err) {
        toast({ title: "Error loading quizzes", description: String(err), variant: "destructive" });
      } finally {
        setLoadingQuizzes(false);
      }
    }
    fetchQuizzes();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      setLoadingUsers(true);
      try {
        const users = await getAllUsers();
        setUserList(users);
      } catch (err) {
        toast({ title: "Error loading users", description: String(err), variant: "destructive" });
      } finally {
        setLoadingUsers(false);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchQuizHistories() {
      setLoadingQuizHistory(true);
      try {
        const histories = await getAllQuizHistories();
        setQuizHistoryList(histories);
      } catch (err) {
        toast({ title: "Error loading quiz history", description: String(err), variant: "destructive" });
      } finally {
        setLoadingQuizHistory(false);
      }
    }
    fetchQuizHistories();
  }, []);

  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [quizFeatures, setQuizFeatures] = useState("");
  const [quizId, setQuizId] = useState(generateQuizId());
  const [quizTags, setQuizTags] = useState<string[]>([]);
  const [creatingQuiz, setCreatingQuiz] = useState(false);

  const handleTagToggle = (tag: string) => {
    setQuizTags((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingQuiz(true);
    try {
      // Save quiz meta to Firestore
      await createQuiz(quizId, {
        title: quizTitle,
        description: quizDescription,
        features: quizFeatures,
        tags: quizTags,
        visibility: 'public', // Default to public visibility
      });
      setShowCreateQuiz(false);
      // Redirect to quiz edit page
      navigate(`/admin-dashboard/quiz/${quizId}/edit`);
      toast({ title: "Quiz created! Now add questions." });
    } catch (err) {
      toast({ title: "Error creating quiz", description: String(err), variant: "destructive" });
    } finally {
      setCreatingQuiz(false);
    }
  };

  const handleVisibilityToggle = async (quizId: string, currentVisibility: string) => {
    try {
      // Toggle between 'public' and 'organization'
      const newVisibility = currentVisibility === 'public' ? 'organization' : 'public';
      
      // Update the quiz visibility in Firestore
      await updateQuizVisibility(quizId, newVisibility);
      
      // Update local state
      setQuizList(prev => prev.map(quiz => 
        quiz.id === quizId 
          ? { ...quiz, visibility: newVisibility }
          : quiz
      ));
      
      toast({ 
        title: "Visibility updated", 
        description: `Quiz is now ${newVisibility === 'public' ? 'public' : 'organization-only'}` 
      });
    } catch (err) {
      toast({ 
        title: "Error updating visibility", 
        description: String(err), 
        variant: "destructive" 
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar showInDashboard />
        <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-secondary/10 to-secondary/5 dark:from-gray-900 dark:to-gray-950 pt-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Not authorized</h1>
            <p className="text-muted-foreground">You do not have permission to access the admin dashboard.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-secondary/10 to-secondary/5 dark:from-gray-900 dark:to-gray-950">
      <Navbar showInDashboard />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-2 sm:px-4 mt-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/30">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-1">Welcome, Admin!</h1>
              <div className="flex items-center gap-2 text-muted-foreground text-lg">
                <span>Manage quizzes, users, and site settings below.</span>
              </div>
            </div>
          </div>
        </div>
        {/* Stat Cards Section */}
        <div className="container mx-auto px-2 sm:px-4 mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" /> Admin Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-100 to-blue-50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium">Total Quizzes</h3>
                <BookOpen className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold mt-1">{quizList.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Quizzes in system</p>
            </Card>
            <Card className="bg-gradient-to-br from-green-100 to-green-50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium">Total Users</h3>
                <User className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold mt-1">{loadingUsers ? "..." : userList.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Registered users</p>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium">Achievements</h3>
                <Trophy className="h-4 w-4 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold mt-1">--</p>
              <p className="text-xs text-muted-foreground mt-1">System-wide</p>
            </Card>
            <Card className="bg-gradient-to-br from-orange-100 to-yellow-50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium">Active Streaks</h3>
                <Flame className="h-4 w-4 text-orange-500" />
              </div>
              <p className="text-2xl font-bold mt-1">--</p>
              <p className="text-xs text-muted-foreground mt-1">Users on streak</p>
            </Card>
          </div>
        </div>
        {/* Quiz List Section */}
        <section className="mt-10">
          <div className="container mx-auto px-2 sm:px-4 my-8">
            <h2 className="text-xl font-bold mb-4">All Quizzes</h2>
            {loadingQuizzes ? (
              <div className="text-center py-8 text-muted-foreground">Loading quizzes...</div>
            ) : quizList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-4">
                <img src="/placeholder.svg" alt="No quizzes" className="w-32 h-32 opacity-60" />
                <span className="text-lg font-medium">No quizzes found. Create your first quiz!</span>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl shadow-lg bg-white dark:bg-gray-900">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead>
                    <tr className="bg-primary/10">
                      <th className="px-6 py-4 text-left">Title</th>
                      <th className="px-6 py-4 text-left">Quiz ID</th>
                      <th className="px-6 py-4 text-left">Tags</th>
                      <th className="px-6 py-4 text-left">Description</th>
                      <th className="px-6 py-4 text-left">Duration</th>
                      <th className="px-6 py-4 text-center">Visibility</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizList.map((quiz, idx) => {
                      // Format duration
                      let durationLabel = "Untimed";
                      if (quiz.duration && (quiz.duration.hours || quiz.duration.minutes || quiz.duration.seconds)) {
                        const h = quiz.duration.hours || 0;
                        const m = quiz.duration.minutes || 0;
                        const s = quiz.duration.seconds || 0;
                        durationLabel = [
                          h ? `${h}h` : null,
                          m ? `${m}m` : null,
                          s ? `${s}s` : null
                        ].filter(Boolean).join(" ");
                      }
                      // Placeholders for missing data
                      const title = quiz.title && quiz.title.trim() ? quiz.title : "—";
                      const tags = Array.isArray(quiz.tags) && quiz.tags.length > 0 ? quiz.tags : null;
                      const description = quiz.description && quiz.description.trim() ? quiz.description : "—";
                      return (
                        <tr key={quiz.id} className={
                          `transition-colors ${idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/40' : 'bg-white dark:bg-gray-900'} hover:bg-primary/5 dark:hover:bg-primary/10`
                        }>
                          <td className="px-6 py-4 font-semibold text-primary max-w-xs truncate">{title}</td>
                          <td className="px-6 py-4 text-xs text-gray-500 font-mono max-w-xs truncate">{quiz.id}</td>
                          <td className="px-6 py-4">
                            {tags ? (
                              <div className="flex flex-wrap gap-1">
                                {tags.map((tag: string) => (
                                  <span key={tag} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">{tag}</span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-md truncate">{description}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${durationLabel === 'Untimed' ? 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'}`}>
                              <Clock className="h-4 w-4" /> {durationLabel}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                              (quiz.visibility || 'public') === 'public' 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                            }`}>
                              {(quiz.visibility || 'public') === 'public' ? (
                                <Eye className="h-3 w-3" />
                              ) : (
                                <Users className="h-3 w-3" />
                              )}
                              {(quiz.visibility || 'public') === 'public' ? 'Public' : 'Organization'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link to={`/admin-dashboard/quiz/${quiz.id}/edit`} state={quiz}>
                                    <Button size="icon" variant="ghost" className="hover:bg-primary/20">
                                      <Edit2 className="h-5 w-5 text-primary" />
                                    </Button>
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>Edit Quiz</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className={`ml-2 ${
                                      (quiz.visibility || 'public') === 'public' 
                                        ? 'hover:bg-green-100 dark:hover:bg-green-900' 
                                        : 'hover:bg-blue-100 dark:hover:bg-blue-900'
                                    }`}
                                    onClick={() => handleVisibilityToggle(quiz.id, quiz.visibility || 'public')}
                                  >
                                    {(quiz.visibility || 'public') === 'public' ? (
                                      <Eye className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <Users className="h-5 w-5 text-blue-500" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {(quiz.visibility || 'public') === 'public' ? 'Public' : 'Organization Only'} - Click to toggle
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* All Users' Quiz History Section */}
        <section className="mt-10">
          <div className="container mx-auto px-2 sm:px-4 my-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <History className="h-5 w-5 text-primary" /> All Users' Quiz History
            </h2>
            <Card className="rounded-xl shadow-md p-0 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">User</th>
                    <th className="px-4 py-2 text-left font-semibold">Email</th>
                    <th className="px-4 py-2 text-left font-semibold">Quiz</th>
                    <th className="px-4 py-2 text-left font-semibold">Score</th>
                    <th className="px-4 py-2 text-left font-semibold">Total</th>
                    <th className="px-4 py-2 text-left font-semibold">%</th>
                    <th className="px-4 py-2 text-left font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingQuizHistory ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">Loading quiz history...</td>
                    </tr>
                  ) : quizHistoryList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">No quiz attempts found.</td>
                    </tr>
                  ) : (
                    quizHistoryList.map((attempt, idx) => (
                      <tr key={attempt.id + attempt.userId} className={
                        `border-b last:border-0 hover:bg-primary/5 transition-colors ${idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/40' : 'bg-white dark:bg-gray-900'}`
                      }>
                        <td className="px-4 py-2 font-medium max-w-xs truncate">{attempt.userName}</td>
                        <td className="px-4 py-2 text-xs text-gray-500 font-mono max-w-xs truncate">{attempt.userEmail}</td>
                        <td className="px-4 py-2 font-medium">{attempt.title || "—"}</td>
                        <td className="px-4 py-2">{attempt.score}</td>
                        <td className="px-4 py-2">{attempt.totalQuestions}</td>
                        <td className="px-4 py-2">{attempt.percentage ? Math.round(attempt.percentage) : "—"}</td>
                        <td className="px-4 py-2">{attempt.date && attempt.date.toDate ? attempt.date.toDate().toLocaleDateString() : "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card>
          </div>
        </section>
        {/* Placeholder for admin features */}
        <div className="container mx-auto px-2 sm:px-4 mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" /> Admin Actions
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 text-center text-muted-foreground">
            <Button onClick={() => setShowCreateQuiz(true)} className="mb-6">+ Create Quiz</Button>
            <p>This is your admin dashboard. Here you will be able to add, edit, and manage quizzes, users, and site settings.</p>
            <p className="mt-2">(Feature management UI coming soon!)</p>
          </div>
        </div>
        {/* Create Quiz Modal */}
        <Dialog open={showCreateQuiz} onOpenChange={setShowCreateQuiz}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Quiz</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateQuiz} className="space-y-6">
              <div>
                <label className="block font-medium mb-1">Quiz Title</label>
                <Input value={quizTitle} onChange={e => setQuizTitle(e.target.value)} required />
              </div>
              <div>
                <label className="block font-medium mb-1">Description</label>
                <Textarea value={quizDescription} onChange={e => setQuizDescription(e.target.value)} required />
              </div>
              <div>
                <label className="block font-medium mb-1">Features</label>
                <Textarea value={quizFeatures} onChange={e => setQuizFeatures(e.target.value)} placeholder="E.g. Timed, Randomized, Adaptive..." />
              </div>
              <div>
                <label className="block font-medium mb-1">Quiz ID</label>
                <Input value={quizId} onChange={e => setQuizId(e.target.value)} required />
                <span className="text-xs text-muted-foreground">A unique identifier for this quiz (auto-generated, but you can edit).</span>
              </div>
              <div>
                <label className="block font-medium mb-1">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map(tag => (
                    <Button
                      key={tag}
                      type="button"
                      variant={quizTags.includes(tag) ? "default" : "outline"}
                      className="px-3 py-1 text-sm"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateQuiz} disabled={creatingQuiz}>
                  Create Quiz
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowCreateQuiz(false)}>Cancel</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard; 