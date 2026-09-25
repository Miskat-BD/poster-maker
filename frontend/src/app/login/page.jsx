'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // BetterAuth sign in implementation
            const { data, error } = await authClient.signIn.email({
                email: formData.email,
                password: formData.password,
            });

            if (error) {
                throw new Error(error.message || 'Invalid email or password');
            }

            const searchParams = new URLSearchParams(window.location.search);
            const redirectUrl = searchParams.get('redirect') || '/create-poster';
            window.location.href = redirectUrl;
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-emerald-900/90 rounded-xl shadow-2xl border-2 border-yellow-400 p-8 text-white backdrop-blur-md">

                <div className="text-center mb-6">
                    <div className="w-14 h-14 mx-auto rounded-full bg-yellow-400 flex items-center justify-center font-bold text-green-950 text-2xl shadow-md mb-2">
                        PM
                    </div>
                    <h2 className="text-3xl font-bold text-yellow-400 font-serif">Welcome Back</h2>
                    <p className="text-sm text-green-200">AI Political Poster Maker</p>
                </div>

                {error && (
                    <div className="bg-red-600 text-white p-3 rounded-lg text-sm mb-4 border border-red-400 text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-yellow-300 font-medium mb-1 text-sm">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="example@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg bg-emerald-950 border border-emerald-700 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-yellow-300 font-medium mb-1 text-sm">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="********"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg bg-emerald-950 border border-emerald-700 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-2 py-3 bg-yellow-400 hover:bg-yellow-500 text-green-950 font-bold rounded-lg text-lg shadow-lg transition duration-200 cursor-pointer disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-300">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-yellow-400 hover:underline font-bold">
                            Register here
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}