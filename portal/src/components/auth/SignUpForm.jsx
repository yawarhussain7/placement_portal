import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../Api/auth.js";

export default function SignUpForm({ onSwitch }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔐 ONLY LENGTH CHECK (8 CHAR RULE)
  const isValidPassword = formData.password.length >= 8;

  const strength = Math.min(formData.password.length / 8, 1); // 0 → 1

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidPassword) {
      const msg = "Password must be at least 8 characters";
      setError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await registerUser(formData);
      
      console.log('Registration response:', response); // Debug log

      // Backend uses httpOnly cookies for authentication, no need to save token to localStorage
      // The cookie is automatically sent with subsequent requests (withCredentials: true)

      // Clear any stale cached portal data
      localStorage.removeItem('webmantisPortalData');

      toast.success("Account created successfully! Please login.");
      
      // Redirect to login page after showing success message
      setTimeout(() => {
        console.log('Redirecting to login...');
        window.location.replace('/auth/login');
      }, 1500);
      
    } catch (error) {
      console.error('Registration error:', error); // Debug log
      const msg =
        error.response?.data?.message || "Registration failed";

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-center">

      

      {/* ERROR */}
      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* NAME */}
        <div>
          <label className="text-xs font-semibold text-slate-700">
            Full Name
          </label>

          <div className="relative mt-1">
            <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              required
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-xs font-semibold text-slate-700">
            Email Address
          </label>

          <div className="relative mt-1">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-xs font-semibold text-slate-700">
            Password
          </label>

          <div className="relative mt-1">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* 🔥 SIMPLE LENGTH BAR ONLY */}
          <div className="mt-3 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                !formData.password
                  ? "w-0"
                  : strength < 0.5
                  ? "w-1/3 bg-red-500"
                  : strength < 1
                  ? "w-2/3 bg-yellow-500"
                  : "w-full bg-green-500"
              }`}
            />
          </div>

          <p className="text-xs mt-1 text-slate-500">
            {formData.password.length === 0
              ? "Enter password"
              : isValidPassword
              ? "Good password"
              : "Too short (min 8 characters)"}
          </p>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading || !isValidPassword}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700
          disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition"
        >
          {loading ? (
            "Creating account..."
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Create Account
            </>
          )}
        </button>
      </form>

      {/* FOOTER */}
      <div className="mt-6 text-center text-xs text-slate-600">
        Already have an account?{" "}
        <button
          onClick={() => onSwitch ? onSwitch() : navigate("/auth/login")}
          className="font-semibold text-emerald-600"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}