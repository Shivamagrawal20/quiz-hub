
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";

const Leaderboard = () => {
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
