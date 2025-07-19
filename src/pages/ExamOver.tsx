import { useEffect, useState } from "react";
import { CheckCircle, ArrowRight, LoaderCircle, AlertTriangle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserQuizHistory } from "@/lib/quizFirestore";
import { useToast } from "@/hooks/use-toast";

interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  answers: Record<number, number>;
  completedAt: any;
}

export default function ExamOver() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [redirectTimer, setRedirectTimer] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // Disable back navigation
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.go(1);
    };
    return () => {
      window.onpopstate = null;
    };
  }, []);

  // Fetch the latest quiz result
  useEffect(() => {
    const fetchQuizResult = async () => {
      if (!user?.uid) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const history = await getUserQuizHistory(user.uid);
        
        if (history.length === 0) {
          setError("No quiz results found");
          setLoading(false);
          return;
        }

        // Get the most recent quiz result
        const latestResult = history[0];
        setQuizResult(latestResult);
        
        toast({
          title: "Quiz Results Loaded",
          description: `Score: ${latestResult.score.toFixed(1)}%`,
        });
      } catch (err) {
        console.error('Error fetching quiz result:', err);
        setError("Failed to load quiz results");
        toast({
          title: "Error",
          description: "Failed to load quiz results",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResult();
  }, [user?.uid, toast]);

  // Auto-redirect to dashboard
  useEffect(() => {
    if (redirectTimer <= 0) {
      navigate("/userhub");
      return;
    }
    const timer = setTimeout(() => setRedirectTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [redirectTimer, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-2 py-8 md:py-16 relative">
        <div className="text-center">
          <LoaderCircle className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading Quiz Results...</h2>
          <p className="text-muted-foreground">Please wait while we retrieve your results</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !quizResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-2 py-8 md:py-16 relative">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-red-600">Error Loading Results</h2>
          <p className="text-muted-foreground mb-4">{error || "No quiz results found"}</p>
          <button 
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold"
            onClick={() => navigate("/userhub")}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Calculate derived values
  const attempted = Object.keys(quizResult.answers).length;
  const skipped = quizResult.totalQuestions - attempted;
  const timeTakenMinutes = Math.floor(quizResult.timeTaken / 60);
  const timeTakenSeconds = quizResult.timeTaken % 60;
  const completionDate = quizResult.completedAt?.toDate?.() || new Date(quizResult.completedAt) || new Date();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-2 py-8 md:py-16 relative">
      {/* Checkmark Animation */}
      <div className="mb-6 flex justify-center w-full">
        <div className="bg-white rounded-full shadow-lg p-4 md:p-6 flex items-center justify-center animate-bounce-in">
          <CheckCircle className="h-16 w-16 md:h-24 md:w-24 text-green-500 drop-shadow-lg" />
        </div>
      </div>
      {/* Success Message */}
      <h1 className="text-2xl md:text-4xl font-extrabold text-center mb-2 text-primary leading-tight">Your Exam Has Been Submitted Successfully!</h1>
      <p className="text-base md:text-lg text-muted-foreground mb-8 text-center max-w-xl">Thank you for taking the <span className="font-semibold text-foreground">{quizResult.quizTitle}</span> on Examify.</p>
      {/* Responsive Card Layout */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl mb-8">
        {/* Exam Summary Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 min-w-0">
          <div className="flex flex-col gap-2 mb-4">
            <div className="text-lg md:text-xl font-bold text-foreground">{profile?.name || user?.email || 'User'}</div>
            <div className="text-base md:text-lg text-muted-foreground">{profile?.organization || 'Student'}</div>
          </div>
          <div className="text-base md:text-lg font-semibold text-primary mb-1">{quizResult.quizTitle}</div>
          <div className="text-xs md:text-sm text-muted-foreground mb-1">{completionDate.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Submission ID: {quizResult.id}</div>
          <div className="flex flex-wrap gap-4 justify-between text-sm md:text-base mt-4">
            <div>Questions: <span className="font-semibold">{quizResult.totalQuestions}</span></div>
            <div>Score: <span className="font-semibold">{quizResult.score.toFixed(1)}%</span></div>
            <div>Time Used: <span className="font-semibold">{timeTakenMinutes}m {timeTakenSeconds}s</span></div>
          </div>
        </div>
        {/* Performance Overview */}
        <div className="flex-1 bg-blue-50 rounded-2xl shadow p-6 md:p-8 border border-blue-100 min-w-0 flex flex-col justify-center">
          <div className="flex flex-wrap gap-4 md:gap-6 justify-between text-sm md:text-base">
            <div>Attempted: <span className="font-semibold">{attempted}/{quizResult.totalQuestions}</span></div>
            <div>Correct: <span className="font-semibold">{quizResult.correctAnswers}</span></div>
            <div>Skipped: <span className="font-semibold">{skipped}</span></div>
            <div>Time Taken: <span className="font-semibold">{timeTakenMinutes}m {timeTakenSeconds}s</span></div>
            <div>Status: <span className="font-semibold">Completed</span></div>
            <div>Score: <span className="font-semibold">{quizResult.score.toFixed(1)}%</span></div>
          </div>
        </div>
      </div>
      {/* Security Statement */}
      <div className="bg-white rounded-lg shadow p-4 max-w-2xl w-full mb-8 border border-gray-100 text-center text-sm md:text-base">
        <span className="text-muted-foreground">Your responses have been securely recorded. Any suspicious activity during the exam has been logged and will be reviewed by our proctoring team.</span>
      </div>
      {/* Action Button */}
      <div className="flex flex-wrap gap-4 justify-center mb-8 w-full">
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/90 transition text-base md:text-lg mx-auto" onClick={() => navigate("/userhub")}> <ArrowRight className="h-5 w-5" /> Return to Dashboard</button>
      </div>
      {/* Redirect Timer */}
      <div className="text-center text-muted-foreground text-sm md:text-base">Redirecting to dashboard in <span className="font-bold text-primary">{redirectTimer}</span> seconds...</div>
    </div>
  );
} 