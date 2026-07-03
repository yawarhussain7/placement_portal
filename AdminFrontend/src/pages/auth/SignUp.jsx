import React, { useState } from 'react';
import AuthLayout from '../../layout/AuthLayout';
import InputField from '../../components/auth/InputField';
import { Link, useNavigate } from 'react-router-dom';
import { MdPerson, MdEmail, MdLock } from 'react-icons/md';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';
import toast from "react-hot-toast";
import {signUpUser} from '../../api/auth.js'

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getPasswordStrength = (password) => {
        if (!password) return { text: 'None', color: 'bg-gray-200', width: '0%' };
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) return { text: 'Weak', color: 'bg-red-500', width: '33%' };
        if (score <= 4) return { text: 'Medium', color: 'bg-yellow-500', width: '66%' };
        return { text: 'Strong', color: 'bg-emerald-500', width: '100%' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email || !formData.password) {
            setError('Please fill in all fields.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await signUpUser({name:formData.fullName,email:formData.email,password:formData.password})
            toast.success('Register successfull')
            // Navigate to sign-in page after successful signup
            navigate('/login')
            
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Unable to connect to the authentication server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Get started by setting up your profile credentials."
        >
            <form onSubmit={handleSubmit} className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {error && (
                    <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-200">
                        <FiAlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                        <p>{error}</p>
                    </div>
                )}

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
                    <div className="mt-2.5 space-y-1.5 animate-in fade-in duration-200">
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                style={{ width: passwordStrength.width }}
                            />
                        </div>
                        <p className="text-[11px] font-bold text-gray-400">
                            Password Strength:
                            <span className={`ml-1 font-extrabold ${
                                passwordStrength.text === 'Weak' ? 'text-red-500' :
                                passwordStrength.text === 'Medium' ? 'text-yellow-500' : 'text-emerald-600'
                            }`}>
                                {passwordStrength.text}
                            </span>
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-2.5 px-4 rounded-xl font-bold text-sm shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                    {loading ? (
                        <>
                            <FiLoader className="w-4 h-4 animate-spin" />
                            Creating Account...
                        </>
                    ) : (
                        'Sign Up'
                    )}
                </button>

                <p className="text-center text-xs font-semibold text-gray-500 mt-4">
                    Already have an account?{' '}
                    <Link to='/login'
                        className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline focus:outline-none"
                    >
                        Sign in instead
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default SignUp;