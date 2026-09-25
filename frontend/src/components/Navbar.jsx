'use client';

import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
    const pathname = usePathname();

    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = '/login';
                },
            },
        });
    };

    return (
        <div className="navbar bg-emerald-950 text-neutral-content shadow-lg sticky top-0 z-50 border-b-2 border-yellow-400 px-4 lg:px-8">

            {/* Navbar Start (Mobile dropdown & Logo) */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-yellow-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    {/* Mobile Dropdown Menu */}
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-emerald-900 rounded-box z-[1] mt-3 w-52 p-2 shadow-xl border border-emerald-800 text-white font-medium">
                        <li><Link href="/" className={pathname === '/' ? 'active bg-green-800 text-yellow-300 font-bold' : ''}>Home</Link></li>

                        <li><Link href="/create-poster" className={pathname === '/create-poster' ? 'active bg-green-800 text-yellow-300 font-bold' : ''}>Create Poster</Link></li>
                        <li><Link href="/my-poster" className={pathname === '/my-poster' ? 'active bg-green-800 text-yellow-300 font-bold' : ''}>My Posters</Link></li>
                    </ul>
                </div>

                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-3 normal-case text-xl">
                    <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-green-950 text-xl shadow">
                        PM
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-xl font-bold tracking-wide text-yellow-400 font-serif">Poster Maker</span>
                        <span className="block text-[10px] text-green-200">AI Political Solution</span>
                    </div>
                </Link>
            </div>

            {/* Navbar Center (Desktop Menu) */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2 font-medium">
                    <li>
                        <Link href="/" className={pathname === '/' ? 'bg-green-800 text-yellow-300 border-b-2 border-yellow-400' : 'hover:bg-green-800 hover:text-yellow-300'}>
                            Home
                        </Link>
                    </li>

                    <li>
                        <Link href="/create-poster" className={pathname === '/create-poster' ? 'bg-green-800 text-yellow-300 border-b-2 border-yellow-400' : 'hover:bg-green-800 hover:text-yellow-300'}>
                            Create Poster
                        </Link>
                    </li>
                    <li>
                        <Link href="/my-poster" className={pathname === '/my-poster' ? 'bg-green-800 text-yellow-300 border-b-2 border-yellow-400' : 'hover:bg-green-800 hover:text-yellow-300'}>
                            My Posters
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Navbar End (Login / User Actions) */}
            <div className="navbar-end gap-3">
                {isPending ? (
                    <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                ) : user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-yellow-400">
                            <div className="w-10 rounded-full bg-yellow-400 text-green-950 flex items-center justify-center font-bold">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-emerald-900 rounded-box z-[1] mt-3 w-52 p-2 shadow border border-emerald-800 text-white">
                            <li className="px-3 py-2 text-yellow-300 font-semibold border-b border-emerald-800">
                                {user.name}
                            </li>
                            <li><Link href="/profile">Profile Settings</Link></li>
                            <li><button onClick={handleLogout} className="text-red-400 font-bold">Logout</button></li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link href="/login" className="btn btn-sm btn-ghost text-yellow-300 hover:bg-green-800">
                            Login
                        </Link>
                        <Link href="/register" className="btn btn-sm bg-yellow-400 hover:bg-yellow-500 text-green-950 font-bold border-none shadow">
                            Register
                        </Link>
                    </div>
                )}
            </div>

        </div>
    );
}