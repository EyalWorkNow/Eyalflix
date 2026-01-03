
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
    User, 
    onAuthStateChanged, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    updateProfile,
    auth, 
    googleProvider
} from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<boolean>;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
          localStorage.setItem('eyalatiatv_user_uid', currentUser.uid);
      } else {
          localStorage.removeItem('eyalatiatv_user_uid');
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
        await signInWithPopup(auth, googleProvider);
        return true;
    } catch (error) {
        console.error("Google Sign In Error:", error);
        return false;
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        return true;
    } catch (error) {
        console.error("Email Login Error:", error);
        return false;
    }
  };

  const registerWithEmail = async (email: string, pass: string): Promise<boolean> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        // Set a default display name derived from email part
        if (userCredential.user) {
            await updateProfile(userCredential.user, {
                displayName: email.split('@')[0],
                photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
            });
            // Force update local state to reflect display name change immediately
            setUser({ ...userCredential.user });
        }
        return true;
    } catch (error) {
        console.error("Registration Error:", error);
        return false;
    }
  };

  const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, loginWithEmail, registerWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
