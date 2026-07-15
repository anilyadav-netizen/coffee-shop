// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getProfile } from '../redux/Slicer/authSlice';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/Slicer/authSlice';

const Login = () => {

    const location = useLocation();
    const from = location.state?.from || "/";

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ✅ Redux state se loading aur error le rahe hain
    const { loading, error, state, user, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [localError, setLocalError] = useState('');

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    // ✅ Check if already logged in – redirect based on role
    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === "admin") {
                navigate("/admin", { replace: true });
            } else if (user.role === "rider") {
                navigate("/rider", { replace: true });
            } else {
                navigate(from === "/" ? "/" : from, { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate, from]);

    const validateField = (name, value) => {
        let error = '';
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) error = 'Email is required';
            else if (!emailRegex.test(value)) error = 'Please enter a valid email';
        }
        if (name === 'password') {
            if (!value) error = 'Password is required';
            else if (value.length < 6) error = 'Password must be at least 6 characters';
        }
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
            setErrors(prev => ({ ...prev, email: validateField('email', value) }));
        } else if (name === 'password') {
            setPassword(value);
            setErrors(prev => ({ ...prev, password: validateField('password', value) }));
        }
        // Clear server error when user types
        if (localError) setLocalError('');
    };

    // ✅ Updated submit handler with try/catch and unwrap()
    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailError = validateField("email", email);
        const passwordError = validateField("password", password);

        if (emailError || passwordError) {
            setErrors({
                email: emailError,
                password: passwordError,
            });
            return;
        }

        // Clear any previous error before new attempt
        setLocalError("");

        try {
            // Attempt login – unwrap() will throw on failure
            await dispatch(loginUser({ email, password })).unwrap();

            // ✅ Login successful – fetch profile and redirect
            const profile = await dispatch(getProfile()).unwrap();

            if (profile.role === "admin") {
                navigate("/admin", { replace: true });
            } else if (profile.role === "rider") {
                navigate("/rider", { replace: true });
            } else {
                navigate("/", { replace: true });
            }

        } catch (err) {
            // ✅ Display the exact error message from backend
            // err may be the payload from the rejected action or an error object
            const errorMsg = err?.message || err || "Your credentials are wrong";
            setLocalError(errorMsg);
        }
    };

    // ✅ Display error from local state (backend error)
    const displayError = localError || error;

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
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
                <div className="text-center mb-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0D7C53] tracking-tight">
                        Sign In
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Continue your coffee journey
                    </p>
                </div>

                <div className="bg-white/40 backdrop-blur-md rounded-3xl p-7 shadow-md hover:shadow-lg transition-all duration-500 border border-white/30">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className={`relative group transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.01]' : ''
                                }`}>
                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'email' ? 'text-[#0D7C53]' : 'text-gray-400'
                                    }`} size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={handleInputChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter your email"
                                    className={`w-full bg-white/60 border rounded-xl py-3.5 pl-12 pr-4 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 ${errors.email
                                        ? 'border-red-500/50 focus:border-red-500'
                                        : focusedField === 'email'
                                            ? 'border-[#0D7C53] shadow-[0_0_30px_rgba(13,124,83,0.1)]'
                                            : 'border-white/30 focus:border-[#0D7C53]'
                                        }`}
                                />
                                {email && !errors.email && (
                                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                                )}
                                {email && errors.email && (
                                    <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" size={18} />
                                )}
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className={`relative group transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.01]' : ''
                                }`}>
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-[#0D7C53]' : 'text-gray-400'
                                    }`} size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={password}
                                    onChange={handleInputChange}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter your password"
                                    className={`w-full bg-white/60 border rounded-xl py-3.5 pl-12 pr-12 text-gray-800 placeholder-gray-400 outline-none transition-all duration-300 ${errors.password
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

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-base text-gray-600 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-md border-2 transition-all duration-300 flex items-center justify-center ${rememberMe
                                    ? 'bg-[#0D7C53] border-[#0D7C53]'
                                    : 'border-gray-300 group-hover:border-[#0D7C53]'
                                    }`}>
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="hidden"
                                    />
                                    {rememberMe && <CheckCircle size={14} className="text-white" />}
                                </div>
                                <span className={rememberMe ? 'text-[#0D7C53]' : ''}>Remember me</span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-base text-[#0D7C53] hover:text-green-600 transition-colors hover:underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* ✅ Error Alert Box (modern red alert) */}
                        {displayError && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3 text-sm text-red-700">
                                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                <span>{displayError}</span>
                            </div>
                        )}

                        {isAuthenticated && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-sm text-green-600">
                                Login successful! Redirecting...
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full text-base bg-gradient-to-r from-[#0D7C53] to-green-600 hover:from-green-600 hover:to-[#0D7C53] text-white py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-base text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-[#0D7C53] hover:text-green-600 font-semibold transition-colors hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </form>
                </div>

                <p className="text-center text-gray-400 text-xs mt-4">
                    By signing in, you agree to our{' '}
                    <Link to="/terms" className="hover:text-gray-600 transition-colors">
                        Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="hover:text-gray-600 transition-colors">
                        Privacy Policy
                    </Link>
                </p>
            </div>

            <style >{`
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

export default Login;