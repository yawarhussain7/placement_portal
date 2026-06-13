import React, { useState } from "react";
import toast from 'react-hot-toast';
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Login } from "../../Api/auth.js";

export default function SignInForm({ onSwitch }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await Login(formData);
      toast.success('Welcome back! Login successful.');
      console.log('Form submit successfully...')
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      const errorMessage = err.message || "Invalid email or password. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
        <p className="text-xs text-slate-500 mt-1">Please enter your details to sign in.</p>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="email" required
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <a href="#" className="text-xs font-medium text-emerald-600 hover:text-emerald-700">Forgot?</a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="password" required
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors shadow-sm mt-2"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-600">
        Don't have an account?{" "}
        <button onClick={() => navigate('/auth/register')} className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
          Sign up
        </button>
      </div>
    </div>
  );
}