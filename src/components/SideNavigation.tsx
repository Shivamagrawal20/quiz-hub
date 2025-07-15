import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
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
  Settings,
  UserPlus,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SideNavigationProps {
  className?: string;
}

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

interface NavLinkItem {
  to: string;
  icon: React.ElementType;
  label: string;
  onClick?: (e: React.MouseEvent) => void;
}

const NavLink = ({ to, icon: Icon, label, isActive, onClick }: NavLinkProps) => (
  <Link 
    to={to} 
    onClick={onClick}
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
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { isLoggedIn, setIsLoggedIn, role } = useAuth();

  const isActive = (path: string) => currentPath === path;
  
  const handleProtectedLinkClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setIsAuthDialogOpen(true);
    }
  };

  // Links visible to all users
  const publicLinks: NavLinkItem[] = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/about", icon: Users, label: "About Us" },
    { to: "/contact", icon: Bell, label: "Contact" },
    { to: "/help", icon: HelpCircle, label: "Help" },
  ];
  
  // Links for regular users
  const userLinks: NavLinkItem[] = [
    // Only include 'User Hub' and 'Dashboard' if not admin
    ...(role !== "admin" && role !== "administrator" ? [
      { to: "/userhub", icon: Home, label: "User Hub", onClick: handleProtectedLinkClick },
      { to: "/dashboard", icon: BarChart2, label: "Dashboard", onClick: handleProtectedLinkClick },
    ] : []),
    { to: "/quizzes", icon: BookText, label: "Take Quiz", onClick: handleProtectedLinkClick },
    { to: "/quiz-history", icon: History, label: "Quiz History", onClick: handleProtectedLinkClick },
    { to: "/leaderboard", icon: Trophy, label: "Leaderboard", onClick: handleProtectedLinkClick },
    { to: "/upload-notes", icon: Upload, label: "Upload Notes", onClick: handleProtectedLinkClick },
    { to: "/view-notes", icon: BookOpen, label: "View Notes", onClick: handleProtectedLinkClick },
    { to: "/notifications", icon: Bell, label: "Notifications", onClick: handleProtectedLinkClick },
    { to: "/my-profile", icon: User, label: "My Profile", onClick: handleProtectedLinkClick },
    { to: "/settings", icon: Settings, label: "Settings", onClick: handleProtectedLinkClick },
  ];

  // Links for admin/administrator
  const adminLinks: NavLinkItem[] = [
    { to: "/admin-dashboard", icon: BarChart2, label: "Admin Dashboard", onClick: handleProtectedLinkClick },
    { to: "/manage-users", icon: Users, label: "Manage Users", onClick: handleProtectedLinkClick },
    { to: "/site-settings", icon: Settings, label: "Site Settings", onClick: handleProtectedLinkClick },
    // Add more admin-only links as needed
  ];

  // Auth links based on login status
  const authLinks = isLoggedIn ? [
    { 
      to: "/", 
      icon: LogOut, 
      label: "Log Out",
      onClick: () => {
        setIsLoggedIn(false);
      }
    }
  ] : [
    { to: "/signin", icon: LogIn, label: "Sign In" },
    { to: "/signup", icon: User, label: "Sign Up" }
  ];

  // Combine the appropriate links based on login status and role
  let links = [...publicLinks];
  if (isLoggedIn) {
    if (role === "admin" || role === "administrator") {
      links = [...adminLinks, ...userLinks, ...publicLinks];
    } else {
      links = [...userLinks, ...publicLinks];
    }
  }

  return (
    <>
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
              <img src="/examify.png" alt="Examify Logo" className="h-10 w-10 rounded-md object-cover bg-primary" />
              <span className="font-bold text-xl">Examify</span>
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
                onClick={link.onClick}
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
                onClick={link.onClick}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Authentication Dialog */}
      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              Please sign in or create an account to access this feature.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Link to="/signin" onClick={() => setIsAuthDialogOpen(false)}>
              <Button className="w-full flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
            <Link to="/signup" onClick={() => setIsAuthDialogOpen(false)}>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Create Account
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SideNavigation;
