
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useScrollToTop } from "@/hooks/useScrollToTop";

// Mock quiz data - in a real application, this would come from an API
const quizData = {
  "1": {
    title: "Mathematics Basics",
    description: "Test your knowledge of essential math concepts and operations.",
    questions: [
      {
        id: 1,
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "What is 5 × 9?",
        options: ["40", "45", "50", "54"],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "What is the square root of 16?",
        options: ["2", "4", "8", "16"],
        correctAnswer: 1
      }
    ]
  },
  "2": {
    title: "World Geography",
    description: "Explore countries, capitals, and geographical features around the globe.",
    questions: [
      {
        id: 1,
        question: "What is the capital of France?",
        options: ["London", "Paris", "Berlin", "Madrid"],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "Which continent is Egypt in?",
        options: ["Asia", "Europe", "Africa", "South America"],
        correctAnswer: 2
      },
      {
        id: 3,
        question: "What is the longest river in the world?",
        options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
        correctAnswer: 1
      }
    ]
  },
  "nptel1": {
    title: "Introduction to Environmental Engineering and Science",
    description: "Learn about fundamental and sustainability concepts in environmental engineering.",
    questions: [
      {
        id: 1,
        question: "Which of the following is a greenhouse gas?",
        options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
        correctAnswer: 2
      },
      {
        id: 2,
        question: "What is the primary cause of acid rain?",
        options: ["Carbon dioxide", "Methane", "Sulfur dioxide", "Ozone"],
        correctAnswer: 2
      },
      {
        id: 3,
        question: "Which water quality parameter indicates organic pollution?",
        options: ["pH", "BOD", "Temperature", "Turbidity"],
        correctAnswer: 1
      }
    ]
  }
};

const Quiz = () => {
  useScrollToTop();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [securityViolations, setSecurityViolations] = useState(0);
  
  // Get quiz data based on ID
  const quiz = id ? quizData[id as keyof typeof quizData] : null;
  
  // If no quiz found, navigate back to quizzes page
  useEffect(() => {
    if (!quiz) {
      navigate("/quizzes");
      toast({
        title: "Quiz not found",
        description: "The requested quiz could not be found.",
        variant: "destructive",
      });
    }
  }, [quiz, navigate, toast]);

  // Anti-cheating measures
  useEffect(() => {
    // Prevent right-click
    const handleRightClick = (e: MouseEvent) => {
      e.preventDefault();
      warnUser("Right-clicking is disabled during the quiz.");
    };

    // Prevent copy
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      warnUser("Copying is not allowed during the quiz.");
    };
    
    // Prevent tab switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        warnUser("Leaving the quiz tab is not allowed.");
      }
    };

    // Prevent keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+C, Ctrl+P, F12, Alt+Tab
      if (
        (e.ctrlKey && (e.key === "c" || e.key === "p")) || 
        e.key === "F12" || 
        e.key === "PrintScreen" || 
        (e.altKey && e.key === "Tab")
      ) {
        e.preventDefault();
        warnUser("Keyboard shortcuts are disabled during the quiz.");
      }
    };

    document.addEventListener("contextmenu", handleRightClick);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", handleKeyDown);

    // Enter fullscreen mode
    const enterFullscreen = () => {
      try {
        const element = document.documentElement;
        if (element.requestFullscreen) {
          element.requestFullscreen();
        }
      } catch (error) {
        console.error("Could not enter fullscreen mode:", error);
      }
    };
    
    enterFullscreen();

    // Cleanup event listeners
    return () => {
      document.removeEventListener("contextmenu", handleRightClick);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeyDown);
      
      // Exit fullscreen when leaving the quiz
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.error(err));
      }
    };
  }, []);
  
  // Security violation warning
  const warnUser = (message: string) => {
    toast({
      title: "Security Warning",
      description: message,
      variant: "destructive",
    });
    
    setSecurityViolations(prev => {
      const newCount = prev + 1;
      
      // Auto-fail the quiz after 3 violations
      if (newCount >= 3) {
        toast({
          title: "Quiz Terminated",
          description: "Multiple security violations detected. Quiz has been terminated.",
          variant: "destructive",
        });
        navigate("/quizzes");
      }
      
      return newCount;
    });
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  // Handle next question
  const handleNextQuestion = () => {
    // Check if answer is correct
    if (selectedAnswer === quiz?.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    // Move to next question or complete quiz
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  // Handle quiz exit
  const handleExitQuiz = () => {
    navigate("/quizzes");
  };

  if (!quiz) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Quiz header with security indicators */}
      <div className="bg-primary text-white p-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:text-white hover:bg-primary/80"
          onClick={handleExitQuiz}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Exit Quiz
        </Button>
        
        <h1 className="text-xl font-bold text-center flex-grow">{quiz.title}</h1>
        
        <div className="flex items-center">
          <Lock className="h-5 w-5 mr-1" />
          <span className="text-xs">Secure Mode</span>
        </div>
      </div>

      <div className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center max-w-4xl">
        {!quizCompleted ? (
          <div className="w-full bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              
              <div className="flex items-center">
                <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ 
                      width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <h2 className="text-xl md:text-2xl font-semibold mb-6">
              {quiz.questions[currentQuestion].question}
            </h2>
            
            <div className="space-y-3">
              {quiz.questions[currentQuestion].options.map((option, index) => (
                <div 
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAnswer === index 
                      ? 'bg-primary/10 border-primary' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                      selectedAnswer === index 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button 
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
              >
                {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full bg-white rounded-lg shadow-lg p-6 md:p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-xl mb-6">
              Your score: <span className="font-bold text-primary">{score}</span> out of {quiz.questions.length}
            </p>
            
            <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden mb-8">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ 
                  width: `${(score / quiz.questions.length) * 100}%` 
                }}
              ></div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Button onClick={handleExitQuiz} variant="outline">
                Back to Quizzes
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Security footer */}
      <div className="bg-slate-800 text-slate-200 p-2 text-xs text-center">
        <p>Secure Quiz Mode • Anti-Cheating Protection Enabled • {3 - securityViolations} Warnings Remaining</p>
      </div>
    </div>
  );
};

export default Quiz;
