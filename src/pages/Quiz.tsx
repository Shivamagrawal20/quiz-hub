
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Lock, LoaderCircle, Save, Flag } from "lucide-react";
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
import { doc, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

// Define proper types for quiz data
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  section?: string; // Make section optional
}

interface BaseQuiz {
  title: string;
  description: string;
  questions: QuizQuestion[];
  testType?: string; // Make testType optional
  sections?: string[]; // Make sections optional
}

type QuizData = {
  [key: string]: BaseQuiz;
};

// Mock quiz data - in a real application, this would come from an API
const quizData: QuizData = {
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
  },
  "cat1": {
    title: "CAT Preparation - Quantitative Aptitude",
    description: "Practice quantitative questions for the Common Admission Test (CAT).",
    testType: "CAT Preparation",
    sections: ["Quant", "Verbal"],
    questions: [
      {
        id: 1,
        section: "Quant",
        question: "The arithmetic mean of the 5 consecutive integers starting with 'x' is 'y'. What is the arithmetic mean of 9 consecutive integers that start with y + 2?",
        options: ["78", "58", "68", "98"],
        correctAnswer: 1
      },
      {
        id: 2,
        section: "Quant",
        question: "If a, b, c are in arithmetic progression and a², b², c² are in geometric progression, then a:b:c is equal to?",
        options: ["3:4:5", "1:2:3", "2:4:6", "4:5:6"],
        correctAnswer: 0
      },
      {
        id: 3,
        section: "Verbal",
        question: "Choose the word that is most nearly opposite in meaning to 'Ameliorate'.",
        options: ["Worsen", "Improve", "Maintain", "Tolerate"],
        correctAnswer: 0
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
  const [questionStatuses, setQuestionStatuses] = useState<{[key: number]: "answered" | "flagged" | "unattempted" | "correct" | "incorrect"}>({});
  const [timeRemaining, setTimeRemaining] = useState({ hours: 1, minutes: 0, seconds: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenAlert, setShowFullscreenAlert] = useState(false);
  const [showExitAlert, setShowExitAlert] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("Quant");
  const { user, profile } = useAuth();
  
  // Get quiz data based on ID
  const quiz = id ? quizData[id] : null;
  
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
        const initialStatuses: {[key: number]: "answered" | "flagged" | "unattempted" | "correct" | "incorrect"} = {};
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
            if (prev.hours === 0) {
              clearInterval(timer);
              // Auto-submit when time expires
              handleFinishQuiz();
              return prev;
            }
            return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
          }
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
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
      // Block Escape key and show exit confirmation
      if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        
        if (!quizCompleted) {
          setShowExitAlert(true);
        }
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
  }, [isLoading, quizCompleted]);
  
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
    
    // Move to next question if available
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(userAnswers[currentQuestion + 1]);
    }
    
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
  const handleFinishQuiz = async () => {
    // Calculate final score
    let finalScore = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === quiz?.questions[index].correctAnswer) {
        finalScore++;
      }
    });
    setScore(finalScore);
    setQuizCompleted(true);

    // --- Firestore update logic ---
    try {
      if (user && profile) {
        const quizScore = (finalScore / quiz.questions.length) * 100;
        const newQuizzesTaken = (profile.quizzesTaken || 0) + 1;
        const newTopScore = Math.max(profile.topScore || 0, quizScore);
        const newAvgScore = ((profile.avgScore || 0) * (newQuizzesTaken - 1) + quizScore) / newQuizzesTaken;
        // Optionally, update streak, achievements, etc. here
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          quizzesTaken: newQuizzesTaken,
          avgScore: newAvgScore,
          topScore: newTopScore,
          // Add other fields as needed
        });
        // --- Add quiz attempt to quizHistory subcollection ---
        const quizHistoryRef = collection(db, "users", user.uid, "quizHistory");
        await addDoc(quizHistoryRef, {
          quizId: id,
          title: quiz.title,
          score: finalScore,
          totalQuestions: quiz.questions.length,
          percentage: quizScore,
          date: serverTimestamp(),
          answers: userAnswers,
        });
      }
    } catch (err) {
      console.error("Failed to update user stats or quiz history in Firestore:", err);
    }
    // --- End Firestore update logic ---
  };

  // Handle quiz exit - modified to exit immediately
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
      unattempted: 0,
      correct: 0,
      incorrect: 0
    };
    
    Object.values(questionStatuses).forEach(status => {
      if (status === "answered") counts.answered++;
      else if (status === "flagged") counts.flagged++;
      else if (status === "correct") counts.correct++;
      else if (status === "incorrect") counts.incorrect++;
      else counts.unattempted++;
    });
    
    return counts;
  };

  // Get questions by section
  const getQuestionsBySection = (section: string) => {
    if (!quiz) return [];
    return quiz.questions.filter((q) => {
      // If the quiz has sections defined, filter by section
      if ('section' in q) {
        return q.section === section;
      }
      // If no sections defined, return all questions
      return true;
    });
  };

  if (isLoading) {
    return <QuizLoadingState />;
  }

  if (!quiz) {
    return null;
  }

  const formatTime = () => {
    const { hours, minutes, seconds } = timeRemaining;
    const formattedHours = hours > 0 ? `${hours < 10 ? '0' : ''}${hours}` : '';
    const hoursDisplay = hours > 0 ? `${formattedHours}:` : '';
    return `${hoursDisplay}${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const statusCounts = getStatusCounts();
  const currentSectionQuestions = getQuestionsBySection(activeSection);
  const hasSections = quiz.sections && Array.isArray(quiz.sections);

  // Determine if the current question belongs to the active section
  const isCurrentQuestionInActiveSection = () => {
    if (!quiz) return false;
    if (!hasSections) return true;
    
    const currentQuestionData = quiz.questions[currentQuestion];
    return 'section' in currentQuestionData && currentQuestionData.section === activeSection;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
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

      {/* Exit Quiz Alert Dialog */}
      <AlertDialog open={showExitAlert} onOpenChange={setShowExitAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Quiz</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to exit the quiz? All your progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowExitAlert(false)}>Continue Quiz</AlertDialogCancel>
            <AlertDialogAction onClick={handleExitQuiz} className="bg-red-500 hover:bg-red-600">
              Exit Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quiz header with logo, timer, and user info */}
      <div className="bg-white border-b shadow-sm p-2">
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="font-medium text-lg">{quiz.testType || quiz.title}</h2>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row">
        {/* Left side - Question and answers */}
        <div className="w-full md:w-2/3 p-4 relative">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
            <div className="text-gray-200 text-8xl font-bold transform rotate-[-30deg] opacity-10 whitespace-nowrap">
              Examify Examify Examify Examify Examify Examify
            </div>
          </div>
          
          <Card className="shadow-sm mb-4 overflow-hidden relative z-10">
            <div className="bg-gray-100 p-4 border-b">
              <div className="font-semibold">
                {hasSections && 'section' in quiz.questions[currentQuestion] && quiz.questions[currentQuestion].section && (
                  <span className="mr-2">{quiz.questions[currentQuestion].section} -</span>
                )}
                Question {currentQuestion + 1}
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
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                Previous
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleFlagForReview}
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-50"
              >
                <Flag className="h-4 w-4 mr-1" />
                Mark for Review
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={currentQuestion < quiz.questions.length - 1 ? "outline" : "default"}
                onClick={handleSaveAndNext}
                disabled={selectedAnswer === null}
                className={currentQuestion < quiz.questions.length - 1 ? 
                  "border-blue-500 text-blue-500 hover:bg-blue-50" : 
                  "bg-green-600 hover:bg-green-700"
                }
              >
                {currentQuestion < quiz.questions.length - 1 ? "Next" : "Save"}
              </Button>
              
              <Button 
                onClick={handleFinishQuiz}
                className="bg-red-500 hover:bg-red-600"
              >
                Submit Test
              </Button>
            </div>
          </div>
          
          {/* Question status legend */}
          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs">Correct</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs">Not Attempted</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs">Answered</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs">Review</span>
            </div>
          </div>
        </div>
        
        {/* Right side - Timer and questions navigation */}
        <div className="w-full md:w-1/3 bg-white border-l">
          {/* Timer */}
          <div className="border-b p-4">
            <h3 className="font-medium text-center">Time Left</h3>
            <div className="flex justify-center items-center gap-4 mt-2">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {timeRemaining.hours}
                </div>
                <div className="text-xs text-gray-500">Hours</div>
              </div>
              <div className="text-2xl">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {timeRemaining.minutes < 10 ? `0${timeRemaining.minutes}` : timeRemaining.minutes}
                </div>
                <div className="text-xs text-gray-500">Minutes</div>
              </div>
              <div className="text-2xl">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {timeRemaining.seconds < 10 ? `0${timeRemaining.seconds}` : timeRemaining.seconds}
                </div>
                <div className="text-xs text-gray-500">Seconds</div>
              </div>
            </div>
          </div>
          
          {/* Section tabs if the quiz has sections */}
          {hasSections && (
            <div className="border-b">
              <div className="flex">
                {quiz.sections.map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`flex-1 px-4 py-2 text-center font-medium ${
                      activeSection === section
                        ? "bg-primary/10 text-primary border-b-2 border-primary"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {section}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Question navigation grid */}
          <div className="p-4">
            <h3 className="font-medium mb-3 text-center">{activeSection}</h3>
            <div className="grid grid-cols-5 gap-2">
              {quiz.questions.map((q, index) => {
                // If quiz has sections, only show questions from active section
                if (hasSections && 'section' in q && q.section !== activeSection) {
                  return null;
                }
                
                const status = questionStatuses[index];
                let bgColor = "bg-gray-100";
                
                if (status === "answered") bgColor = "bg-blue-500 text-white";
                else if (status === "flagged") bgColor = "bg-yellow-500 text-white";
                else if (status === "correct") bgColor = "bg-green-500 text-white";
                else if (status === "incorrect") bgColor = "bg-red-500 text-white";
                else if (userAnswers[index] === null) bgColor = "bg-red-500 text-white";
                
                return (
                  <button
                    key={index}
                    className={`h-10 w-full flex items-center justify-center rounded-md ${bgColor} ${
                      currentQuestion === index ? "ring-2 ring-offset-2 ring-primary" : ""
                    }`}
                    onClick={() => goToQuestion(index)}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{statusCounts.answered}</div>
                  <div className="text-xs text-gray-500">Answered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{statusCounts.unattempted}</div>
                  <div className="text-xs text-gray-500">Not Attempted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{statusCounts.flagged}</div>
                  <div className="text-xs text-gray-500">Marked for Review</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{quiz.questions.length}</div>
                  <div className="text-xs text-gray-500">Total Questions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Result display when quiz is completed */}
      {quizCompleted && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-xl mb-6">
              Your score: <span className="font-bold text-primary">{score}</span> out of {quiz.questions.length}
            </p>
            
            <div className="mb-6">
              <div className="text-5xl font-bold text-primary mb-2">
                {((score / quiz.questions.length) * 100).toFixed(1)}%
              </div>
              <Progress 
                value={(score / quiz.questions.length) * 100}
                className="h-4 mb-4"
              />
            </div>
            
            <Button onClick={() => navigate('/quizzes')} className="w-full">
              Back to Quizzes
            </Button>
          </div>
        </div>
      )}
      
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
