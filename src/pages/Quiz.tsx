import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Lock, LoaderCircle, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [questionStatuses, setQuestionStatuses] = useState<{[key: number]: "answered" | "flagged" | "unattempted"}>({});
  const [timeRemaining, setTimeRemaining] = useState({ minutes: 5, seconds: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenAlert, setShowFullscreenAlert] = useState(false);
  
  // Get quiz data based on ID
  const quiz = id ? quizData[id as keyof typeof quizData] : null;
  
  // Function to enter fullscreen mode
  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().catch((error) => {
        console.error("Fullscreen error:", error);
        toast({
          title: "Fullscreen Error",
          description: "Unable to enter fullscreen mode. Please try again or check your browser settings.",
          variant: "destructive",
        });
      });
    }
  };
  
  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      // Show alert to re-enter fullscreen if exited and quiz is not completed
      if (!isCurrentlyFullscreen && !quizCompleted && !isLoading) {
        setShowFullscreenAlert(true);
        warnUser("Exiting fullscreen is not allowed during the quiz.");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [quizCompleted, isLoading]);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Initialize user answers and question statuses
      if (quiz) {
        setUserAnswers(new Array(quiz.questions.length).fill(null));
        const initialStatuses: {[key: number]: "answered" | "flagged" | "unattempted"} = {};
        for (let i = 0; i < quiz.questions.length; i++) {
          initialStatuses[i] = "unattempted";
        }
        setQuestionStatuses(initialStatuses);
      }
      
      // Enter fullscreen mode initially
      enterFullscreen();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [quiz]);
  
  // Timer countdown
  useEffect(() => {
    if (isLoading || quizCompleted) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.seconds === 0) {
          if (prev.minutes === 0) {
            clearInterval(timer);
            // Auto-submit when time expires
            handleFinishQuiz();
            return prev;
          }
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isLoading, quizCompleted]);
  
  // If no quiz found, navigate back to quizzes page
  useEffect(() => {
    if (!isLoading && !quiz) {
      navigate("/quizzes");
      toast({
        title: "Quiz not found",
        description: "The requested quiz could not be found.",
        variant: "destructive",
      });
    }
  }, [quiz, navigate, toast, isLoading]);

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

    // Prevent keyboard shortcuts - with enhanced ESC key handling
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Escape key to prevent exiting fullscreen - but show dialog
      if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        if (!isFullscreen && !quizCompleted) {
          setShowFullscreenAlert(true);
        }
        warnUser("Exiting fullscreen mode is not allowed during the quiz.");
      }
      
      // Extended key prevention for Mac and Windows
      if (
        e.ctrlKey || e.metaKey || e.altKey || // Block Command, Alt/Option, Ctrl keys
        e.key === "F12" || 
        e.key === "PrintScreen" || 
        e.key === "Tab" ||
        e.key === "F11" ||
        e.key === "F5" ||
        (e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C"))
      ) {
        e.preventDefault();
        warnUser("This keyboard combination is disabled during the quiz.");
      }
    };

    // Only attach event listeners if quiz is loaded and not completed
    if (!isLoading && !quizCompleted) {
      document.addEventListener("contextmenu", handleRightClick);
      document.addEventListener("copy", handleCopy);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      document.addEventListener("keydown", handleKeyDown);
    }
    
    // Cleanup event listeners
    return () => {
      document.removeEventListener("contextmenu", handleRightClick);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeyDown);
      
      // Exit fullscreen when leaving the quiz
      if (document.fullscreenElement && quizCompleted) {
        document.exitFullscreen().catch(err => console.error(err));
      }
    };
  }, [isLoading, quizCompleted, isFullscreen]);
  
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
    
    // Update user answers array
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newUserAnswers);
    
    // Update question status
    const newQuestionStatuses = {...questionStatuses};
    newQuestionStatuses[currentQuestion] = "answered";
    setQuestionStatuses(newQuestionStatuses);
  };

  // Handle saving the answer and moving to next question
  const handleSaveAndNext = () => {
    if (selectedAnswer !== null) {
      // Check if answer is correct for scoring
      if (selectedAnswer === quiz?.questions[currentQuestion].correctAnswer) {
        setScore(score + 1);
      }
      
      // Move to next question if available
      if (currentQuestion < (quiz?.questions.length || 0) - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(userAnswers[currentQuestion + 1]);
      }
    }
  };
  
  // Handle flagging a question for review
  const handleFlagForReview = () => {
    const newQuestionStatuses = {...questionStatuses};
    newQuestionStatuses[currentQuestion] = "flagged";
    setQuestionStatuses(newQuestionStatuses);
    
    toast({
      title: "Question Flagged",
      description: "This question has been marked for review.",
    });
  };
  
  // Navigate to a specific question
  const goToQuestion = (index: number) => {
    if (index >= 0 && index < (quiz?.questions.length || 0)) {
      setCurrentQuestion(index);
      setSelectedAnswer(userAnswers[index]);
    }
  };
  
  // Handle finish quiz
  const handleFinishQuiz = () => {
    // Calculate final score
    let finalScore = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === quiz?.questions[index].correctAnswer) {
        finalScore++;
      }
    });
    
    setScore(finalScore);
    setQuizCompleted(true);
  };

  // Handle quiz exit
  const handleExitQuiz = () => {
    navigate("/quizzes");
  };
  
  // Get the count of unattempted questions
  const getUnattemptedCount = () => {
    return userAnswers.filter(answer => answer === null).length;
  };
  
  // Get the count for each question status
  const getStatusCounts = () => {
    const counts = {
      answered: 0,
      flagged: 0,
      unattempted: 0
    };
    
    Object.values(questionStatuses).forEach(status => {
      if (status === "answered") counts.answered++;
      else if (status === "flagged") counts.flagged++;
      else counts.unattempted++;
    });
    
    return counts;
  };

  if (isLoading) {
    return <QuizLoadingState />;
  }

  if (!quiz) {
    return null;
  }

  const formatTime = () => {
    const { minutes, seconds } = timeRemaining;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Fullscreen Alert Dialog */}
      <AlertDialog open={showFullscreenAlert} onOpenChange={setShowFullscreenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fullscreen Required</AlertDialogTitle>
            <AlertDialogDescription>
              You must remain in fullscreen mode to continue with the quiz. 
              Exiting fullscreen mode will be counted as a security violation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowFullscreenAlert(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              enterFullscreen();
              setShowFullscreenAlert(false);
            }}>
              Return to Fullscreen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quiz header with logo, timer, and user info */}
      <div className="bg-white border-b shadow-sm p-2 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-md bg-primary/20 flex items-center justify-center mr-2">
            <span className="text-primary font-bold text-xl">Q</span>
          </div>
          <h2 className="font-medium">QuizHub</h2>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="font-medium">Time:</span> 
            <span className={`font-bold ${timeRemaining.minutes < 1 ? "text-red-500" : ""}`}>
              {formatTime()}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Test for: {quiz.title}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-right">
            <div>Test status: <span className="font-medium">Not Finished</span></div>
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
            <span className="text-sm">JD</span>
          </div>
        </div>
      </div>

      <div className="flex-grow container mx-auto p-4 flex gap-6">
        {!quizCompleted ? (
          <>
            {/* Left side - Question and answers */}
            <div className="w-2/3">
              <Card className="shadow-sm mb-4 overflow-hidden">
                <div className="bg-gray-100 p-4 border-b">
                  <div className="font-semibold">
                    Q {currentQuestion + 1}
                  </div>
                  <div className="text-lg mt-1">
                    {quiz.questions[currentQuestion].question}
                  </div>
                </div>
                
                <div className="p-4">
                  <RadioGroup 
                    value={selectedAnswer?.toString()} 
                    onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                    className="space-y-3"
                  >
                    {quiz.questions[currentQuestion].options.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-2 border rounded p-3 ${
                          selectedAnswer === index ? 'border-primary bg-primary/5' : ''
                        }`}
                      >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mr-2" />
                        <label
                          htmlFor={`option-${index}`}
                          className="flex-grow cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span>{option}</span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </Card>
              
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => goToQuestion(currentQuestion - 1)}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleFlagForReview}
                  >
                    Mark for Review & Next
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleExitQuiz}
                  >
                    Cancel
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    onClick={handleSaveAndNext}
                    disabled={selectedAnswer === null}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {currentQuestion < quiz.questions.length - 1 
                      ? "Save & Next" 
                      : "Save"
                    }
                  </Button>
                  
                  <Button 
                    onClick={handleFinishQuiz}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Final Submit
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Right side - Questions navigation */}
            <div className="w-1/3">
              <Card className="shadow-sm overflow-hidden">
                <div className="bg-blue-100 p-4">
                  <h3 className="font-semibold text-center text-blue-800">QUESTIONS</h3>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: quiz.questions.length }).map((_, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className={`h-8 w-full text-xs ${
                          currentQuestion === index 
                            ? "bg-orange-500 text-white border-orange-500" 
                            : questionStatuses[index] === "answered"
                              ? "bg-green-100 border-green-300"
                              : questionStatuses[index] === "flagged"
                                ? "bg-purple-100 border-purple-300"
                                : ""
                        }`}
                        onClick={() => goToQuestion(index)}
                      >
                        Q {index + 1}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="mt-8 border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Un-Attempted Question</span>
                      <span className="font-bold">{statusCounts.unattempted}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                        <span className="text-sm">Not Answered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Answered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-sm">Answered but Marked for Review</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm">Not Answered but Marked for Review</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </>
        ) : (
          <div className="w-full bg-white rounded-lg shadow-lg p-6 md:p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-xl mb-6">
              Your score: <span className="font-bold text-primary">{score}</span> out of {quiz.questions.length}
            </p>
            
            <div className="max-w-md mx-auto bg-blue-50 rounded-lg p-8 mb-8">
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {((score / quiz.questions.length) * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-blue-600">
                You got {score} {score === 1 ? 'answer' : 'answers'} correct
              </p>
            </div>
            
            <Progress 
              value={(score / quiz.questions.length) * 100}
              className="h-4 mb-8 max-w-md mx-auto"
            />
            
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

// Loading state component for the quiz
const QuizLoadingState = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <div className="bg-primary text-white p-4 flex items-center justify-between">
        <Skeleton className="h-9 w-24 bg-primary-foreground/20" />
        <Skeleton className="h-6 w-48 bg-primary-foreground/20" />
        <Skeleton className="h-9 w-24 bg-primary-foreground/20" />
      </div>

      <div className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center max-w-4xl">
        <div className="w-full bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
          
          <Skeleton className="h-2 w-full mb-6" />
          
          <Skeleton className="h-10 w-full mb-6" />
          
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
          
          <div className="mt-8 flex justify-end">
            <div className="flex items-center justify-center gap-2">
              <LoaderCircle className="animate-spin h-5 w-5" />
              <span>Loading quiz...</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-800 text-slate-200 p-2 text-xs text-center">
        <p>Loading secure quiz environment...</p>
      </div>
    </div>
  );
};

export default Quiz;
