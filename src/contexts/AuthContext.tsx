import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut as firebaseSignOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  [key: string]: any;
}

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user: User | null;
  signOut: () => Promise<void>;
  role: string | null;
  profile: UserProfile | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsLoggedIn(true);
        setUser(firebaseUser);
        localStorage.setItem("isLoggedIn", "true");
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setRole(data.role || "user");
            setProfile({
              name: data.name || firebaseUser.displayName || "",
              email: data.email || firebaseUser.email || "",
              role: data.role || "user",
              ...data,
            });
          } else {
            setRole("user");
            setProfile({
              name: firebaseUser.displayName || "",
              email: firebaseUser.email || "",
              role: "user",
            });
          }
        } catch (e) {
          setRole("user");
          setProfile({
            name: firebaseUser.displayName || "",
            email: firebaseUser.email || "",
            role: "user",
          });
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setRole(null);
        setProfile(null);
        localStorage.removeItem("isLoggedIn");
      }
    });
    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setIsLoggedIn(false);
    setUser(null);
    setRole(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, signOut, role, profile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 