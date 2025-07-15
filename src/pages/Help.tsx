import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpCenter } from "@/components/dashboard/HelpCenter";

export default function Help() {
  const { isLoggedIn } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showInDashboard={isLoggedIn} />
      <main className="flex-grow pt-20 bg-background py-8 px-2 sm:px-4 md:px-8">
        <div className="w-full max-w-4xl mx-auto">
          <HelpCenter />
        </div>
      </main>
      <Footer />
    </div>
  );
} 