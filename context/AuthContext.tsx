
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
  auth,
  googleProvider
} from '../lib/firebase';
import { UserProfile, WatchProgress } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profiles: UserProfile[];
  activeProfile: UserProfile | null;
  signInWithGoogle: () => Promise<boolean>;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  selectProfile: (profile: UserProfile) => void;
  updateActiveProfile: (updates: Partial<UserProfile>) => void;
  updateProfile: (id: string, updates: Partial<UserProfile>) => void;
  addProfile: (name: string, avatar: string) => void;
  deleteProfile: (id: string) => void;
  updateWatchProgress: (contentId: string, progress: WatchProgress) => void;
  toggleMyList: (contentId: string) => void;
  toggleLikedContent: (contentId: string) => void;
  updatePreference: <K extends keyof UserProfile['preferences']>(key: K, value: UserProfile['preferences'][K]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);

  // Helper to load profiles from local storage
  const loadProfiles = (uid: string) => {
    const saved = localStorage.getItem(`profiles_${uid}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfiles(parsed);

        // Restore active profile session if it exists
        const lastProfileId = localStorage.getItem(`active_profile_id_${uid}`);
        if (lastProfileId) {
          const profile = parsed.find((p: UserProfile) => p.id === lastProfileId);
          if (profile) setActiveProfile(profile);
        }
      } catch (e) {
        console.error("Failed to parse profiles", e);
        setProfiles([]);
      }
    } else {
      // Default initial profile
      const defaultProfile: UserProfile = {
        id: 'p1',
        name: 'Main',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Main`,
        watchHistory: {},
        myList: [],
        likedContent: [],
        preferences: {
          favoriteGenres: [],
          ratings: {},
          spoilerProtection: false,
          autoPlay: true,
          dataSaver: false,
          subtitleSize: 'medium',
          subtitleColor: 'white'
        }
      };
      setProfiles([defaultProfile]);
      saveProfiles(uid, [defaultProfile]);
    }
  };

  const saveProfiles = (uid: string, newProfiles: UserProfile[]) => {
    localStorage.setItem(`profiles_${uid}`, JSON.stringify(newProfiles));
  };

  // Listen to Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        localStorage.setItem('eyalatiatv_user_uid', currentUser.uid);
        loadProfiles(currentUser.uid);
      } else {
        localStorage.removeItem('eyalatiatv_user_uid');
        setProfiles([]);
        setActiveProfile(null);
      }
      setLoading(false);
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

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return true;
    } catch (error) {
      console.error("Email Login Error:", error);
      return false;
    }
  };

  const registerWithEmail = async (email: string, pass: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      if (userCredential.user) {
        await updateFirebaseProfile(userCredential.user, {
          displayName: email.split('@')[0],
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        });
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

  const selectProfile = (profile: UserProfile) => {
    setActiveProfile(profile);
    if (user) {
      localStorage.setItem(`active_profile_id_${user.uid}`, profile.id);
    }
  };

  const updateActiveProfile = (updates: Partial<UserProfile>) => {
    if (!activeProfile || !user) return;
    updateProfile(activeProfile.id, updates);
  };

  const sanitizeName = (name: string): string => {
    return name.trim().replace(/[<>]/g, '').slice(0, 25);
  };

  const updateProfile = (id: string, updates: Partial<UserProfile>) => {
    if (!user) return;

    // Validate and sanitize if name is being updated
    const finalUpdates = { ...updates };
    if (updates.name) {
      finalUpdates.name = sanitizeName(updates.name);
      if (!finalUpdates.name) return; // Prevent empty names after sanitization
    }

    const newProfiles = profiles.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...finalUpdates };
        if (activeProfile?.id === id) setActiveProfile(updated);
        return updated;
      }
      return p;
    });
    setProfiles(newProfiles);
    saveProfiles(user.uid, newProfiles);
  };

  const addProfile = (name: string, avatar: string) => {
    if (!user || profiles.length >= 4) return;

    const sanitizedName = sanitizeName(name);
    if (!sanitizedName) return;

    const newProfile: UserProfile = {
      id: `p${Date.now()}`,
      name: sanitizedName,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      watchHistory: {},
      myList: [],
      likedContent: [],
      preferences: {
        favoriteGenres: [],
        ratings: {},
        spoilerProtection: false,
        autoPlay: true,
        dataSaver: false,
        subtitleSize: 'medium',
        subtitleColor: 'white'
      }
    };
    const newProfiles = [...profiles, newProfile];
    setProfiles(newProfiles);
    saveProfiles(user.uid, newProfiles);
  };

  const deleteProfile = (id: string) => {
    if (!user || profiles.length <= 1) return;
    const newProfiles = profiles.filter(p => p.id !== id);
    setProfiles(newProfiles);
    saveProfiles(user.uid, newProfiles);
    if (activeProfile?.id === id) setActiveProfile(null);
  };

  const updateWatchProgress = (contentId: string, progress: WatchProgress) => {
    if (!activeProfile || !user) return;

    const updatedHistory = {
      ...activeProfile.watchHistory,
      [contentId]: { ...progress, lastWatched: new Date().toISOString() }
    };

    updateActiveProfile({ watchHistory: updatedHistory });
  };

  const toggleMyList = (contentId: string) => {
    if (!activeProfile) return;
    const current = activeProfile.myList || [];
    const newList = current.includes(contentId)
      ? current.filter(id => id !== contentId)
      : [...current, contentId];
    updateActiveProfile({ myList: newList });
  };

  const toggleLikedContent = (contentId: string) => {
    if (!activeProfile) return;
    const current = activeProfile.likedContent || [];
    const newList = current.includes(contentId)
      ? current.filter(id => id !== contentId)
      : [...current, contentId];
    updateActiveProfile({ likedContent: newList });
  };

  const updatePreference = <K extends keyof UserProfile['preferences']>(key: K, value: UserProfile['preferences'][K]) => {
    if (!activeProfile) return;
    const newPrefs = { ...activeProfile.preferences, [key]: value };
    updateActiveProfile({ preferences: newPrefs });
  };

  return (
    <AuthContext.Provider value={{
      user, loading, profiles, activeProfile,
      signInWithGoogle, loginWithEmail, registerWithEmail, logout,
      selectProfile, updateActiveProfile, updateProfile, addProfile, deleteProfile,
      updateWatchProgress, toggleMyList, toggleLikedContent, updatePreference
    }}>
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
