import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiLogIn,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";

import toast from "react-hot-toast";
import { signInUser, verifyAdmin } from "../../api/auth";
import ModernAuthLayout from "../../layout/ModernAuthLayout";
import ModernInputField from "../../components/auth/ModernInputField";

const ModernSignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if admin is already authenticated and redirect
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await verifyAdmin();
        if (response.data.success && response.data.data.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        }
      } catch (error) {
        // Not authenticated, stay on login page
        console.log('Admin not authenticated');
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-sm text-slate-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await signInUser(formData);

      toast.success("Login successful!");

      navigate("/admin/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to sign in.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernAuthLayout
      title={
        <>
          Welcome <span className="text-emerald-600">back</span>
        </>
      }
      subtitle="Sign in to continue to your dashboard"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-red-700">
            <FiAlertCircle className="h-4 w-4 flex-shrink-0" />

            <span className="text-sm font-medium">
              {error}
            </span>
          </div>
        )}

        {/* Email */}

        <ModernInputField
          label="Email Address"
          type="email"
          id="email"
          placeholder="you@example.com"
          icon={FiMail}
          value={formData.email}
          onChange={handleChange}
        />

        {/* Password */}

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-slate-800">
              Password
            </label>

            <button
              type="button"
              className="
                text-xs
                font-semibold
                text-emerald-600
                hover:text-emerald-700
                transition
              "
            >
              Forgot Password?
            </button>
          </div>

          <ModernInputField
            label=""
            type="password"
            id="password"
            placeholder="••••••••"
            icon={FiLock}
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {/* Sign In Button */}

        <button
          type="submit"
          disabled={loading}
          className="
            mt-3
            flex
            h-10
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-emerald-600
            text-sm
            font-bold
            text-white
            shadow-md
            shadow-emerald-500/20
            transition-all
            hover:bg-emerald-700
            hover:shadow-lg
            hover:shadow-emerald-500/30
            active:scale-[0.99]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? (
            <>
              <FiLoader className="h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              <FiLogIn className="h-4 w-4" />
              Sign In
            </>
          )}
        </button>

        {/* Divider */}

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>

          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs font-medium text-slate-500">
              or continue with
            </span>
          </div>
        </div>        {/* Social Login */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Google */}
          <button
            type="button"
            className="
              flex
              h-9
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-slate-200
              bg-white
              transition-all
              hover:border-emerald-300
              hover:bg-emerald-50
              hover:shadow-md
            "
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.03 2.53-2.18 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09A6.99 6.99 0 015.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 001 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </button>

          {/* GitHub */}
          <button
            type="button"
            className="
              flex
              h-9
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              bg-white
              transition-all
              hover:border-emerald-300
              hover:bg-emerald-50
              hover:shadow-md
            "
          >
            <svg
              className="w-5 h-5 text-slate-700"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 007.86 10.92c.58.11.79-.25.79-.56v-2.02c-3.2.69-3.87-1.35-3.87-1.35-.52-1.31-1.28-1.66-1.28-1.66-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.3 1.18-3.11-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.19a11 11 0 015.79 0c2.21-1.5 3.18-1.19 3.18-1.19.62 1.59.23 2.76.11 3.05.74.81 1.18 1.85 1.18 3.11 0 4.42-2.69 5.39-5.25 5.67.41.35.78 1.03.78 2.08v3.08c0 .31.21.68.8.56A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"/>
            </svg>
          </button>

          {/* Microsoft */}
          <button
            type="button"
            className="
              flex
              h-9
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              bg-white
              transition-all
              hover:border-emerald-300
              hover:bg-emerald-50
              hover:shadow-md
            "
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11.4 0H0v11.4h11.4V0zm12.6 0H12.6v11.4H24V0zM11.4 12.6H0V24h11.4V12.6zM24 12.6H12.6V24H24V12.6z"/>
            </svg>
          </button>
        </div>
      </form>
    </ModernAuthLayout>
  );
};

export default ModernSignIn;