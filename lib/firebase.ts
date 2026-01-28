
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
                const savedEmail = localStorage.getItem('eyalatiatv_user_email');
                const savedDisplayName = localStorage.getItem('eyalatiatv_user_displayName');
                const savedPhotoURL = localStorage.getItem('eyalatiatv_user_photoURL');

                if (savedUid && savedEmail) {
                    this.currentUser = {
                        uid: savedUid,
                        email: savedEmail,
                        displayName: savedDisplayName || savedEmail.split('@')[0],
                        photoURL: savedPhotoURL || `/userimg/Gemini_Generated_Image_vkzj4svkzj4svkzj.png`
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

// Helper: Generate consistent UID from email (simple hash for mock purposes)
const generateUidFromEmail = (email: string): string => {
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        const chr = email.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return 'uid-' + Math.abs(hash).toString(36);
};

export const getAuth = () => authService;

export const signInWithPopup = async (authObj: any, provider: any) => {
    console.log("Mock: Signing in with Popup");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulating network delay

    // Check if user exists in localStorage
    const googleEmail = 'google@user.com';
    const uid = generateUidFromEmail(googleEmail);

    const user: User = {
        uid,
        email: googleEmail,
        displayName: 'Google User',
        photoURL: `/userimg/Gemini_Generated_Image_vkzj4svkzj4svkzj.png`
    };
    authService.currentUser = user;

    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
        localStorage.setItem('eyalatiatv_user_displayName', user.displayName || '');
        localStorage.setItem('eyalatiatv_user_photoURL', user.photoURL || '');
    }

    authService.notify();
    return { user };
};

export const signInWithEmailAndPassword = async (authObj: any, email: string, pass: string) => {
    console.log("Mock: Signing in with Email");
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate consistent UID from email
    const uid = generateUidFromEmail(email);

    const user: User = {
        uid,
        email: email,
        displayName: email.split('@')[0],
        photoURL: `/userimg/Gemini_Generated_Image_vkzj4svkzj4svkzj.png`
    };
    authService.currentUser = user;

    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
        localStorage.setItem('eyalatiatv_user_displayName', user.displayName || '');
        localStorage.setItem('eyalatiatv_user_photoURL', user.photoURL || '');
    }

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

    // Clear all user data from localStorage
    if (typeof window !== 'undefined') {
        localStorage.removeItem('eyalatiatv_user_displayName');
        localStorage.removeItem('eyalatiatv_user_photoURL');
    }

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
