
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";

const ViewNotes = () => {
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
      <Navbar showInDashboard />
      
      <main className="flex-grow pt-20">
        <div className="container px-4 py-6">
          <h1 className="text-3xl font-bold mb-6">View Notes</h1>
          
          <ComingSoon 
            title="Notes Library"
            subtitle="Access and organize study materials"
            features={features}
            buttonText="Coming Soon"
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ViewNotes;
