import React, { useEffect, useState } from 'react'
import logo from '../assets/images/logo_app.png';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { account, databases } from '../appwrite/config';
import { Query } from 'appwrite';
import { useNavigate } from 'react-router-dom';
import { roleCache } from '../utils/roleCache';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const checkAndRedirect = async () => {
            try {
                const user = await account.get();
                if (!isMounted) return;

                const response = await databases.listDocuments(
                    'user_info',
                    'user_info',
                    [Query.equal("email", user.email)]
                );

                if (response.documents.length > 0) {
                    const employeeData = response.documents[0];
                    if (employeeData.status === 'active') {
                        roleCache.setRole(employeeData.role as 'admin' | 'employee');
                        navigate('/dashboard/');
                        return;
                    }
                }

                await account.deleteSession('current');
                if (isMounted) setCheckingAuth(false);
            } catch (error) {
                if (isMounted) setCheckingAuth(false);
            }
        };

        checkAndRedirect();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    useEffect(() => {
        if (!checkingAuth) {
            const credentials = getStoredCredentials();
            if (credentials) {
                setEmail(credentials.email);
                setPassword(credentials.password);
                setRememberMe(true);
            }
        }
    }, [checkingAuth]);

    const storeCredentials = (email: string, password: string) => {
        try {
            const encryptedEmail = btoa(email);
            const encryptedPassword = btoa(password);
            localStorage.setItem('keeperNest_email', encryptedEmail);
            localStorage.setItem('keeperNest_password', encryptedPassword);
            localStorage.setItem('keeperNest_rememberMe', 'true');
        } catch (error) {
            console.log('Error storing credentials:', error);
        }
    };

    const getStoredCredentials = () => {
        try {
            const storedEmail = localStorage.getItem('keeperNest_email');
            const storedPassword = localStorage.getItem('keeperNest_password');
            const shouldRemember = localStorage.getItem('keeperNest_rememberMe');

            if (storedEmail && storedPassword && shouldRemember === 'true') {
                return {
                    email: atob(storedEmail),
                    password: atob(storedPassword),
                };
            }
            return null;
        } catch (error) {
            console.log('Error retrieving credentials:', error);
            return null;
        }
    };

    const clearStoredCredentials = () => {
        try {
            localStorage.removeItem('keeperNest_email');
            localStorage.removeItem('keeperNest_password');
            localStorage.removeItem('keeperNest_rememberMe');
        } catch (error) {
            console.log('Error clearing credentials:', error);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            try {
                await account.deleteSession('current');
            } catch (error) {}

            await account.createEmailPasswordSession(email, password);
            const user = await account.get();

            const response = await databases.listDocuments(
                "user_info",
                "user_info",
                [Query.equal("email", user.email)]
            );

            if (response.documents.length === 0) {
                throw new Error('User data not found');
            }

            const employeeData = response.documents[0];
            const role = employeeData.role;
            
            roleCache.setRole(role as 'admin' | 'employee');

            if (rememberMe) {
                storeCredentials(email, password);
            } else {
                clearStoredCredentials();
            }

            navigate('/dashboard/');

        } catch (err: any) {
            setError(
                err.code === 401
                    ? 'Invalid email or password'
                    : err.message || 'Login failed. Please try again.'
            );
            roleCache.clear();
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading) {
            handleLogin();
        }
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center max-w-xs w-full">
                    <div className="flex flex-col items-center justify-center mb-6">
                        <img
                            src={logo}
                            alt="KeeperNest Logo"
                            className="w-20 h-20 md:w-24 md:h-24 object-contain mb-4"
                        />
                        <h1 className="text-2xl md:text-3xl font-bold text-[#3b82f6]">KeeperNest</h1>
                    </div>
                    <Loader2 className="h-8 w-8 md:h-10 md:w-10 animate-spin text-[#3b82f6] mx-auto mb-4" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center">

                <div className="lg:hidden mb-6 w-full flex flex-col items-center">
                    <img
                        src={logo}
                        alt="KeeperNest Logo"
                        className="w-32 h-32 object-contain"
                    />
                    <h1 className="text-2xl font-bold text-[#3b82f6] mt-2">KeeperNest</h1>
                    <p className="text-gray-600 text-sm mt-1 text-center">Secure Login Portal</p>
                </div>

                <div className="w-full max-w-sm md:max-w-md lg:w-1/2 lg:max-w-lg bg-white rounded-xl md:rounded-2xl shadow-lg p-5 md:p-6 lg:p-8 mx-auto lg:mx-0">
                    <div className="hidden lg:block mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <img
                                src={logo}
                                alt="KeeperNest Logo"
                                className="w-10 h-10 object-contain"
                            />
                            <h1 className="text-2xl font-bold text-[#3b82f6]">KeeperNest</h1>
                        </div>
                        <p className="text-gray-600 text-sm">Welcome back! Please sign in to your account.</p>
                    </div>

                    <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">Sign In to Your Account</h2>

                    <div className="space-y-4 md:space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                    }}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Enter your email address"
                                    className="w-full pl-10 pr-4 py-3 text-sm md:text-base bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-10 py-3 text-sm md:text-base bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 flex items-center gap-2 p-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer w-full sm:w-auto">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                                    disabled={isLoading}
                                />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <button
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap w-full sm:w-auto text-right"
                                disabled={isLoading}
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            onClick={handleLogin}
                            disabled={isLoading}
                            className="w-full py-3 bg-[#3b82f6] text-white font-medium rounded-lg hover:bg-[#2563eb] active:scale-[0.98] transition-all duration-200 shadow hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <div className="text-center pt-2">
                            <p className="text-gray-600 text-sm">
                                Don't have an account?{' '}
                                <button
                                    className="text-blue-600 font-medium hover:underline"
                                    disabled={isLoading}
                                    onClick={() => navigate('/signup/')}
                                >
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex w-1/2 h-full items-center justify-center p-8">
                    <div className="text-center max-w-md">
                        <div className="mb-8">
                            <img
                                src={logo}
                                alt="KeeperNest Logo"
                                className="w-64 h-64 object-contain mx-auto"
                            />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to KeeperNest</h2>
                        <p className="text-gray-600 text-lg">
                            Secure document management system for your organization's needs.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;