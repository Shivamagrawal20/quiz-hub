import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import QuizSection from "./pages/QuizSection";
import Quizzes from "./pages/Quizzes";
import Quiz from "./pages/Quiz";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Dashboard from "./pages/Dashboard";
import UserHub from "./pages/UserHub";
import ViewNotes from "./pages/ViewNotes";
import UploadNotes from "./pages/UploadNotes";
import QuizHistory from "./pages/QuizHistory";
import Leaderboard from "./pages/Leaderboard";
import Notifications from "./pages/Notifications";
import MyProfile from "./pages/MyProfile";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminQuizEditPage from "./pages/AdminQuizEditPage";
import ManageUsers from "./pages/ManageUsers";
import SiteSettings from "./pages/SiteSettings";
import { useScrollToTop } from "./hooks/useScrollToTop";
import { AuthProvider } from "@/contexts/AuthContext";
import { SiteSettingsProvider, useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import Help from "./pages/Help";
import ExamOver from "./pages/ExamOver";
import AdminAIGeneratedQuiz from "./pages/AdminAIGeneratedQuiz";
import Achievements from "./pages/Achievements";
import BadgeTest from "./pages/BadgeTest";

const queryClient = new QueryClient();

// ScrollToTop component to handle scrolling on route changes
const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

function MaintenancePage({ announcement }: { announcement: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-lg w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-primary mb-4">We'll be back soon!</h1>
        <p className="text-lg text-muted-foreground mb-4 text-center">The site is currently undergoing maintenance. Please check back later.</p>
        {announcement && <div className="bg-primary/10 text-primary px-4 py-2 rounded mb-2 text-center">{announcement}</div>}
        <span className="text-xs text-gray-400">If you are an admin, you can still access the site.</span>
      </div>
    </div>
  );
}

const AppRoutes = () => {
  const { maintenanceMode, announcement, loading } = useSiteSettings();
  const { role, isLoggedIn } = useAuth();
  const isAdmin = isLoggedIn && (role === "admin" || role === "administrator");

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground text-lg">Loading site settings...</div>;
  }
  if (maintenanceMode && !isAdmin) {
    return <MaintenancePage announcement={announcement} />;
  }
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index" element={<Index />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/userhub" element={<UserHub />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz-section" element={<QuizSection />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/exam-over" element={<ExamOver />} />
        <Route path="/admin-ai-quiz" element={<AdminAIGeneratedQuiz />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/view-notes" element={<ViewNotes />} />
        <Route path="/upload-notes" element={<UploadNotes />} />
        <Route path="/quiz-history" element={<QuizHistory />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-dashboard/quiz/:quizId/edit" element={<AdminQuizEditPage />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/site-settings" element={<SiteSettings />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/badge-test" element={<BadgeTest />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <AuthProvider>
          <SiteSettingsProvider>
            <AppRoutes />
          </SiteSettingsProvider>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
