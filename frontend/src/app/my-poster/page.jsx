'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

export default function MyPosterPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [posters, setPosters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!isPending && !user) {
            router.push('/login?redirect=/my-poster');
        } else if (user) {
            fetchUserPosters();
        }
    }, [isPending, user, router]);

    const fetchUserPosters = async () => {
        setLoading(true);
        setError('');
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
            const res = await fetch(`${backendUrl}/posters?email=${encodeURIComponent(user.email)}`);
            if (!res.ok) {
                throw new Error('Failed to fetch posters');
            }
            const data = await res.json();
            setPosters(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || 'Error loading posters');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this poster?')) return;
        setDeletingId(id);
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
            const res = await fetch(`${backendUrl}/posters/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setPosters((prev) => prev.filter((p) => p._id !== id));
            } else {
                alert(data.error || 'Failed to delete poster');
            }
        } catch (err) {
            alert('Error deleting poster');
        } finally {
            setDeletingId(null);
        }
    };

    const handleDownload = (poster) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = 800;
        const h = 1200;
        canvas.width = w;
        canvas.height = h;

        // Background
        const grad = ctx.createLinearGradient(0, 0, w, h);
        if (poster.colorTheme === 'gold') {
            grad.addColorStop(0, '#2d1b00');
            grad.addColorStop(0.5, '#5c3a00');
            grad.addColorStop(1, '#2d1b00');
        } else if (poster.colorTheme === 'midnight') {
            grad.addColorStop(0, '#020617');
            grad.addColorStop(0.5, '#0f172a');
            grad.addColorStop(1, '#020617');
        } else if (poster.colorTheme === 'emerald') {
            grad.addColorStop(0, '#022c22');
            grad.addColorStop(0.5, '#115e59');
            grad.addColorStop(1, '#022c22');
        } else {
            grad.addColorStop(0, '#022c22');
            grad.addColorStop(0.5, '#064e3b');
            grad.addColorStop(1, '#022c22');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Gold Outer Border
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 12;
        ctx.strokeRect(20, 20, w - 40, h - 40);

        // Inner Border
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(32, 32, w - 64, h - 64);

        // Header Party Box
        ctx.fillStyle = '#facc15';
        ctx.fillRect(80, 60, w - 160, 60);

        ctx.fillStyle = '#064e3b';
        ctx.font = 'bold 28px serif';
        ctx.textAlign = 'center';
        ctx.fillText((poster.party || 'POLITICAL PARTY').toUpperCase(), w / 2, 100);

        // Candidate Photo Container
        const photoY = 150;
        const photoSize = 420;
        const photoX = (w - photoSize) / 2;

        if (poster.photoUrl) {
            const img = new Image();
            img.onload = () => {
                ctx.save();
                ctx.beginPath();
                ctx.rect(photoX, photoY, photoSize, photoSize);
                ctx.clip();
                ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
                ctx.restore();

                ctx.strokeStyle = '#facc15';
                ctx.lineWidth = 6;
                ctx.strokeRect(photoX, photoY, photoSize, photoSize);

                finishDraw();
            };
            img.src = poster.photoUrl;
        } else {
            ctx.fillStyle = 'rgba(255,255,255,0.08)';
            ctx.fillRect(photoX, photoY, photoSize, photoSize);
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 4;
            ctx.strokeRect(photoX, photoY, photoSize, photoSize);

            ctx.fillStyle = '#facc15';
            ctx.font = 'bold 70px sans-serif';
            ctx.fillText('⭐', w / 2, photoY + 230);
            finishDraw();
        }

        function finishDraw() {
            // Position Pill
            ctx.fillStyle = 'rgba(250, 204, 21, 0.2)';
            ctx.fillRect(100, 600, w - 200, 50);
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 2;
            ctx.strokeRect(100, 600, w - 200, 50);

            ctx.fillStyle = '#fef08a';
            ctx.font = 'bold 24px sans-serif';
            ctx.fillText((poster.position || 'CANDIDATE POSITION').toUpperCase(), w / 2, 633);

            // Candidate Name
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 46px serif';
            ctx.fillText(poster.candidateName || 'Candidate Name', w / 2, 710);

            // Gold Divider Line
            ctx.beginPath();
            ctx.moveTo(150, 740);
            ctx.lineTo(w - 150, 740);
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Slogan
            ctx.fillStyle = '#fef08a';
            ctx.font = 'italic 24px Georgia, serif';
            ctx.fillText(`"${poster.slogan || 'Your Campaign Slogan'}"`, w / 2, 800);

            // Constituency
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '20px sans-serif';
            ctx.fillText(poster.constituency || '', w / 2, 860);

            // Footer Banner
            ctx.fillStyle = '#facc15';
            ctx.fillRect(40, 950, w - 80, 160);

            ctx.fillStyle = '#064e3b';
            ctx.font = 'bold 36px serif';
            ctx.fillText('VOTE FOR PROGRESS & HONESTY', w / 2, 1020);

            ctx.font = 'bold 24px sans-serif';
            ctx.fillText(`ELECTION DATE: ${poster.electionDate || '2026'}`, w / 2, 1070);

            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `${(poster.candidateName || 'Poster').replace(/\s+/g, '_')}_Campaign.png`;
            link.href = dataUrl;
            link.click();
        }
    };

    if (isPending || (loading && user)) {
        return (
            <div className="min-h-[calc(100vh-80px)] bg-emerald-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-yellow-400">
                    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-semibold">Loading your posters...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950 px-4 py-8 text-white">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b border-emerald-800 pb-6">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-yellow-400 font-serif">
                            My Saved Posters
                        </h1>
                        <p className="text-green-200 text-sm mt-1">
                            Manage and download all your generated political campaign posters.
                        </p>
                    </div>

                    <Link
                        href="/create-poster"
                        className="py-2.5 px-5 bg-yellow-400 hover:bg-yellow-500 text-green-950 font-bold rounded-lg shadow-md transition duration-200 flex items-center gap-2"
                    >
                        <span>➕</span> Create New Poster
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-900/80 border border-red-500 text-white p-4 rounded-xl text-center mb-6">
                        {error}
                    </div>
                )}

                {/* Posters Grid */}
                {posters.length === 0 ? (
                    <div className="bg-emerald-900/60 border-2 border-dashed border-yellow-400/40 rounded-2xl p-12 text-center max-w-xl mx-auto my-12">
                        <div className="w-16 h-16 mx-auto rounded-full bg-yellow-400/20 text-yellow-400 flex items-center justify-center text-3xl mb-4">
                            🎨
                        </div>
                        <h3 className="text-2xl font-bold text-yellow-400 font-serif mb-2">No Posters Saved Yet</h3>
                        <p className="text-green-200 text-sm mb-6">
                            You haven't generated any campaign posters yet. Start creating your custom political poster now!
                        </p>
                        <Link
                            href="/create-poster"
                            className="inline-block py-3 px-6 bg-yellow-400 hover:bg-yellow-500 text-green-950 font-bold rounded-xl shadow-lg transition"
                        >
                            Create Your First Poster
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posters.map((poster) => (
                            <div
                                key={poster._id}
                                className="bg-emerald-900/90 rounded-2xl border-2 border-yellow-400/60 overflow-hidden shadow-xl flex flex-col justify-between backdrop-blur-sm hover:border-yellow-400 transition"
                            >
                                {/* Card Top Visual Header */}
                                <div className="p-5 bg-gradient-to-r from-emerald-950 to-green-900 border-b border-emerald-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs bg-yellow-400 text-green-950 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                            {poster.party || 'PARTY'}
                                        </span>
                                        <span className="text-xs text-green-300">
                                            {poster.createdAt ? new Date(poster.createdAt).toLocaleDateString() : ''}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold font-serif text-yellow-300 line-clamp-1">
                                        {poster.candidateName}
                                    </h3>
                                    <p className="text-xs text-green-200 uppercase tracking-wide">
                                        {poster.position}
                                    </p>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                                    {poster.photoUrl ? (
                                        <div className="w-full h-48 rounded-xl overflow-hidden border border-yellow-400/40 bg-emerald-950">
                                            <img
                                                src={poster.photoUrl}
                                                alt={poster.candidateName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-48 rounded-xl border border-yellow-400/40 bg-emerald-950/80 flex items-center justify-center text-4xl">
                                            ⭐
                                        </div>
                                    )}

                                    <div className="text-center pt-2">
                                        <p className="text-sm italic text-yellow-100 font-serif line-clamp-2">
                                            "{poster.slogan}"
                                        </p>
                                        {poster.constituency && (
                                            <p className="text-xs text-green-300 mt-1">
                                                📍 {poster.constituency}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Card Actions */}
                                <div className="p-4 bg-emerald-950 border-t border-emerald-800 flex items-center gap-2">
                                    <button
                                        onClick={() => handleDownload(poster)}
                                        className="flex-1 py-2 px-3 bg-yellow-400 hover:bg-yellow-500 text-green-950 font-bold text-xs rounded-lg shadow transition flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                        <span>📥</span> Download PNG
                                    </button>
                                    <button
                                        onClick={() => handleDelete(poster._id)}
                                        disabled={deletingId === poster._id}
                                        className="py-2 px-3 bg-red-800/80 hover:bg-red-700 text-red-200 text-xs font-bold rounded-lg border border-red-500 transition cursor-pointer disabled:opacity-50"
                                    >
                                        {deletingId === poster._id ? '...' : '🗑️ Delete'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Hidden canvas element for PNG generation */}
                <canvas ref={canvasRef} className="hidden" />

            </div>
        </div>
    );
}