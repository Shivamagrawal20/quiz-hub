import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, User, Home, Settings, LogOut, ChevronDown, Bell, History, Sun, Moon, BookOpen, Trophy, BarChart2, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import SideNavigation from "./SideNavigation";

const Navbar = ({ showInDashboard = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // THEME STATE AND LOGIC
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') return true;
    if (storedTheme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // If we're in dashboard mode, show a different version of the navbar
  if (showInDashboard) {
    return (
      <nav className="w-full py-4 bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-sm dark:bg-gray-900/90 dark:border-b dark:border-gray-800">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <SideNavigation className="mr-1" />
            
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <span className="font-bold text-xl">QuizHub</span>
            </Link>
          </div>

          {/* Dashboard Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/userhub" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <Link to="/dashboard" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link to="/quizzes" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Quizzes
            </Link>
            <Link to="/leaderboard" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </Link>
            <Link to="/dashboard?view=performance" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              Performance
            </Link>
            <Link to="/dashboard?view=settings" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Link to="/dashboard?view=help" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              Help
            </Link>
            
            <Button onClick={toggleDarkMode} variant="outline" size="icon" className="ml-2">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle Theme</span>
            </Button>
            
            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Profile
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/notifications" className="flex w-full items-center cursor-pointer">
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/quiz-history" className="flex w-full items-center cursor-pointer">
                    <History className="mr-2 h-4 w-4" />
                    <span>Quiz History</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-profile" className="flex w-full items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="flex w-full items-center text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="md:flex lg:hidden"
            aria-label="Toggle Menu"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md animate-fade-in dark:bg-gray-900 dark:border-b dark:border-gray-800">
            <div className="flex flex-col p-4 gap-4">
              <Link
                to="/userhub"
                className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                onClick={toggleMenu}
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
              <Link
                to="/dashboard"
                className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                onClick={toggleMenu}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/quizzes"
                className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                onClick={toggleMenu}
              >
                <BookOpen className="h-4 w-4" />
                Quizzes
              </Link>
              <Link
                to="/leaderboard"
                className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                onClick={toggleMenu}
              >
                <Trophy className="h-4 w-4" />
                Leaderboard
              </Link>
              <Link
                to="/dashboard?view=performance"
                className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                onClick={toggleMenu}
              >
                <BarChart2 className="h-4 w-4" />
                Performance
              </Link>
              <Link
                to="/dashboard?view=settings"
                className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                onClick={toggleMenu}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <Link
                to="/dashboard?view=help"
                className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                onClick={toggleMenu}
              >
                <HelpCircle className="h-4 w-4" />
                Help
              </Link>
              <Link
                to="/notifications"
                className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                onClick={toggleMenu}
              >
                <Bell className="h-4 w-4" />
                Notifications
              </Link>
              <Link
                to="/quiz-history"
                className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                onClick={toggleMenu}
              >
                <History className="h-4 w-4" />
                Quiz History
              </Link>
              <Link
                to="/my-profile"
                className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                onClick={toggleMenu}
              >
                <User className="h-4 w-4" />
                My Profile
              </Link>
              <Link to="/" onClick={toggleMenu} className="flex items-center gap-2 text-destructive px-4 py-2">
                <LogOut className="h-4 w-4" />
                Log out
              </Link>
            </div>
          </div>
        )}
      </nav>
    );
  }

  // Original navbar for non-dashboard pages - now with profile dropdown for logged-in users
  return (
    <nav className="w-full py-4 bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-sm dark:bg-gray-900/90 dark:border-b dark:border-gray-800">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <SideNavigation className="mr-1" />
          
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className="font-bold text-xl">QuizHub</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/dashboard" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link to="/quizzes" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            Quizzes
          </Link>
          <Link to="/leaderboard" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </Link>
          <Link to="/dashboard?view=performance" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
            <BarChart2 className="h-4 w-4" />
            Performance
          </Link>
          <Link to="/dashboard?view=settings" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <Link to="/dashboard?view=help" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            Help
          </Link>
          <Link to="/about" className="font-medium hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/contact" className="font-medium hover:text-primary transition-colors">
            Contact
          </Link>
          <Link to="/signin">
            <Button size="sm" variant="ghost" className="flex items-center gap-1">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              Sign Up
            </Button>
          </Link>
          <Button onClick={toggleDarkMode} variant="outline" size="icon" className="ml-2">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle Theme</span>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMenu}
          className="md:hidden"
          aria-label="Toggle Menu"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md animate-fade-in dark:bg-gray-900 dark:border-b dark:border-gray-800">
          <div className="flex flex-col p-4 gap-4">
            <Link
              to="/"
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
              onClick={toggleMenu}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/quizzes"
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
              onClick={toggleMenu}
            >
              <BookOpen className="h-4 w-4" />
              Quizzes
            </Link>
            <Link
              to="/leaderboard"
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
              onClick={toggleMenu}
            >
              <Trophy className="h-4 w-4" />
              Leaderboard
            </Link>
            <Link
              to="/dashboard?view=performance"
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
              onClick={toggleMenu}
            >
              <BarChart2 className="h-4 w-4" />
              Performance
            </Link>
            <Link
              to="/dashboard?view=settings"
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
              onClick={toggleMenu}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Link
              to="/dashboard?view=help"
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
              onClick={toggleMenu}
            >
              <HelpCircle className="h-4 w-4" />
              Help
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            <Link
              to="/signin"
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
              onClick={toggleMenu}
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
            <Link to="/signup" onClick={toggleMenu}>
              <Button className="w-full flex items-center gap-1">
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
