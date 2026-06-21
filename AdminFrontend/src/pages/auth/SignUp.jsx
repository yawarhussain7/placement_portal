import React, { useState } from 'react';
import AuthLayout from '../../layout/AuthLayout';
import InputField from '../../components/auth/InputField';
import { Link } from 'react-router-dom';
import { MdPerson, MdEmail, MdLock } from 'react-icons/md';

const SignUp = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    const getPasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) return { text: 'Weak', color: 'bg-red-500', width: '33%' };
        if (score <= 4) return { text: 'Medium', color: 'bg-yellow-500', width: '66%' };
        return { text: 'Strong', color: 'bg-green-500', width: '100%' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Registering user:', formData);
    };

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Get started by setting up your profile credentials."
        >
            <form onSubmit={handleSubmit} className="space-y-2">
                <InputField
                    label="Full Name"
                    type="text"
                    id="fullName"
                    placeholder="Aarav Mehta"
                    icon={MdPerson}
                    value={formData.fullName}
                    onChange={handleChange}
                />

                <InputField
                    label="Email Address"
                    type="email"
                    id="email"
                    placeholder="name@example.com"
                    icon={MdEmail}
                    value={formData.email}
                    onChange={handleChange}
                />

                <InputField
                    label="Password"
                    type="password"
                    id="password"
                    placeholder="Minimum 8 characters"
                    icon={MdLock}
                    value={formData.password}
                    onChange={handleChange}
                />

                {formData.password && (
                    <div className="mt-2">
                        <div className="w-full h-2 bg-gray-200 rounded">
                            <div
                                className={`h-2 rounded ${passwordStrength.color}`}
                                style={{ width: passwordStrength.width }}
                            />
                        </div>
                        <p className="text-sm mt-1">
                            Password Strength:
                            <span className={`ml-1 font-semibold ${
                                passwordStrength.text === 'Weak' ? 'text-red-500' :
                                passwordStrength.text === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                            }`}>
                                {passwordStrength.text}
                            </span>
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full mt-2 bg-[#22C55E] text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-[#16A34A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22C55E] transition-colors"
                >
                    Sign Up
                </button>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link to='/signIn'
                        className="font-medium text-[#22C55E] hover:underline focus:outline-none"
                    >
                        Sign in instead
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default SignUp;