
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ArrowLeft, BookOpen, History, Upload, Trophy } from "lucide-react";

interface SidePanelProps {
  backTo?: string;
  backLabel?: string;
  className?: string;
}

const SidePanel = ({ backTo = "/userhub", backLabel = "Back to Hub", className }: SidePanelProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <div className={cn("bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 overflow-y-auto", className)}>
      <div className="flex flex-col space-y-4">
        <Link to={backTo} className="flex items-center space-x-2 text-primary font-medium hover:underline">
          <ArrowLeft className="h-4 w-4" />
          <span>{backLabel}</span>
        </Link>
        
        <div className="py-2 border-t border-gray-200 dark:border-gray-800"></div>
        
        <Link to="/view-notes" className={cn("flex items-center space-x-2 py-2 px-3 rounded-md", 
          isActive("/view-notes") ? "bg-primary/10 text-primary font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-800")}>
          <BookOpen className="h-5 w-5" />
          <span>View Notes</span>
        </Link>
        
        <Link to="/upload-notes" className={cn("flex items-center space-x-2 py-2 px-3 rounded-md", 
          isActive("/upload-notes") ? "bg-primary/10 text-primary font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-800")}>
          <Upload className="h-5 w-5" />
          <span>Upload Notes</span>
        </Link>
        
        <Link to="/quiz-history" className={cn("flex items-center space-x-2 py-2 px-3 rounded-md", 
          isActive("/quiz-history") ? "bg-primary/10 text-primary font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-800")}>
          <History className="h-5 w-5" />
          <span>Quiz History</span>
        </Link>
        
        <Link to="/leaderboard" className={cn("flex items-center space-x-2 py-2 px-3 rounded-md", 
          isActive("/leaderboard") ? "bg-primary/10 text-primary font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-800")}>
          <Trophy className="h-5 w-5" />
          <span>Leaderboard</span>
        </Link>
      </div>
    </div>
  );
};

export default SidePanel;
