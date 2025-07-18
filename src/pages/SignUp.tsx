import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/use-toast";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  const [cardRef, cardRevealed] = useScrollReveal();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setIsLoading(true);
    // Split full name into first and last name
    const [firstName, ...rest] = name.trim().split(" ");
    const lastName = rest.join(" ");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true); // Optional, context will update automatically
      // Debug: Log before Firestore write
      console.log("Attempting to write user to Firestore:", userCredential.user.uid);
      try {
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          name,
          firstName: firstName || "",
          lastName: lastName || "",
          role: "user",
        });
        console.log("Successfully wrote user to Firestore!");
      } catch (firestoreError) {
        console.error("Error writing user to Firestore:", firestoreError);
      }
      toast({
        title: "Account Created",
        description: "Welcome to Examify! You're now registered.",
      });
      navigate("/userhub");
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      setIsLoggedIn(true); // Optional, context will update automatically
      // Debug: Log before Firestore write
      console.log("Attempting to write Google user to Firestore:", userCredential.user.uid);
      // Split displayName into first and last name
      const displayName = userCredential.user.displayName || "";
      const [firstName, ...rest] = displayName.trim().split(" ");
      const lastName = rest.join(" ");
      try {
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          name: displayName,
          firstName: firstName || "",
          lastName: lastName || "",
          role: "user",
        }, { merge: true });
        console.log("Successfully wrote Google user to Firestore!");
      } catch (firestoreError) {
        console.error("Error writing Google user to Firestore:", firestoreError);
      }
      toast({
        title: "Sign Up Successful",
        description: "Welcome to Examify!",
      });
      navigate("/userhub");
    } catch (error: any) {
      toast({
        title: "Google Sign Up Failed",
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
              className="w-full h-full object-cover object-center max-h-[400px] sm:max-h-[600px] md:max-h-[800px]"
              style={{ minHeight: '100%', minWidth: '100%' }}
              poster="/examify.png"
            >
              <source src="/Examify.mp4" type="video/mp4" />
            </video>
            {/* Overlay for contrast */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-10 md:py-16 relative z-10 flex justify-center items-center w-full">
            <div ref={cardRef} className={`w-full max-w-xs sm:max-w-sm md:max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transition-all duration-700 ${cardRevealed ? 'reveal-in' : 'reveal-hidden'}`}
              style={{ boxSizing: 'border-box' }}>
              <div className="p-4 sm:p-6 md:p-8">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold">Create Account</h2>
                  <p className="text-muted-foreground text-sm sm:text-base">Join Examify and test your knowledge</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input 
                        id="confirmPassword" 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={passwordError ? "border-destructive pl-10 pr-10" : "pl-10 pr-10"}
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c-4.97 0-9 3.58-9 8s4.03 8 9 8 9-3.58 9-8-4.03-8-9-8zm0 0v8"></path></svg>
                      </span>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6 0a6 6 0 1112 0 6 6 0 01-12 0z"></path></svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.97 0-9-3.58-9-8 0-1.61.47-3.13 1.29-4.44M21 21l-6-6"></path></svg>
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-sm text-destructive">{passwordError}</p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-base md:text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full animate-spin"></span>
                        Creating Account...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Sign Up
                      </span>
                    )}
                  </Button>
                </form>
                <div className="flex items-center my-4 sm:my-6">
                  <div className="flex-grow h-px bg-gray-200"></div>
                  <span className="mx-2 sm:mx-4 text-gray-400">or</span>
                  <div className="flex-grow h-px bg-gray-200"></div>
                </div>
                <Button
                  type="button"
                  className="w-full bg-red-500 hover:bg-red-600 text-white mb-2 py-3 text-base md:text-lg"
                  onClick={handleGoogleSignUp}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full animate-spin"></span>
                      Signing up with Google...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.18v2.92h5.98c-.26 1.36-1.56 4-5.98 4-3.6 0-6.54-2.97-6.54-6.62s2.94-6.62 6.54-6.62c2.05 0 3.43.82 4.22 1.53l2.89-2.8C17.09 2.99 14.77 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10c5.73 0 9.5-4.01 9.5-9.64 0-.65-.07-1.14-.15-1.26z"/></svg>
                      Sign up with Google
                    </span>
                  )}
                </Button>
                <div className="mt-4 sm:mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link 
                      to="/signin" 
                      className="font-medium text-primary hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Scrolling Announcement removed */}
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

export default SignUp;
