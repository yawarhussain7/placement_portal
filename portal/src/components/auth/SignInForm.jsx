import React, { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../Api/auth.js"

export default function SignInForm() {
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

      // Save auth token to localStorage so other components can read userId
      const token = response?.data?.data?.token;
      if (token) {
        localStorage.setItem('auth_token', token);
      }

      toast.success("Welcome back!");
      setTimeout(() => navigate("/dashboard"), 500);
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
      
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome back
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Sign in to continue to your dashboard
        </p>
      </div>

      {/* Error Box */}
      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
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
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
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
            <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />

            {/* Show/Hide Password */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
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
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 
          disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition shadow-sm"
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
      <div className="mt-6 text-center text-xs text-slate-600">
        Don't have an account?{" "}
        <button
          onClick={() => navigate("/auth/register")}
          className="font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}