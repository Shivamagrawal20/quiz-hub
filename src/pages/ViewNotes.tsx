
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SidePanel from "@/components/SidePanel";
import ComingSoon from "@/components/ComingSoon";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ViewNotes = () => {
  const isMobile = useIsMobile();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const features = [
    "Searchable notes library organized by subject and topic",
    "Categorized notes with tags for easy filtering",
    "Ability to bookmark your favorite study materials",
    "Download notes as PDF for offline studying",
    "Interactive flashcards generated from notes"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="flex flex-col md:flex-row h-full">
          {/* Side Panel for larger devices */}
          {!isMobile && (
            <SidePanel className="fixed left-0 top-20 bottom-0 w-56 hidden md:block" />
          )}
          
          <div className={`w-full ${!isMobile ? 'md:ml-56' : ''}`}>
            {/* Mobile back link */}
            {isMobile && (
              <div className="px-4 py-4">
                <Link 
                  to="/userhub" 
                  className="inline-flex items-center space-x-2 text-primary font-medium hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Hub</span>
                </Link>
              </div>
            )}
            
            <div className="container px-4 py-6">
              <h1 className="text-3xl font-bold mb-6">View Notes</h1>
              
              <ComingSoon 
                title="Notes Library"
                subtitle="Access and organize study materials"
                features={features}
                buttonText="Coming Soon"
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ViewNotes;
