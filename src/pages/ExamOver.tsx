import { useEffect, useState } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data (replace with real data from context or props)
const user = {
  name: "John Doe",
  organization: "XYZ University",
};
const exam = {
  title: "Final Mathematics Exam",
  totalQuestions: 50,
  duration: 60, // minutes
};
const submission = {
  attempted: 45,
  answered: 45,
  skipped: 5,
  timeTaken: 48, // minutes
  status: "Under Review", // or "Scored"
  score: 38, // if auto-graded
  date: new Date(),
  submissionId: "EXAM1234567890",
};

export default function ExamOver() {
  const navigate = useNavigate();
  const [redirectTimer, setRedirectTimer] = useState(10);

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

  // Auto-redirect to dashboard
  useEffect(() => {
    if (redirectTimer <= 0) {
      navigate("/dashboard");
      return;
    }
    const timer = setTimeout(() => setRedirectTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [redirectTimer, navigate]);

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
      <p className="text-base md:text-lg text-muted-foreground mb-8 text-center max-w-xl">Thank you for taking the <span className="font-semibold text-foreground">{exam.title}</span> on Examify.</p>
      {/* Responsive Card Layout */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl mb-8">
        {/* Exam Summary Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 min-w-0">
          <div className="flex flex-col gap-2 mb-4">
            <div className="text-lg md:text-xl font-bold text-foreground">{user.name}</div>
            <div className="text-base md:text-lg text-muted-foreground">{user.organization}</div>
          </div>
          <div className="text-base md:text-lg font-semibold text-primary mb-1">{exam.title}</div>
          <div className="text-xs md:text-sm text-muted-foreground mb-1">{submission.date.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Submission ID: {submission.submissionId}</div>
          <div className="flex flex-wrap gap-4 justify-between text-sm md:text-base mt-4">
            <div>Questions: <span className="font-semibold">{exam.totalQuestions}</span></div>
            <div>Duration: <span className="font-semibold">{exam.duration} min</span></div>
            <div>Time Used: <span className="font-semibold">{submission.timeTaken} min</span></div>
          </div>
        </div>
        {/* Performance Overview (optional, show if auto-graded) */}
        <div className="flex-1 bg-blue-50 rounded-2xl shadow p-6 md:p-8 border border-blue-100 min-w-0 flex flex-col justify-center">
          <div className="flex flex-wrap gap-4 md:gap-6 justify-between text-sm md:text-base">
            <div>Attempted: <span className="font-semibold">{submission.attempted}/{exam.totalQuestions}</span></div>
            <div>Answered: <span className="font-semibold">{submission.answered}</span></div>
            <div>Skipped: <span className="font-semibold">{submission.skipped}</span></div>
            <div>Time Taken: <span className="font-semibold">{submission.timeTaken} min</span></div>
            <div>Status: <span className="font-semibold">{submission.status}</span></div>
            {/* Uncomment if auto-graded */}
            {/* <div>Score: <span className="font-semibold">{submission.score}/{exam.totalQuestions}</span></div> */}
          </div>
        </div>
      </div>
      {/* Security Statement */}
      <div className="bg-white rounded-lg shadow p-4 max-w-2xl w-full mb-8 border border-gray-100 text-center text-sm md:text-base">
        <span className="text-muted-foreground">Your responses have been securely recorded. Any suspicious activity during the exam has been logged and will be reviewed by our proctoring team.</span>
      </div>
      {/* Action Button */}
      <div className="flex flex-wrap gap-4 justify-center mb-8 w-full">
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/90 transition text-base md:text-lg mx-auto" onClick={() => navigate("/dashboard")}> <ArrowRight className="h-5 w-5" /> Return to Dashboard</button>
      </div>
      {/* Redirect Timer */}
      <div className="text-center text-muted-foreground text-sm md:text-base">Redirecting to dashboard in <span className="font-bold text-primary">{redirectTimer}</span> seconds...</div>
    </div>
  );
} 