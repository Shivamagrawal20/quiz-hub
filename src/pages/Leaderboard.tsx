
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Leaderboard = () => {
  const isMobile = useIsMobile();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const features = [
    "Global and class-specific leaderboards",
    "Rankings by subject and overall performance",
    "Weekly, monthly, and all-time rankings",
    "Earn badges and achievements for top positions",
    "Create friendly competitions with your friends"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showInDashboard />
      
      <main className="flex-grow pt-20">
        <div className="container px-4 py-6">
          {/* Mobile back link */}
          {isMobile && (
            <div className="mb-4">
              <Link 
                to="/userhub" 
                className="inline-flex items-center space-x-2 text-primary font-medium hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Hub</span>
              </Link>
            </div>
          )}
          
          <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
          
          <ComingSoon 
            title="Leaderboard"
            subtitle="Compete with friends and classmates"
            features={features}
            buttonText="Coming Soon"
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
