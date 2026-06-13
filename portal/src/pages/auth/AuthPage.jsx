import React, { useState, useEffect } from "react";
import SignInForm from "../../components/auth/SignInForm";
import SignUpForm from "../../components/auth/SignUpForm";


export default function AuthPage({url}) {
  const [isSignIn, setIsSignIn] = useState(true);

  useEffect(() => {
    if (url === '/register') {
      setIsSignIn(false);
    } else if (url === '/login') {
      setIsSignIn(true);
    }
  }, [url]);
  return (
    // Changed h-screen to min-h-screen to let flex-col work naturally with viewports
    <div className="h-full w-full bg-slate-50 flex flex-col antialiased text-slate-800">
      
      <header className="bg-white border-b border-slate-100 h-11 px-6 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            W
          </div>
          <span className="font-semibold text-base tracking-tight text-slate-900">WebMantis</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center overflow-hidden">
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-slate-100 p-4 overflow-y-auto max-h-[calc(100vh-76px)]">
          {isSignIn ? (
            <SignInForm onSwitch={() => setIsSignIn(false)} />
          ) : (
            <SignUpForm onSwitch={() => setIsSignIn(true)} />
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 h-8 flex items-center justify-center text-[10px] text-slate-400 shrink-0 font-medium tracking-wide">
        © 2026 WebMantis. Secure & Confidential. ASQA Compliant.
      </footer>
    </div>
  );
}