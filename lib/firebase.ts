
// Mock Firebase Implementation to resolve module resolution errors
// and provide a working authentication flow for the demo.

export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

// Mock Auth State Persistence
const STORAGE_KEY = 'eyalatiatv_mock_user';
let currentUser: User | null = null;

try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) currentUser = JSON.parse(stored);
} catch (e) {}

const observers: ((user: User | null) => void)[] = [];

function notifyObservers() {
    observers.forEach(obs => obs(currentUser));
}

// --- Auth Functions ---

export const getAuth = () => {
    return { currentUser }; 
};

export const onAuthStateChanged = (auth: any, callback: (user: User | null) => void) => {
    observers.push(callback);
    // Fire immediately
    callback(currentUser);
    // Return unsubscribe function
    return () => {
        const idx = observers.indexOf(callback);
        if (idx > -1) observers.splice(idx, 1);
    };
};

export const signInWithPopup = async (auth: any, provider: any) => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network
    currentUser = {
        uid: 'google-user-' + Date.now(),
        email: 'demo@gmail.com',
        displayName: 'Demo User',
        photoURL: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    notifyObservers();
    return { user: currentUser };
};

export const signInWithEmailAndPassword = async (auth: any, email: string, pass: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    currentUser = {
        uid: 'email-user-' + Date.now(),
        email: email,
        displayName: email.split('@')[0],
        photoURL: null
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    notifyObservers();
    return { user: currentUser };
};

export const createUserWithEmailAndPassword = async (auth: any, email: string, pass: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    currentUser = {
        uid: 'new-user-' + Date.now(),
        email: email,
        displayName: null,
        photoURL: null
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    notifyObservers();
    return { user: currentUser };
};

export const signOut = async (auth: any) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    currentUser = null;
    localStorage.removeItem(STORAGE_KEY);
    notifyObservers();
};

export const updateProfile = async (user: any, updates: any) => {
    if (currentUser) {
        currentUser = { ...currentUser, ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
        notifyObservers();
    }
};

export class GoogleAuthProvider {}

// --- App & Analytics Stubs ---

export const initializeApp = (config: any) => ({});
export const getAnalytics = (app: any) => null;
export const isSupported = async () => false;

// --- Instances ---

export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
export let analytics: any = null;
