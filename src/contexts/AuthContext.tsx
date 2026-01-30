import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  auth,
  getUserProfile,
  UserProfile,
  registerWithEmail,
  signInWithEmail,
  signInWithGoogle,
  logOut,
} from "@/firebase";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isFirebaseConfigured: boolean;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(true);

  const fetchUserProfile = async (uid: string) => {
    try {
      const profile = await getUserProfile(uid);
      setUserProfile(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    try {
      if (!auth) {
        console.warn("Firebase auth not configured");
        setIsFirebaseConfigured(false);
        setLoading(false);
        return;
      }

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        if (user) {
          await fetchUserProfile(user.uid);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase auth error:", error);
      setIsFirebaseConfigured(false);
      setLoading(false);
    }
  }, []);

  const register = async (email: string, password: string, displayName: string) => {
    await registerWithEmail(email, password, displayName);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmail(email, password);
  };

  const loginWithGoogle = async () => {
    await signInWithGoogle();
  };

  const logout = async () => {
    await logOut();
    setUserProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.uid);
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    isAdmin: userProfile?.isAdmin || false,
    isFirebaseConfigured,
    register,
    login,
    loginWithGoogle,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
