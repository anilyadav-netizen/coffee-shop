// src/pages/SignUp.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser} from '../redux/Slicer/authSlice';

const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ✅ Redux state se loading aur error le rahe hain
    const { loading, Error, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [localError, setLocalError] = useState('');
    const [success, setSuccess] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // ✅ Check if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const validateField = (name, value) => {
        let error = '';
        if (name === 'name') {
            if (!value) error = 'Name is required';
            else if (value.length < 2) error = 'Name must be at least 2 characters';
        }
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) error = 'Email is required';
            else if (!emailRegex.test(value)) error = 'Please enter a valid email';
        }
        if (name === 'password') {
            if (!value) error = 'Password is required';
            else if (value.length < 6) error = 'Password must be at least 6 characters';
        }
        if (name === 'confirmPassword') {
            if (!value) error = 'Please confirm your password';
            else if (value !== formData.password) error = 'Passwords do not match';
        }
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    // ✅ Fixed: Redux dispatch with userData
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        Object.keys(formData).forEach(key => {
            newErrors[key] = validateField(key, formData[key]);
        });
        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error)) {
            return;
        }

        setLocalError('');
        setSuccess(false);

        // ✅ Prepare user data for registration
        const userData = {
            name: formData.name,
            email: formData.email,
            password: formData.password
        };

        // ✅ Dispatch register with user data
        const result = await dispatch(registerUser(userData));

        // ✅ Check if registration was successful
        if (registerUser.fulfilled.match(result)) {
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } else if (registerUser.rejected.match(result)) {
            setLocalError(result.payload || 'Registration failed. Please try again.');
        }
    };

    // ✅ Display error from Redux or local
    const displayError = localError || Error;

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden mt-16">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />

                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[100px] animate-pulse-slow-delay" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] animate-pulse-slow" />

                <div className="absolute inset-0 pointer-events-none opacity-10">
                    <div className="absolute top-20 left-10 text-6xl rotate-12 animate-float">🫘</div>
                    <div className="absolute bottom-32 right-20 text-6xl -rotate-12 animate-float-delay">🫘</div>
                    <div className="absolute top-1/3 right-1/4 text-4xl rotate-45 animate-float-slow">☕</div>
                    <div className="absolute bottom-1/4 left-1/3 text-5xl -rotate-45 animate-float-delay">🫘</div>
                </div>
            </div>

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <span className="inline-block px-4 py-1.5 bg-green-100/80 backdrop-blur-sm text-green-800 text-xs font-semibold tracking-wider uppercase rounded-full mb-3">
                        Join Us
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D7C53] tracking-tight">
                        Create Account
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Start your coffee journey today
                    </p>
                </div>

                <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-500 border border-white/30">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className={`relative group transition-all duration-300 ${focusedField === 'name' ? 'scale-[1.02]' : ''
                                }`}>
                                <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'name' ? 'text-[#0D7C53]' : 'text-gray-400'
                                    }`} size={20} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter your full name"
                                    className={`w-full bg-white/60 border rounded-2xl py-3.5 pl-12 pr-4 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 ${errors.name
                                            ? 'border-red-500/50 focus:border-red-500'
                                            : focusedField === 'name'
                                                ? 'border-[#0D7C53] shadow-[0_0_30px_rgba(13,124,83,0.1)]'
                                                : 'border-white/30 focus:border-[#0D7C53]'
                                        }`}
                                />
                                {formData.name && !errors.name && (
                                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                                )}
                                {formData.name && errors.name && (
                                    <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" size={18} />
                                )}
                            </div>
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className={`relative group transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''
                                }`}>
                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'email' ? 'text-[#0D7C53]' : 'text-gray-400'
                                    }`} size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter your email"
                                    className={`w-full bg-white/60 border rounded-2xl py-3.5 pl-12 pr-4 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 ${errors.email
                                            ? 'border-red-500/50 focus:border-red-500'
                                            : focusedField === 'email'
                                                ? 'border-[#0D7C53] shadow-[0_0_30px_rgba(13,124,83,0.1)]'
                                                : 'border-white/30 focus:border-[#0D7C53]'
                                        }`}
                                />
                                {formData.email && !errors.email && (
                                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                                )}
                                {formData.email && errors.email && (
                                    <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" size={18} />
                                )}
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className={`relative group transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''
                                }`}>
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-[#0D7C53]' : 'text-gray-400'
                                    }`} size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Create a password"
                                    className={`w-full bg-white/60 border rounded-2xl py-3.5 pl-12 pr-12 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 ${errors.password
                                            ? 'border-red-500/50 focus:border-red-500'
                                            : focusedField === 'password'
                                                ? 'border-[#0D7C53] shadow-[0_0_30px_rgba(13,124,83,0.1)]'
                                                : 'border-white/30 focus:border-[#0D7C53]'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-400">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className={`relative group transition-all duration-300 ${focusedField === 'confirmPassword' ? 'scale-[1.02]' : ''
                                }`}>
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'confirmPassword' ? 'text-[#0D7C53]' : 'text-gray-400'
                                    }`} size={20} />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    onFocus={() => setFocusedField('confirmPassword')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Confirm your password"
                                    className={`w-full bg-white/60 border rounded-2xl py-3.5 pl-12 pr-12 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 ${errors.confirmPassword
                                            ? 'border-red-500/50 focus:border-red-500'
                                            : focusedField === 'confirmPassword'
                                                ? 'border-[#0D7C53] shadow-[0_0_30px_rgba(13,124,83,0.1)]'
                                                : 'border-white/30 focus:border-[#0D7C53]'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Error/Success Messages */}
                        {displayError && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-500">
                                {displayError}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-sm text-green-600">
                                Account created! Redirecting to login...
                            </div>
                        )}

                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#0D7C53] to-green-600 hover:from-green-600 hover:to-[#0D7C53] text-white py-3.5 rounded-2xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#0D7C53] hover:text-green-600 font-semibold transition-colors hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>

                <p className="text-center text-gray-400 text-xs mt-6">
                    By signing up, you agree to our{' '}
                    <Link to="/terms" className="hover:text-gray-600 transition-colors">
                        Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="hover:text-gray-600 transition-colors">
                        Privacy Policy
                    </Link>
                </p>
            </div>

            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                
                @keyframes pulse-slow-delay {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.15); opacity: 0.7; }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(12deg); }
                    50% { transform: translateY(-20px) rotate(15deg); }
                }
                
                @keyframes float-delay {
                    0%, 100% { transform: translateY(0px) rotate(-12deg); }
                    50% { transform: translateY(20px) rotate(-15deg); }
                }
                
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(45deg); }
                    50% { transform: translateY(-15px) rotate(50deg); }
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
                
                .animate-pulse-slow-delay {
                    animation: pulse-slow-delay 10s ease-in-out infinite;
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .animate-float-delay {
                    animation: float-delay 7s ease-in-out infinite;
                }
                
                .animate-float-slow {
                    animation: float-slow 9s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default SignUp;