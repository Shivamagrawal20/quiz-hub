
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Menu, 
  BookOpen, 
  Upload, 
  History, 
  Trophy, 
  BarChart2,
  Home,
  BookText,
  Users,
  Bell,
  User,
  LogIn,
  LogOut,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SideNavigationProps {
  className?: string;
}

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const NavLink = ({ to, icon: Icon, label, isActive }: NavLinkProps) => (
  <Link 
    to={to} 
    className={cn(
      "flex items-center gap-3 py-2 px-3 rounded-md transition-colors",
      isActive 
        ? "bg-primary/10 text-primary font-medium" 
        : "hover:bg-gray-100 dark:hover:bg-gray-800"
    )}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </Link>
);

const SideNavigation = ({ className }: SideNavigationProps) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  
  // Simulate logged in state (in a real app this would come from auth context)
  const isLoggedIn = true;

  // Links visible to all users
  const publicLinks = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/quizzes", icon: BookText, label: "Take Quiz" },
    { to: "/about", icon: Users, label: "About Us" },
    { to: "/contact", icon: Bell, label: "Contact" },
  ];
  
  // Links visible only to logged in users
  const privateLinks = [
    { to: "/userhub", icon: Home, label: "User Hub" },
    { to: "/dashboard", icon: BarChart2, label: "Dashboard" },
    { to: "/quiz-history", icon: History, label: "Quiz History" },
    { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { to: "/upload-notes", icon: Upload, label: "Upload Notes" },
    { to: "/view-notes", icon: BookOpen, label: "View Notes" },
    { to: "/notifications", icon: Bell, label: "Notifications" },
    { to: "/profile", icon: User, label: "My Profile" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];
  
  // Auth links based on login status
  const authLinks = isLoggedIn ? [
    { to: "/", icon: LogOut, label: "Log Out" }
  ] : [
    { to: "/signin", icon: LogIn, label: "Sign In" },
    { to: "/signup", icon: User, label: "Sign Up" }
  ];

  // Combine the appropriate links based on login status
  const links = isLoggedIn 
    ? [...privateLinks, ...publicLinks] 
    : [...publicLinks];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className="font-bold text-xl">QuizHub</span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 flex flex-col space-y-2">
          {links.map((link) => (
            <NavLink 
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              isActive={isActive(link.to)}
            />
          ))}
          
          {/* Separator before auth links */}
          <div className="h-px bg-gray-200 dark:bg-gray-800 my-2"></div>
          
          {/* Auth links */}
          {authLinks.map((link) => (
            <NavLink 
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              isActive={isActive(link.to)}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideNavigation;
