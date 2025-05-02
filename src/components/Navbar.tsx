
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full py-4 bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-sm">
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
          <Link to="/quiz-section" className="font-medium hover:text-primary transition-colors">
            Quizzes
          </Link>
          <Link to="#" className="font-medium hover:text-primary transition-colors">
            About
          </Link>
          <Link to="#" className="font-medium hover:text-primary transition-colors">
            Contact
          </Link>
          <Button size="sm">Sign In</Button>
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md animate-fade-in">
          <div className="flex flex-col p-4 gap-4">
            <Link
              to="/"
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/quiz-section"
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={toggleMenu}
            >
              Quizzes
            </Link>
            <Link
              to="#"
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              to="#"
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            <Button className="w-full">Sign In</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
