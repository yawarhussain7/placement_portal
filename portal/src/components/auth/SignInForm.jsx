import React, { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../Api/auth.js"

export default function SignInForm({ onSwitch }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginUser(formData);

      
      // Clear any stale cached portal data so the new user's data loads fresh
      localStorage.removeItem('webmantisPortalData');

      // Dispatch event to trigger profile fetch in PortalDataContext
      window.dispatchEvent(new Event('auth-token-changed'));

      toast.success("Welcome back!");
      navigate("/dashboard")
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Invalid email or password";

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-center">
      
      

      {/* Error Box */}
      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 text-sm text-red-600 shadow-pro-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Email */}
        <div>
          <label className="text-xs font-semibold text-slate-700">
            Email Address
          </label>

          <div className="relative mt-1">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-muted" />

            <input
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full pl-10 pr-3 py-2.5 text-sm bg-surface rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-accent shadow-pro-sm transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-700">
              Password
            </label>

            <span className="text-xs text-emerald-600 hover:underline cursor-pointer">
              Forgot?
            </span>
          </div>

          <div className="relative mt-1">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-muted" />

            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-surface rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-accent shadow-pro-sm transition-all"
            />

            {/* Show/Hide Password */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted hover:text-secondary"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover 
          disabled:opacity-60 text-white font-medium py-2.5 rounded-xl text-sm transition-all shadow-pro-md hover:shadow-pro-lg"
        >
          {loading ? (
            "Signing in..."
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Sign In
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-secondary">
        Don't have an account?{" "}
        <button
          onClick={() => onSwitch ? onSwitch() : navigate("/auth/register")}
          className="font-semibold text-accent hover:text-accent-hover"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}