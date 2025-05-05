
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListCheck, LoaderCircle, Clock, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface QuizCardProps {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  completionRate?: number;
}

const difficultyColors = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800"
};

const QuizCard = ({ 
  id, 
  title, 
  description, 
  questionCount, 
  category, 
  difficulty,
  completionRate
}: QuizCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showFullscreenDialog, setShowFullscreenDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleStartQuiz = () => {
    // Show fullscreen permission dialog instead of directly loading
    setShowFullscreenDialog(true);
  };
  
  const handleConfirmStart = () => {
    setShowFullscreenDialog(false);
    setIsLoading(true);
    
    // Request fullscreen before navigating
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen().then(() => {
          // Show success toast when entering fullscreen
          toast({
            title: "Fullscreen Mode",
            description: "Quiz is now in fullscreen mode for better experience.",
          });
          
          // Navigate to quiz after a short delay
          setTimeout(() => {
            navigate(`/quiz/${id}`);
          }, 800);
        }).catch((error) => {
          // Handle case where fullscreen is rejected
          toast({
            title: "Fullscreen Required",
            description: "This quiz requires fullscreen mode. Please allow it to continue.",
            variant: "destructive",
          });
          setIsLoading(false);
        });
      } else {
        // Fallback for browsers that don't support fullscreen
        toast({
          title: "Fullscreen Not Supported",
          description: "Your browser doesn't support fullscreen mode. Quiz will start normally.",
        });
        setTimeout(() => {
          navigate(`/quiz/${id}`);
        }, 800);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
      // Fallback navigation if fullscreen fails
      setTimeout(() => {
        navigate(`/quiz/${id}`);
      }, 800);
    }
  };
  
  const handleCancelStart = () => {
    setShowFullscreenDialog(false);
  };
  
  return (
    <>
      <Card 
        className={`quiz-card-hover overflow-hidden h-full flex flex-col transition-all duration-300 ${
          isHovered ? "shadow-lg translate-y-[-8px]" : "hover:shadow-md hover:translate-y-[-4px]"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`h-2 w-full ${difficulty === "easy" ? "bg-green-400" : difficulty === "medium" ? "bg-yellow-400" : "bg-red-400"}`} />
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>{title}</CardTitle>
            <Badge className={difficultyColors[difficulty]} variant="outline">
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ListCheck size={16} />
            <span>{questionCount} questions</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mt-2">
            <Clock size={16} />
            <span>Estimated time: {Math.round(questionCount * 1.5)} min</span>
          </div>
          
          {completionRate !== undefined && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Completion rate</span>
                <span className="text-xs font-medium">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-1.5" />
            </div>
          )}
          
          <Badge variant="outline" className="mt-3">
            {category}
          </Badge>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button 
            className="w-full relative" 
            onClick={handleStartQuiz}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Loading Quiz...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Take Quiz
                <TrendingUp className={`h-4 w-4 transition-transform ${isHovered ? "translate-x-1" : ""}`} />
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Fullscreen permission dialog */}
      <Dialog open={showFullscreenDialog} onOpenChange={setShowFullscreenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quiz Requires Fullscreen Mode</DialogTitle>
            <DialogDescription>
              This quiz will run in fullscreen mode for better focus and to prevent cheating.
            </DialogDescription>
          </DialogHeader>
          
          <Alert className="mt-4 bg-blue-50 text-blue-800 border-blue-200">
            <AlertTitle className="text-blue-800">Important Information</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>The quiz will open in fullscreen mode</li>
                <li>Exiting fullscreen will trigger security warnings</li>
                <li>Multiple security violations may terminate the quiz</li>
                <li>Please ensure you won't be disturbed during the quiz</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={handleCancelStart}>
              Cancel
            </Button>
            <Button onClick={handleConfirmStart} className="bg-primary">
              Proceed to Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuizCard;
