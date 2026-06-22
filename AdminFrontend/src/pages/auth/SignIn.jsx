import React, { useState } from 'react';
import AuthLayout from '../../layout/AuthLayout'
import InputField from '../../components/auth/InputField'
import { Link } from 'react-router-dom';
import { MdEmail, MdLock } from 'react-icons/md';

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in with:', formData);
  };

  return (
    <AuthLayout title="Sign In" subtitle="Welcome back! Please enter your details.">
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex justify-end mt-1">
            <button type="button" className="text-xs font-medium text-[#22C55E] hover:underline">
              Forgot password?
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full mt-2 bg-[#22C55E] text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-[#16A34A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22C55E] transition-colors"
        >
          Sign In
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to='/signUp'
            className="font-medium text-[#22C55E] hover:underline focus:outline-none"
          >
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignIn;