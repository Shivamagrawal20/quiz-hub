
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const UploadNotes = () => {
  const isMobile = useIsMobile();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const features = [
    "Upload PDF, Word documents, and markdown files",
    "Add tags and categories to organize your notes",
    "Collaborate with classmates on shared study materials",
    "Earn points for uploading quality study materials",
    "Auto-generation of practice questions from your notes"
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
          
          <h1 className="text-3xl font-bold mb-6">Upload Notes</h1>
          
          <ComingSoon 
            title="Notes Upload"
            subtitle="Share your study materials with others"
            features={features}
            buttonText="Coming Soon"
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UploadNotes;
