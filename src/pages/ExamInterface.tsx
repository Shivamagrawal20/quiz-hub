import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Clock, AlertTriangle, Shield, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  text: string;
  options: string[];
  selectedAnswer?: number;
}

interface ExamData {
  title: string;
  description: string;
  duration: number; // in minutes
  questions: Question[];
}

const sampleExam: ExamData = {
  title: "Final Mathematics Exam",
  description: "60 minutes | 50 Questions",
  duration: 60,
  questions: Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    text: `Question ${i + 1}: What is the value of x in the equation ${i + 2}x + ${i + 3} = ${(i + 2) * 5 + (i + 3)}?`,
    options: [
      `x = ${5}`,
      `x = ${4}`,
      `x = ${6}`,
      `x = ${3}`
    ]
  }))
};

const candidateInfo = {
  name: "John Doe",
  organization: "XYZ University",
  avatar: "/placeholder.svg"
};

export function ExamInterface() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(sampleExam.duration * 60); // in seconds
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [fullscreenViolations, setFullscreenViolations] = useState(0);
  const [fullscreenWarning, setFullscreenWarning] = useState("");
  const FULLSCREEN_LIMIT = 3;
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [pendingPopState, setPendingPopState] = useState<PopStateEvent | null>(null);

  // Timer countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Fullscreen enforcement and anti-cheat
  useEffect(() => {
    const enterFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
      }
    };
    const exitFullscreen = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    };
    // Enter fullscreen on mount
    enterFullscreen();
    // Listen for fullscreen changes
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // If exited, show modal to re-enter
      if (!document.fullscreenElement) {
        setShowFullscreenModal(true);
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    // Anti-cheat: disable right-click, text selection, copy, cut, paste, and common dev shortcuts
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleSelectStart = (e: Event) => e.preventDefault();
    const handleCopyCutPaste = (e: ClipboardEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+C, Ctrl+S, Ctrl+P, PrintScreen
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)) ||
        (e.ctrlKey && ['U', 'S', 'P'].includes(e.key)) ||
        (e.key === 'PrintScreen')
      ) {
        e.preventDefault();
      }
      // Disable Alt+Tab (not possible in browser), but warn
      if (e.altKey && e.key === 'Tab') {
        alert('Switching tabs is not allowed during the exam.');
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('copy', handleCopyCutPaste);
    document.addEventListener('cut', handleCopyCutPaste);
    document.addEventListener('paste', handleCopyCutPaste);
    document.addEventListener('keydown', handleKeyDown);
    // Clean up
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('copy', handleCopyCutPaste);
      document.removeEventListener('cut', handleCopyCutPaste);
      document.removeEventListener('paste', handleCopyCutPaste);
      document.removeEventListener('keydown', handleKeyDown);
      exitFullscreen();
    };
  }, []);

  // Back button/gesture handling
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      e.preventDefault();
      setPendingPopState(e);
      setShowBackConfirm(true);
      window.history.pushState(null, '', window.location.href); // Prevent actual back
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  // Accessibility: focus on question when changed
  const questionRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    questionRef.current?.focus();
  }, [currentQuestion]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < sampleExam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleQuestionJump = (questionIndex: number) => {
    setCurrentQuestion(questionIndex);
  };

  const handleSubmitExam = (auto?: boolean, violation?: boolean) => {
    if (auto) {
      if (violation) {
        setFullscreenWarning('You exited fullscreen too many times. The exam has been auto-submitted.');
      } else {
        alert('Time is up! Exam submitted automatically.');
      }
      setTimeout(() => {
        setSubmitting(true);
        setTimeout(() => {
          navigate("/exam-over");
        }, 2000);
      }, 1000);
      return;
    }
    setShowSubmitConfirm(true);
  };

  const confirmSubmit = () => {
    setShowSubmitConfirm(false);
    setSubmitting(true);
    setTimeout(() => {
      navigate("/exam-over");
    }, 2000);
  };

  const handleBackConfirm = (confirm: boolean) => {
    setShowBackConfirm(false);
    if (confirm) {
      setFullscreenViolations(v => {
        const newV = v + 1;
        if (newV >= FULLSCREEN_LIMIT) {
          setTimeout(() => handleSubmitExam(true, true), 500);
        }
        return newV;
      });
      // If limit not reached, stay on page (do not navigate away)
    } else {
      // Stay on page
      setPendingPopState(null);
    }
  };

  const currentQ = sampleExam.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / sampleExam.questions.length) * 100;

  return (
    <div className="exam-secure min-h-screen bg-background relative select-none">
      {/* Security Watermark */}
      <div className="exam-watermark pointer-events-none" />
      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen h-auto">
        {/* Top Bar */}
        <header className="bg-card border-b border-border w-full">
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center sm:items-stretch px-2 sm:px-4 md:px-12 py-4 md:py-6 gap-2 sm:gap-0 min-h-[80px]">
            {/* Left: Examify logo/name */}
            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start">
              <Shield className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <span className="text-xl md:text-2xl font-bold text-primary">Examify</span>
            </div>
            {/* Center: Exam title/desc */}
            <div className="flex flex-col items-center justify-center flex-1 w-full sm:w-auto text-center sm:static">
              <h1 className="text-lg md:text-2xl font-semibold text-foreground truncate max-w-full">{sampleExam.title}</h1>
              <p className="text-xs md:text-base text-muted-foreground truncate max-w-full">{sampleExam.description}</p>
            </div>
            {/* Right: Candidate info + Help */}
            <div className="flex items-center gap-2 sm:gap-6 w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0">
              <div className="text-center sm:text-right">
                <p className="text-base md:text-xl font-bold text-foreground">{candidateInfo.name}</p>
                <p className="text-xs md:text-base text-muted-foreground">{candidateInfo.organization}</p>
              </div>
              <Avatar className="h-10 w-10 md:h-16 md:w-16">
                <AvatarImage src={candidateInfo.avatar} alt={candidateInfo.name} />
                <AvatarFallback className="text-lg md:text-2xl">{candidateInfo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <button
                className="p-2 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Help"
                onClick={() => setHelpOpen(true)}
              >
                <HelpCircle className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </button>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <div className="flex flex-1 flex-col md:flex-row overflow-y-auto">
          {/* Question Area (70%) */}
          <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="text-sm">
                    Question {currentQuestion + 1} of {sampleExam.questions.length}
                  </Badge>
                  <div className="w-32 md:w-48 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
              <Card className={`p-4 md:p-8 question-card-bg select-none ${fullscreenViolations >= FULLSCREEN_LIMIT || submitting ? 'pointer-events-none opacity-60' : ''}`}>
                <h2
                  className="text-lg md:text-xl font-medium mb-6 leading-relaxed outline-none select-none"
                  tabIndex={-1}
                  ref={questionRef}
                  onContextMenu={e => e.preventDefault()}
                  onMouseDown={e => e.preventDefault()}
                  onTouchStart={e => e.preventDefault()}
                >
                  {currentQ.text}
                </h2>
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/50 select-none ${
                        answers[currentQ.id] === index 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border'
                      }`}
                      role="radio"
                      aria-checked={answers[currentQ.id] === index}
                      tabIndex={0}
                      onContextMenu={e => e.preventDefault()}
                      onMouseDown={e => e.preventDefault()}
                      onTouchStart={e => e.preventDefault()}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQ.id}`}
                        value={index}
                        checked={answers[currentQ.id] === index}
                        onChange={() => handleAnswerSelect(currentQ.id, index)}
                        className="sr-only"
                        tabIndex={-1}
                        aria-label={`Select option ${index + 1}`}
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        answers[currentQ.id] === index 
                          ? 'border-primary bg-primary' 
                          : 'border-muted-foreground'
                      }`}>
                        {answers[currentQ.id] === index && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-base select-none pointer-events-none">{option}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-between mt-8 gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={currentQuestion === sampleExam.questions.length - 1}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>
          </main>
          {/* Sidebar (30%) */}
          <aside className={`w-full md:w-96 bg-card border-t md:border-t-0 md:border-l border-border p-2 sm:p-4 md:p-8 overflow-y-auto flex-shrink-0 ${fullscreenViolations >= FULLSCREEN_LIMIT || submitting ? 'pointer-events-none opacity-60' : ''}`}>
            {/* Timer */}
            <Card className="p-6 md:p-8 mb-8 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-6 w-6 md:h-7 md:w-7 text-warning" />
                <span className="text-lg md:text-xl font-semibold">Time Remaining</span>
              </div>
              <div className={`text-3xl md:text-4xl font-mono font-extrabold tracking-widest ${timeLeft < 300 ? 'text-destructive' : 'text-foreground'}`}>{formatTime(timeLeft)}</div>
              {timeLeft < 300 && (
                <p className="text-sm text-destructive mt-2">⚠️ Less than 5 minutes left!</p>
              )}
            </Card>
            {/* Question Navigator */}
            <Card className="p-6 md:p-8 mb-8 shadow-lg">
              <h3 className="font-bold text-xl md:text-2xl mb-6">Question Navigator</h3>
              <div className="question-navigator flex flex-wrap gap-2 max-h-48 overflow-y-auto mb-6">
                {sampleExam.questions.map((_, index) => {
                  const isCurrent = currentQuestion === index;
                  const isAnswered = answers[index + 1] !== undefined;
                  let btnClass = "aspect-square p-0 text-base md:text-lg font-bold w-12 h-12 md:w-14 md:h-14 ";
                  let colorClass = "";
                  if (isCurrent) {
                    colorClass = "bg-primary text-white border-primary ring-2 ring-primary";
                  } else if (isAnswered) {
                    colorClass = "bg-green-500 text-white border-green-600 hover:bg-green-600";
                  } else {
                    colorClass = "bg-white text-foreground border-border hover:bg-muted";
                  }
                  return (
                    <button
                      key={index}
                      className={btnClass + colorClass + " border-2 rounded-lg transition-all duration-150 focus:outline-none"}
                      onClick={() => handleQuestionJump(index)}
                      aria-label={`Go to question ${index + 1}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 space-y-2 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-primary" />
                  <span>Current Question</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-border" />
                  <span>Not Answered</span>
                </div>
              </div>
            </Card>
            {/* Submit Button */}
            <Button
              onClick={() => handleSubmitExam(false)}
              className="w-full py-4 text-base md:text-xl font-bold rounded-xl mb-8 shadow-lg"
              size="lg"
              aria-label="Submit Test"
            >
              Submit Test
            </Button>
            {/* Stats */}
            <Card className="p-6 md:p-8 mt-2 shadow-lg text-lg md:text-xl">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Answered:</span>
                  <span className="font-bold">{Object.keys(answers).length}/{sampleExam.questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span className="font-bold">{sampleExam.questions.length - Object.keys(answers).length}</span>
                </div>
              </div>
            </Card>
          </aside>
        </div>
        {/* Footer */}
        <footer className="bg-destructive text-destructive-foreground px-4 md:px-6 py-3 sticky bottom-0 z-20">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">⚠️ No Cheating Allowed. This test is monitored.</span>
          </div>
        </footer>
        {/* Submit Confirmation Dialog */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-2">Submit Exam?</h2>
              <p className="mb-4 text-sm">You have answered {Object.keys(answers).length} out of {sampleExam.questions.length} questions. Are you sure you want to submit?</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowSubmitConfirm(false)}>Cancel</Button>
                <Button onClick={confirmSubmit}>Submit</Button>
              </div>
            </div>
          </div>
        )}
        {/* Submitting Overlay */}
        {submitting && (
          <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80">
            <span className="text-3xl font-bold text-primary mb-4">Submitting...</span>
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {/* Fullscreen Modal for re-entry */}
        <Dialog open={showFullscreenModal} onOpenChange={setShowFullscreenModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Fullscreen Required</DialogTitle>
              <DialogDescription>
                You must stay in fullscreen mode during the exam. Please click below to re-enter fullscreen. This will count as a warning if you do not comply.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                className="px-4 py-2 bg-primary text-white rounded-lg font-semibold"
                onClick={() => {
                  setShowFullscreenModal(false);
                  setTimeout(() => {
                    document.documentElement.requestFullscreen?.();
                    setTimeout(() => {
                      if (!document.fullscreenElement) {
                        setFullscreenViolations(v => {
                          const newV = v + 1;
                          if (newV >= FULLSCREEN_LIMIT) {
                            setTimeout(() => handleSubmitExam(true, true), 500);
                          }
                          return newV;
                        });
                      }
                    }, 500);
                  }, 100);
                }}
              >
                Re-enter Fullscreen
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Fullscreen Violation Warning */}
        {fullscreenWarning && !submitting && (
          <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center bg-destructive text-white text-lg font-bold py-4 px-6 shadow-lg animate-bounce-in">
            {fullscreenWarning}
          </div>
        )}
        {/* Back Navigation Confirmation Dialog */}
        <Dialog open={showBackConfirm} onOpenChange={setShowBackConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Exit Quiz?</DialogTitle>
              <DialogDescription>
                Are you sure you want to exit the quiz? This will count as a warning.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                className="px-4 py-2 bg-destructive text-white rounded-lg font-semibold"
                onClick={() => handleBackConfirm(true)}
              >
                Yes, Exit (Warning)
              </button>
              <button
                className="px-4 py-2 bg-muted text-foreground rounded-lg font-semibold"
                onClick={() => handleBackConfirm(false)}
              >
                Cancel
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {/* Help Dialog */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl"><HelpCircle className="h-6 w-6 text-primary" /> Exam Help</DialogTitle>
            <DialogDescription>
              <ul className="list-disc pl-6 space-y-2 mb-6 text-base">
                <li>Read each question carefully before answering.</li>
                <li>You can navigate between questions using the navigator.</li>
                <li>Answered questions are marked in green.</li>
                <li>Do not exit fullscreen or switch tabs during the exam.</li>
                <li>Cheating or suspicious activity will result in auto-submission.</li>
                <li>Click 'Submit Test' when you are done.</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <span className="text-base text-muted-foreground mr-auto">Please contact your exam coordinator for assistance.</span>
            <DialogClose asChild>
              <button className="px-4 py-2 bg-primary text-white rounded-lg font-semibold">Close</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 