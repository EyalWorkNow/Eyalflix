
// NOTE: This file utilizes a Mock Authentication Service to bypass 
// external dependency issues with 'firebase/auth' and 'firebase/app'.
// It simulates authentication behavior (Sign In, Sign Out, User State) 
// to allow the application to run correctly in this environment.

// Mock User Interface
export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

class MockAuthService {
    currentUser: User | null = null;
    private listeners: ((user: User | null) => void)[] = [];

    constructor() {
        // Attempt to restore session from localStorage for better UX
        try {
            if (typeof window !== 'undefined') {
                const savedUid = localStorage.getItem('eyalatiatv_user_uid');
                if (savedUid) {
                    this.currentUser = {
                        uid: savedUid,
                        email: 'user@demo.com',
                        displayName: 'Demo User',
                        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${savedUid}`
                    };
                }
            }
        } catch (e) {
            console.warn("Storage access failed", e);
        }
    }

    notify() {
        this.listeners.forEach(cb => cb(this.currentUser));
    }

    subscribe(cb: (user: User | null) => void) {
        this.listeners.push(cb);
        // Execute immediately to set initial state
        cb(this.currentUser);
        return () => {
            this.listeners = this.listeners.filter(l => l !== cb);
        };
    }
}

// Singleton Instance
const authService = new MockAuthService();
export const auth = authService;

// Mock Config Objects
export const app = {}; 
export const analytics = null;
export const googleProvider = { providerId: 'google.com' };

// --- Auth Functions Implementation ---

export const getAuth = () => authService;

export const signInWithPopup = async (authObj: any, provider: any) => {
    console.log("Mock: Signing in with Popup");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulating network delay
    const user: User = {
        uid: 'google-' + Date.now().toString(36),
        email: 'google@user.com',
        displayName: 'Google User',
        photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google'
    };
    authService.currentUser = user;
    authService.notify();
    return { user };
};

export const signInWithEmailAndPassword = async (authObj: any, email: string, pass: string) => {
    console.log("Mock: Signing in with Email");
    await new Promise(resolve => setTimeout(resolve, 500));
    const user: User = {
        uid: 'email-' + Date.now().toString(36),
        email: email,
        displayName: email.split('@')[0],
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    authService.currentUser = user;
    authService.notify();
    return { user };
};

export const createUserWithEmailAndPassword = async (authObj: any, email: string, pass: string) => {
    console.log("Mock: Creating User");
    return signInWithEmailAndPassword(authObj, email, pass);
};

export const signOut = async (authObj: any) => {
    console.log("Mock: Signing Out");
    authService.currentUser = null;
    authService.notify();
};

export const onAuthStateChanged = (authObj: any, callback: (user: User | null) => void) => {
    return authService.subscribe(callback);
};

export const updateProfile = async (user: User, updates: { displayName?: string, photoURL?: string }) => {
    if (authService.currentUser) {
        authService.currentUser = { ...authService.currentUser, ...updates };
        authService.notify();
    }
};

export class GoogleAuthProvider {
    static PROVIDER_ID = 'google.com';
}
