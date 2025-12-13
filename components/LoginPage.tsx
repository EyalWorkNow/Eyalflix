
import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
    onRegisterSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onRegisterSuccess }) => {
  const { loginWithEmail, registerWithEmail, signInWithGoogle } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Security State: Rate Limiting
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  // Clear errors when switching modes
  useEffect(() => {
      setErrorMsg(null);
      setPassword('');
  }, [isRegistering]);

  // Rate Limiting Timer Logic
  useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isLocked && lockTimer > 0) {
          interval = setInterval(() => {
              setLockTimer((prev) => prev - 1);
          }, 1000);
      } else if (lockTimer === 0) {
          setIsLocked(false);
          setFailedAttempts(0); // Reset attempts after lockout period
      }
      return () => clearInterval(interval);
  }, [isLocked, lockTimer]);

  // Input Sanitization
  const sanitizeInput = (input: string) => {
      // Remove dangerous characters for HTML Context (Basic XSS prevention)
      return input.replace(/[<>"'&]/g, "");
  };

  // Strict Validation Logic
  const validateForm = (): boolean => {
      const cleanEmail = sanitizeInput(email);
      
      // 1. Email Format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
          setErrorMsg("נא להזין כתובת אימייל תקינה.");
          return false;
      }

      // 2. Password Complexity (Only for Registration)
      if (isRegistering) {
          if (password.length < 8) {
              setErrorMsg("הסיסמה חייבת להכיל לפחות 8 תווים.");
              return false;
          }
          // Optional: Enforce complexity (Number + Uppercase)
          if (!/\d/.test(password) || !/[A-Z]/.test(password)) {
               setErrorMsg("סיסמה חייבת להכיל אות גדולה (A-Z) ומספר.");
               return false;
          }
      } else {
          // Basic length check for login to avoid sending junk to server
          if (password.length < 1) {
              setErrorMsg("נא להזין סיסמה.");
              return false;
          }
      }
      
      return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Check Lockout
    if (isLocked) return;

    // Validate
    if (!validateForm()) return;
    
    setLoading(true);
    const cleanEmail = sanitizeInput(email);

    try {
        let success = false;
        
        if (isRegistering) {
            success = await registerWithEmail(cleanEmail, password);
            if (success && onRegisterSuccess) {
                onRegisterSuccess();
                // We return here to prevent any state updates on unmounted component if parent switches view immediately
                return; 
            }
        } else {
            success = await loginWithEmail(cleanEmail, password);
        }

        if (!success) {
            handleFailure();
        }
    } catch (error) {
        handleFailure();
    } finally {
        setLoading(false);
    }
  };

  const handleFailure = () => {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      
      // Lockout Policy: 5 Failed Attempts = 30 Seconds Lock
      if (newAttempts >= 5) {
          setIsLocked(true);
          setLockTimer(30);
          setErrorMsg("יותר מדי ניסיונות כושלים. המערכת ננעלה זמנית.");
      }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=1920&auto=format&fit=crop" 
                alt="Cinema Background" 
                className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/80 to-[#0d1117]/60" />
        </div>

        <div className="relative z-10 w-full max-w-md px-4 animate-fade-in">
            
            <div className="text-center mb-8">
                <h1 className="text-5xl font-black text-white mb-2 tracking-tight text-shadow-md">
                    EyalAtiaTV<span className="text-cyan-400">.</span>
                </h1>
                <p className="text-gray-400 text-lg">חווית צפייה ללא גבולות</p>
            </div>

            <div className="bg-[#161b22]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl ring-1 ring-white/5">
                
                <div className="flex items-center gap-4 mb-8 bg-black/40 p-1.5 rounded-xl">
                    <button 
                        onClick={() => setIsRegistering(false)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${!isRegistering ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        התחברות
                    </button>
                    <button 
                        onClick={() => setIsRegistering(true)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${isRegistering ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        הרשמה
                    </button>
                </div>

                {/* Secure Error Message Box */}
                {errorMsg && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-200 font-medium">{errorMsg}</p>
                    </div>
                )}

                {/* Lockout Timer */}
                {isLocked && (
                     <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex flex-col items-center animate-pulse">
                        <ShieldCheck className="w-8 h-8 text-yellow-500 mb-2" />
                        <p className="text-sm text-yellow-200 font-bold">המערכת נעולה ל-{lockTimer} שניות</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 mr-1 block">כתובת אימייל</label>
                        <div className="relative group">
                            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                            <input 
                                type="text" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#0d1117] border border-white/10 rounded-xl py-3.5 pr-12 pl-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium disabled:opacity-50"
                                placeholder="example@email.com"
                                disabled={isLocked || loading}
                                // Removed HTML5 validation to rely on custom strict validation
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 mr-1 block">סיסמה</label>
                        <div className="relative group">
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0d1117] border border-white/10 rounded-xl py-3.5 pr-12 pl-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium disabled:opacity-50"
                                placeholder="••••••••"
                                disabled={isLocked || loading}
                            />
                        </div>
                        {isRegistering && (
                             <p className="text-[10px] text-gray-500 pr-1">* מינימום 8 תווים, אות גדולה ומספר</p>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || isLocked}
                        className="w-full bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-black font-black py-4 rounded-xl text-lg shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group mt-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>{isRegistering ? 'צור חשבון מאובטח' : 'התחבר באופן מאובטח'}</span>
                                <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-[#14191f] text-gray-500 font-medium rounded-full">או</span>
                    </div>
                </div>

                <button 
                    onClick={() => !isLocked && signInWithGoogle()}
                    disabled={isLocked}
                    className="w-full bg-white text-gray-900 font-bold py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-3 group focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#161b22] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="p-1 bg-white rounded-full">
                         <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                    </div>
                    <span>המשך עם Google</span>
                </button>
                
                {!isRegistering && (
                    <div className="mt-6 text-center">
                        <button className="text-gray-400 hover:text-cyan-400 text-sm font-medium transition-colors">
                            שכחת את הסיסמה?
                        </button>
                    </div>
                )}
            </div>
            
            <p className="text-center text-gray-500 text-xs mt-8">
                הגנת Google reCAPTCHA חלה על אתר זה.
                <br />
                בכניסה לאתר את/ה מסכימ/ה לתנאי השימוש.
            </p>
        </div>
    </div>
  );
};
