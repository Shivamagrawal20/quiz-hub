import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UserSettings } from "@/components/dashboard/UserSettings";

export default function Settings() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-background py-6 px-2 sm:px-4 md:px-8">
        <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto">
          <UserSettings />
        </div>
      </div>
      <Footer />
    </>
  );
}
