import React, { useState } from 'react';
import AuthLayout from '../../layout/AuthLayout'
import InputField from '../../components/auth/InputField'
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail, MdLock } from 'react-icons/md';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:2000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Invalid email or password.');
      }

      const token = resData.data?.token;
      const user = resData.data?.user;

      if (token) {
        localStorage.setItem('auth_token', token);
        if (user) {
          localStorage.setItem('auth_user', JSON.stringify(user));
        }
        // Redirect to dashboard
        navigate('/admin/dashboard');
      } else {
        throw new Error('Authentication token not received.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to the authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Access your administrative control panel.">
      <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {error && (
          <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-200">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        <InputField
          label="Email Address"
          type="email"
          id="email"
          placeholder="admin@webmantis.com"
          icon={MdEmail}
          value={formData.email}
          onChange={handleChange}
        />
        
        <div>
          <InputField
            label="Password"
            type="password"
            id="password"
            placeholder="••••••••"
            icon={MdLock}
            value={formData.password}
            onChange={handleChange}
          />
          <div className="flex justify-end mt-1.5">
            <button type="button" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors focus:outline-none cursor-pointer">
              Forgot password?
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-2.5 px-4 rounded-xl font-bold text-sm shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          {loading ? (
            <>
              <FiLoader className="w-4 h-4 animate-spin" />
              Verifying Credentials...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        <p className="text-center text-xs font-semibold text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to='/signUp'
            className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline focus:outline-none"
          >
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignIn;