import React from 'react';
import { FiHexagon } from 'react-icons/fi';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden font-sans antialiased">
      {/* Left Side: Branding & Info Panel (Premium Emerald Gradient & Radial Glow) */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-950 p-16 flex-col justify-between overflow-hidden shadow-2xl">
        
        {/* Soft Glowing Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[100px] pointer-events-none" />

        {/* Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md border border-white/25 p-2 rounded-xl text-white shadow-lg shadow-black/5">
            <FiHexagon className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="font-extrabold text-2xl text-white tracking-tight">Webmantis</span>
        </div>

        {/* Decorative Graphic/Text */}
        <div className="relative z-10 max-w-lg my-auto space-y-5">
          <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
            Manage student placements and partnerships effortlessly.
          </h1>
          <p className="text-emerald-100/80 text-sm leading-relaxed font-medium">
            Track applications, monitor real-time pipeline status, and connect your students with top-tier global companies all from a single, unified command center.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-emerald-200/50 font-bold tracking-wider uppercase">
          &copy; 2026 Webmantis Platform. All rights reserved.
        </div>
      </div>

      {/* Right Side: Authentication Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/60 relative">
          
          {/* Mobile Logo View */}
          <div className="flex items-center gap-2.5 lg:hidden mb-6">
            <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-md shadow-emerald-500/15">
              <FiHexagon className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">Webmantis</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1.5">{title}</h2>
            <p className="text-sm text-slate-400 font-semibold">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;