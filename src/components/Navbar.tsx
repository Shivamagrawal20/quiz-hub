
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogIn, UserPlus, User, Home, Settings, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = ({ showInDashboard = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // If we're in dashboard mode, show a different version of the navbar
  if (showInDashboard) {
    return (
      <nav className="w-full py-4 bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-sm dark:bg-gray-900/90 dark:border-b dark:border-gray-800">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className="font-bold text-xl">QuizHub</span>
          </Link>

          {/* Dashboard Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/userhub" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <Link to="/quizzes" className="font-medium hover:text-primary transition-colors">
              Quizzes
            </Link>
            <Link to="/about" className="font-medium hover:text-primary transition-colors">
              About
            </Link>
            
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
                  <Link to="/profile" className="flex w-full items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex w-full items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
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
            className="md:hidden"
            aria-label="Toggle Menu"
          >
            <Menu />
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
                to="/quizzes"
                className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
                onClick={toggleMenu}
              >
                Quizzes
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link
                to="/profile"
                className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                onClick={toggleMenu}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link
                to="/settings"
                className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                onClick={toggleMenu}
              >
                <Settings className="h-4 w-4" />
                Settings
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
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xl">Q</span>
          </div>
          <span className="font-bold text-xl">QuizHub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/quizzes" className="font-medium hover:text-primary transition-colors">
            Quizzes
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
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMenu}
          className="md:hidden"
          aria-label="Toggle Menu"
        >
          <Menu />
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
              to="/quizzes"
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={toggleMenu}
            >
              Quizzes
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
