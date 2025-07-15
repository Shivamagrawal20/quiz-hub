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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import SideNavigation from "./SideNavigation";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Player } from '@lottiefiles/react-lottie-player';
import Lottie from "lottie-react";
import { Badge } from "@/components/ui/badge";
import { getGlobalNotifications } from "@/lib/quizFirestore";

const Navbar = ({ showInDashboard = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const { isLoggedIn, setIsLoggedIn, role, signOut } = useAuth();

  // THEME STATE AND LOGIC
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') return true;
    if (storedTheme === 'light') return false;
    // Default to light mode on mobile
    const isMobileDevice = window.innerWidth <= 768;
    if (isMobileDevice) return false;
    // Otherwise, use system preference
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

  const handleProtectedLinkClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setIsAuthDialogOpen(true);
    }
  };

  // Notification dialog state
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [notifError, setNotifError] = useState("");
  // Fetch notifications from Firestore
  useEffect(() => {
    if (!showInDashboard) return;
    setLoadingNotifs(true);
    getGlobalNotifications()
      .then((data) => setNotifications(data))
      .catch(() => setNotifError("Failed to load notifications."))
      .finally(() => setLoadingNotifs(false));
  }, [showInDashboard]);
  const unreadCount = notifications.length; // Placeholder for unread

  // If we're in dashboard mode, show a different version of the navbar
  if (showInDashboard) {
    return (
      <>
        <nav className="w-full py-4 bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-sm dark:bg-gray-900/90 dark:border-b dark:border-gray-800">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <SideNavigation className="mr-1" />
              
              <Link to="/" className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <span className="font-bold text-xl">Examify</span>
              </Link>
            </div>

            {/* Dashboard Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {/* Show Admin Dashboard for admins, Dashboard for regular users */}
              {role === "admin" || role === "administrator" ? (
                <Link to="/admin-dashboard" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
                  <BarChart2 className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              ) : (
                <Link to="/dashboard" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
              <Link to="/quizzes" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                Quizzes
              </Link>
              <Link to="/settings" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <Link to="/help" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
                <HelpCircle className="h-4 w-4" />
                Help
              </Link>
              
              <Button onClick={toggleDarkMode} variant="outline" size="icon" className="ml-2">
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">Toggle Theme</span>
              </Button>
              
              {/* Notification Bell */}
              <Dialog open={isNotifOpen} onOpenChange={setIsNotifOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1">
                        <Badge className="px-1.5 py-0.5 text-xs bg-red-500 text-white">{unreadCount}</Badge>
                      </span>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[350px]">
                  <DialogHeader>
                    <DialogTitle>Notifications</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                    {loadingNotifs ? (
                      <span className="text-muted-foreground text-sm">Loading...</span>
                    ) : notifError ? (
                      <span className="text-destructive text-sm">{notifError}</span>
                    ) : notifications.length === 0 ? (
                      <span className="text-muted-foreground text-sm">No notifications.</span>
                    ) : (
                      notifications.slice(0, 5).map((notif) => (
                        <div key={notif.id} className="rounded-md bg-muted p-2">
                          <div className="font-medium">{notif.title}</div>
                          <div className="text-sm text-muted-foreground">{notif.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>
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
                    <Link to="/" className="flex w-full items-center text-destructive cursor-pointer" onClick={async () => {
                      await signOut();
                    }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Top Bar: Hamburger + Theme Toggle + Notifications */}
            <div className="flex md:hidden items-center gap-2">
              <Dialog open={isNotifOpen} onOpenChange={setIsNotifOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1">
                        <Badge className="px-1.5 py-0.5 text-xs bg-red-500 text-white">{unreadCount}</Badge>
                      </span>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[350px]">
                  <DialogHeader>
                    <DialogTitle>Notifications</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                    {loadingNotifs ? (
                      <span className="text-muted-foreground text-sm">Loading...</span>
                    ) : notifError ? (
                      <span className="text-destructive text-sm">{notifError}</span>
                    ) : notifications.length === 0 ? (
                      <span className="text-muted-foreground text-sm">No notifications.</span>
                    ) : (
                      notifications.slice(0, 5).map((notif) => (
                        <div key={notif.id} className="rounded-md bg-muted p-2">
                          <div className="font-medium">{notif.title}</div>
                          <div className="text-sm text-muted-foreground">{notif.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label="Toggle Menu"
              >
                <User className="h-5 w-5" />
              </Button>
              <Button
                onClick={toggleDarkMode}
                variant="outline"
                size="icon"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">Toggle Theme</span>
              </Button>
            </div>
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
                {isLoggedIn ? (
                  <>
                    {/* Only show Dashboard for non-admins */}
                    {(!role || (role !== "admin" && role !== "administrator")) && (
                      <Link
                        to="/dashboard"
                        className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                        onClick={toggleMenu}
                      >
                        <Home className="h-4 w-4" />
                        Dashboard
                      </Link>
                    )}
                    <Link
                      to="/quizzes"
                      className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                      onClick={toggleMenu}
                    >
                      <BookOpen className="h-4 w-4" />
                      Quizzes
                    </Link>
                    <Link
                      to="/settings"
                      className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                      onClick={toggleMenu}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <Link
                      to="/help"
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
                    <Link to="/" onClick={async () => {
                      toggleMenu();
                      await signOut();
                    }} className="flex items-center gap-2 text-destructive px-4 py-2">
                      <LogOut className="h-4 w-4" />
                      Log out
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleProtectedLinkClick}
                      className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2 opacity-50 cursor-not-allowed text-left w-full"
                    >
                      <BookOpen className="h-4 w-4" />
                      Quizzes
                    </button>
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
                    <Link
                      to="/signup"
                      className="px-4 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                      onClick={toggleMenu}
                    >
                      <UserPlus className="h-4 w-4" />
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>

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
  }

  // Public/default navbar for non-dashboard pages
  return (
    <>
      <nav className="w-full py-4 bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-sm dark:bg-gray-900/90 dark:border-b dark:border-gray-800">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="font-bold text-xl">Examify</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/about" className="font-medium hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="font-medium hover:text-primary transition-colors">Contact</Link>
            <Link to="/signin" className="font-medium hover:text-primary transition-colors">Sign In</Link>
            <Link to="/signup" className="font-medium hover:text-primary transition-colors">Sign Up</Link>
            <Button onClick={toggleDarkMode} variant="outline" size="icon">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle Theme</span>
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
