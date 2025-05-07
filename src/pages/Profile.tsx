
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProfileSection } from "@/components/dashboard/ProfileSection";

const Profile = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showInDashboard />
      
      <main className="flex-grow pt-20">
        <div className="container px-4 py-6">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          
          <ProfileSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
