import React from "react";
import logo from "../assets/logo.png";

const ModernAuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fafc] font-sans">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/bg.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-[1px]"></div>

      {/* Main Container */}
      <div className="relative z-10 flex min-h-screen">
        {/* ==========================================
                    LEFT SIDE
        =========================================== */}
        <div className="hidden xl:flex w-[52%]">
          <div className="w-full max-w-[620px] ml-16 2xl:ml-24">
            {/* Logo */}
            <div className="mb-6">
              <img
                src={logo}
                alt="WebMantis"
                className="h-20 object-contain"
              />
            </div>

            {/* Heading */}
            <h1 className="text-[40px] leading-[1.05] font-black tracking-tight text-slate-900">
              We turn ideas
              <br />
              into{" "}
              <span className="text-emerald-600 relative">
                powerful
                <span className="absolute bottom-0.5 left-0 w-full h-2.5 bg-emerald-200/60 -z-10 rounded"></span>
              </span>
              <br />
              digital solutions.
            </h1>

            {/* Green Line */}
            <div className="w-12 h-1.5 bg-emerald-600 rounded-full mt-6 mb-6"></div>

            {/* Description */}
            <p className="text-base leading-7 text-slate-600 max-w-[200px]">
              We blend strategy, design and technology to build products that
              are beautiful, scalable and built for the future.
            </p>
          </div>
        </div>

        {/* ==========================================
                    RIGHT SIDE
        =========================================== */}
        <div className="w-full xl:w-[48%] flex items-center justify-center px-6 lg:px-10 py-6">
          <div className="w-full max-w-[420px]">
            {/* Mobile Logo */}
            <div className="xl:hidden flex flex-col items-center mb-10">
              <img
                src={logo}
                alt="WebMantis"
                className="h-14 object-contain mb-4"
              />

              <h2 className="font-bold text-2xl text-slate-900">
                WebMantis
              </h2>

              <p className="text-slate-500">
                Digital Solutions
              </p>
            </div>

            {/* Login Card */}
            <div
              className="
                bg-white/95
                backdrop-blur-xl
                rounded-2xl
                border border-white/70
                shadow-[0_15px_50px_rgba(15,23,42,.1)]
                px-5
                sm:px-6
                py-6
                transition-all
              "
            >
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight text-slate-900 leading-tight">
                  {title}
                </h2>

                <p className="mt-2 text-slate-500 text-sm">
                  {subtitle}
                </p>
              </div>

              {/* Form */}
              {children}

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-[11px] text-slate-400">
                  © 2025 WebMantis. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernAuthLayout;