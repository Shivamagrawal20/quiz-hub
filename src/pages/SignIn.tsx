import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/use-toast";
import { LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  const [cardRef, cardRevealed] = useScrollReveal<HTMLDivElement>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      try {
        console.log("Checking Firestore doc for:", userCredential.user.uid);
        const userDocRef = doc(db, "users", userCredential.user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
          console.log("User doc does not exist, creating...");
          await setDoc(userDocRef, {
            email: userCredential.user.email,
            name: userCredential.user.displayName || "",
            role: "user",
          });
          console.log("User doc created!");
        } else {
          console.log("User doc already exists.");
        }
      } catch (firestoreError) {
        console.error("Error writing user to Firestore:", firestoreError);
      }
      toast({
        title: "Sign In Successful",
        description: "Welcome back to Examify!",
      });
      navigate("/userhub");
    } catch (error: any) {
      let message = error.message;
      if (error.code === "auth/user-not-found") {
        message = "No account found with this email. Please sign up first.";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password. Please try again.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many failed attempts. Please try again later or reset your password.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address. Please check and try again.";
      }
      toast({
        title: "Sign In Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      // Check if user exists in Firestore
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        // User not registered, sign out and show message
        await auth.signOut();
        toast({
          title: "Sign In Blocked",
          description: "No account found for this Google account. Please sign up first.",
          variant: "destructive",
        });
        return;
      }
      // User exists, proceed as normal
      toast({
        title: "Sign In Successful",
        description: "Welcome back to Examify!",
      });
      navigate("/userhub");
    } catch (error: any) {
      toast({
        title: "Google Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 flex items-center justify-center bg-secondary/10">
        {/* Hero Section with Video Background */}
        <div className="relative w-full flex justify-center items-center min-h-[60vh] pt-8 md:pt-16 px-2 sm:px-4" style={{ zIndex: 1 }}>
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center max-h-[600px] sm:max-h-[700px] md:max-h-[800px]"
              style={{ minHeight: '100%', minWidth: '100%' }}
              poster="/examify.png"
            >
              <source src="/Examify.mp4" type="video/mp4" />
            </video>
            {/* Overlay for contrast */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 md:py-16 relative z-10 flex justify-center items-center w-full">
            <div ref={cardRef} className={`w-full max-w-xs sm:max-w-sm md:max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transition-all duration-700 ${cardRevealed ? 'reveal-in' : 'reveal-hidden'}`}>
              <div className="p-4 sm:p-6 md:p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold">Sign In</h2>
                  <p className="text-muted-foreground">Welcome back! Please sign in to your account.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a2 2 0 01-2 2H8a2 2 0 01-2-2v-1"></path></svg>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 pr-10"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c-4.97 0-9 3.58-9 8s4.03 8 9 8 9-3.58 9-8-4.03-8-9-8zm0 0v8"></path></svg>
                      </span>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6 0a6 6 0 1112 0 6 6 0 01-12 0z"></path></svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.97 0-9-3.58-9-8 0-1.61.47-3.13 1.29-4.44M21 21l-6-6"></path></svg>
                        )}
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary text-white py-3 text-base md:text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full animate-spin"></span>
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </span>
                    )}
                  </Button>
                </form>
                <div className="flex items-center my-6">
                  <div className="flex-grow h-px bg-gray-200"></div>
                  <span className="mx-4 text-gray-400">or</span>
                  <div className="flex-grow h-px bg-gray-200"></div>
                </div>
                <Button
                  type="button"
                  className="w-full bg-red-500 hover:bg-red-600 text-white mb-2 py-3 text-base md:text-lg"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full animate-spin"></span>
                      Signing in with Google...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.18v2.92h5.98c-.26 1.36-1.56 4-5.98 4-3.6 0-6.54-2.97-6.54-6.62s2.94-6.62 6.54-6.62c2.05 0 3.43.82 4.22 1.53l2.89-2.8C17.09 2.99 14.77 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10c5.73 0 9.5-4.01 9.5-9.64 0-.65-.07-1.14-.15-1.26z"/></svg>
                      Sign in with Google
                    </span>
                  )}
                </Button>
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-primary hover:underline">
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Scrolling Announcement */}
        <div className="w-full overflow-x-auto whitespace-nowrap bg-primary/10 py-2 mb-4 fixed top-20 left-0 z-30">
          <div className="animate-marquee inline-block min-w-full text-primary font-semibold text-base md:text-lg px-4">
            🔒 Secure Sign In: Your privacy and security are our top priority at Examify! 🔒
          </div>
        </div>
      </main>
      <Footer />
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 18s linear infinite;
        }
        .reveal-hidden {
          opacity: 0;
          transform: translateY(40px);
        }
        .reveal-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default SignIn;
