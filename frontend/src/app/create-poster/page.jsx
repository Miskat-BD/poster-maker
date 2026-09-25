'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { getBackendUrl } from '@/lib/api-config';
import Link from 'next/link';

export default function CreatePosterPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [formData, setFormData] = useState({
        candidateName: '',
        position: '',
        party: '',
        slogan: '',
        constituency: '',
        electionDate: '',
        colorTheme: '', // patriot, gold, midnight, emerald
        symbol: '', // star, scale, sun, flag, dove
        photoUrl: '', // base64 or URL
    });

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [previewPhoto, setPreviewPhoto] = useState(null);
    const [aiFocus, setAiFocus] = useState('');
    const [generatingSlogans, setGeneratingSlogans] = useState(false);
    const [generatedSlogans, setGeneratedSlogans] = useState([]);
    const canvasRef = useRef(null);

    // Redirect if unauthenticated
    useEffect(() => {
        if (!isPending && !user) {
            router.push('/login?redirect=/create-poster');
        }
    }, [isPending, user, router]);

    const handleGenerateSlogans = async () => {
        setGeneratingSlogans(true);
        setMessage({ type: '', text: '' });
        try {
            const backendUrl = getBackendUrl();
            const res = await fetch(`${backendUrl}/generate-slogan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    candidateName: formData.candidateName || 'Alexander Sterling',
                    position: formData.position || 'Mayor',
                    party: formData.party || 'United Reform Party',
                    focus: aiFocus || 'development and progress',
                    constituency: formData.constituency || 'Central District',
                }),
            });

            const data = await res.json();
            if (data.slogans && Array.isArray(data.slogans) && data.slogans.length > 0) {
                setGeneratedSlogans(data.slogans);
                // Auto-fill the first slogan if slogan field is currently empty
                if (!formData.slogan) {
                    setFormData((prev) => ({ ...prev, slogan: data.slogans[0] }));
                }
            } else {
                throw new Error('Failed to generate slogans');
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Error generating AI slogans' });
        } finally {
            setGeneratingSlogans(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewPhoto(reader.result);
                setFormData((prev) => ({ ...prev, photoUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Color theme helper
    const getThemeStyles = () => {
        switch (formData.colorTheme) {
            case 'gold':
                return {
                    bg: 'from-amber-950 via-yellow-900 to-amber-950',
                    border: 'border-yellow-400',
                    accentBg: 'bg-yellow-400',
                    accentText: 'text-amber-950',
                    badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-400',
                };
            case 'midnight':
                return {
                    bg: 'from-slate-950 via-blue-950 to-slate-950',
                    border: 'border-blue-400',
                    accentBg: 'bg-blue-500',
                    accentText: 'text-white',
                    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400',
                };
            case 'emerald':
                return {
                    bg: 'from-emerald-950 via-teal-900 to-emerald-950',
                    border: 'border-teal-400',
                    accentBg: 'bg-teal-400',
                    accentText: 'text-emerald-950',
                    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-400',
                };
            case 'patriot':
            default:
                return {
                    bg: 'from-emerald-950 via-green-900 to-emerald-950',
                    border: 'border-yellow-400',
                    accentBg: 'bg-yellow-400',
                    accentText: 'text-green-950',
                    badgeBg: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/50',
                };
        }
    };

    const currentTheme = getThemeStyles();

    const renderSymbolIcon = (symbol) => {
        switch (symbol) {
            case 'scale':
                return '⚖️';
            case 'sun':
                return '☀️';
            case 'flag':
                return '🚩';
            case 'dove':
                return '🕊️';
            case 'star':
            default:
                return '⭐';
        }
    };

    const handleSavePoster = async () => {
        if (!user) {
            setMessage({ type: 'error', text: 'You must be logged in to save posters.' });
            return;
        }

        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const backendUrl = getBackendUrl();
            const payload = {
                ...formData,
                userEmail: user.email,
                userName: user.name,
                userId: user.id,
            };

            const res = await fetch(`${backendUrl}/posters`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setMessage({ type: 'success', text: 'Poster saved successfully! Redirecting to My Posters...' });
                setTimeout(() => {
                    router.push('/my-poster');
                }, 1500);
            } else {
                throw new Error(data.error || 'Failed to save poster');
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Error saving poster to backend' });
        } finally {
            setSaving(false);
        }
    };

    const handleDownloadCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = 800;
        const h = 1200;
        canvas.width = w;
        canvas.height = h;

        // Background
        const grad = ctx.createLinearGradient(0, 0, w, h);
        if (formData.colorTheme === 'gold') {
            grad.addColorStop(0, '#2d1b00');
            grad.addColorStop(0.5, '#5c3a00');
            grad.addColorStop(1, '#2d1b00');
        } else if (formData.colorTheme === 'midnight') {
            grad.addColorStop(0, '#020617');
            grad.addColorStop(0.5, '#0f172a');
            grad.addColorStop(1, '#020617');
        } else if (formData.colorTheme === 'emerald') {
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
        ctx.fillText((formData.party || 'POLITICAL PARTY').toUpperCase(), w / 2, 100);

        // Candidate Photo Container
        const photoY = 150;
        const photoSize = 420;
        const photoX = (w - photoSize) / 2;

        if (previewPhoto) {
            const img = new Image();
            img.onload = () => {
                ctx.save();
                ctx.beginPath();
                ctx.rect(photoX, photoY, photoSize, photoSize);
                ctx.clip();
                ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
                ctx.restore();

                // Draw photo border
                ctx.strokeStyle = '#facc15';
                ctx.lineWidth = 6;
                ctx.strokeRect(photoX, photoY, photoSize, photoSize);

                finishDraw();
            };
            img.src = previewPhoto;
        } else {
            // Placeholder box
            ctx.fillStyle = 'rgba(255,255,255,0.08)';
            ctx.fillRect(photoX, photoY, photoSize, photoSize);
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 4;
            ctx.strokeRect(photoX, photoY, photoSize, photoSize);

            ctx.fillStyle = '#facc15';
            ctx.font = 'bold 70px sans-serif';
            ctx.fillText(renderSymbolIcon(formData.symbol), w / 2, photoY + 230);
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
            ctx.fillText((formData.position || 'CANDIDATE POSITION').toUpperCase(), w / 2, 633);

            // Candidate Name
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 46px serif';
            ctx.fillText(formData.candidateName || 'Candidate Name', w / 2, 710);

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
            ctx.fillText(`"${formData.slogan || 'Your Campaign Slogan'}"`, w / 2, 800);

            // Constituency / Details
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '20px sans-serif';
            ctx.fillText(formData.constituency || '', w / 2, 860);

            // Footer Banner
            ctx.fillStyle = '#facc15';
            ctx.fillRect(40, 950, w - 80, 160);

            ctx.fillStyle = '#064e3b';
            ctx.font = 'bold 36px serif';
            ctx.fillText('VOTE FOR PROGRESS & HONESTY', w / 2, 1020);

            ctx.font = 'bold 24px sans-serif';
            ctx.fillText(`ELECTION DATE: ${formData.electionDate || '2026'}`, w / 2, 1070);

            // Trigger download
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `${(formData.candidateName || 'Poster').replace(/\s+/g, '_')}_Campaign.png`;
            link.href = dataUrl;
            link.click();
        }
    };

    if (isPending) {
        return (
            <div className="min-h-[calc(100vh-80px)] bg-emerald-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-yellow-400">
                    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-semibold">Loading session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950 px-4 py-8 text-white">
            <div className="max-w-7xl mx-auto">

                {/* Page Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl lg:text-5xl font-bold text-yellow-400 font-serif mb-2">
                        Create Political Poster
                    </h1>
                    <p className="text-green-200 text-sm lg:text-base max-w-2xl mx-auto">
                        Design high-impact campaign posters for your political campaign with live preview and instant download.
                    </p>
                </div>

                {message.text && (
                    <div className={`max-w-3xl mx-auto mb-6 p-4 rounded-xl border text-center font-medium shadow-lg ${message.type === 'error'
                        ? 'bg-red-900/90 border-red-500 text-white'
                        : 'bg-emerald-800/90 border-yellow-400 text-yellow-300'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Main Content Grid: Form (Left) & Canvas Live Preview (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Form Controls */}
                    <div className="lg:col-span-6 bg-emerald-900/80 backdrop-blur-md rounded-2xl border-2 border-yellow-400/60 p-6 shadow-2xl space-y-5">
                        <h2 className="text-xl font-bold text-yellow-400 border-b border-emerald-800 pb-3 flex items-center gap-2">
                            <span>✏️</span> Candidate & Campaign Details
                        </h2>

                        {/* Candidate Name */}
                        <div>
                            <label className="block text-yellow-300 font-medium mb-1 text-sm">
                                Candidate Full Name *
                            </label>
                            <input
                                type="text"
                                name="candidateName"
                                value={formData.candidateName}
                                onChange={handleInputChange}
                                placeholder="e.g. Hon. Alexander Sterling"
                                className="w-full px-4 py-2.5 rounded-lg bg-emerald-950 border border-emerald-700 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                                required
                            />
                        </div>

                        {/* Position / Running For */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-yellow-300 font-medium mb-1 text-sm">
                                    Position / Title *
                                </label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Mayor Candidate 2026"
                                    className="w-full px-4 py-2.5 rounded-lg bg-emerald-950 border border-emerald-700 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-yellow-300 font-medium mb-1 text-sm">
                                    Political Party *
                                </label>
                                <input
                                    type="text"
                                    name="party"
                                    value={formData.party}
                                    onChange={handleInputChange}
                                    placeholder="e.g. United Reform Party"
                                    className="w-full px-4 py-2.5 rounded-lg bg-emerald-950 border border-emerald-700 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                                    required
                                />
                            </div>
                        </div>

                        {/* AI Slogan Generator & Manual Input */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-yellow-300 font-medium text-sm">
                                    Campaign Slogan / Tagline *
                                </label>
                            </div>

                            <textarea
                                name="slogan"
                                rows={2}
                                value={formData.slogan}
                                onChange={handleInputChange}
                                placeholder="e.g. A Vision for Progress, Leadership You Can Trust"
                                className="w-full px-4 py-2.5 rounded-lg bg-emerald-950 border border-emerald-700 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                                required
                            />

                            {/* AI Slogan Generation Tool Box */}
                            <div className="bg-emerald-950/80 p-3.5 rounded-xl border border-yellow-400/40 space-y-3 mt-2">
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                    <input
                                        type="text"
                                        value={aiFocus}
                                        onChange={(e) => setAiFocus(e.target.value)}
                                        placeholder="Campaign Focus (e.g. Youth, Education, Jobs)"
                                        className="flex-1 px-3 py-1.5 rounded-md bg-emerald-900 border border-emerald-700 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleGenerateSlogans}
                                        disabled={generatingSlogans}
                                        className="py-1.5 px-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-green-950 font-bold text-xs rounded-md shadow transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
                                    >
                                        {generatingSlogans ? (
                                            <>
                                                <div className="w-3.5 h-3.5 border-2 border-green-950 border-t-transparent rounded-full animate-spin"></div>
                                                <span>Generating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>✨</span>
                                                <span>Generate with AI</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {generatedSlogans.length > 0 && (
                                    <div className="space-y-1.5 pt-1">
                                        <p className="text-[11px] font-semibold text-yellow-300 uppercase tracking-wider">
                                            Select an AI Slogan to Auto-Fill:
                                        </p>
                                        <div className="flex flex-col gap-1.5">
                                            {generatedSlogans.map((sloganText, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setFormData((prev) => ({ ...prev, slogan: sloganText }))}
                                                    className={`text-left text-xs p-2 rounded-lg border transition cursor-pointer flex items-center justify-between gap-2 ${
                                                        formData.slogan === sloganText
                                                            ? 'bg-yellow-400/20 border-yellow-400 text-yellow-200 font-medium'
                                                            : 'bg-emerald-900/60 border-emerald-800 text-green-200 hover:bg-emerald-800/80 hover:text-white'
                                                    }`}
                                                >
                                                    <span className="italic">"{sloganText}"</span>
                                                    <span className="text-[10px] bg-yellow-400 text-green-950 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                                                        {formData.slogan === sloganText ? 'Selected' : 'Use'}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Constituency & Election Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-yellow-300 font-medium mb-1 text-sm">
                                    Constituency / Location
                                </label>
                                <input
                                    type="text"
                                    name="constituency"
                                    value={formData.constituency}
                                    onChange={handleInputChange}
                                    placeholder="e.g. District 7 - Central"
                                    className="w-full px-4 py-2.5 rounded-lg bg-emerald-950 border border-emerald-700 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                                />
                            </div>
                            <div>
                                <label className="block text-yellow-300 font-medium mb-1 text-sm">
                                    Election Date / Year
                                </label>
                                <input
                                    type="text"
                                    name="electionDate"
                                    value={formData.electionDate}
                                    onChange={handleInputChange}
                                    placeholder="e.g. November 2026"
                                    className="w-full px-4 py-2.5 rounded-lg bg-emerald-950 border border-emerald-700 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                                />
                            </div>
                        </div>

                        {/* Photo Upload */}
                        <div>
                            <label className="block text-yellow-300 font-medium mb-1 text-sm">
                                Candidate Photo (Upload PNG/JPG)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-green-950 hover:file:bg-yellow-500 bg-emerald-950 text-emerald-200 border border-emerald-700 rounded-lg cursor-pointer"
                            />
                            <p className="text-xs text-green-300 mt-1">Recommended portrait photo with clear background.</p>
                        </div>

                        {/* Customization Options (Theme & Symbol) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div>
                                <label className="block text-yellow-300 font-medium mb-1 text-sm">
                                    Color Palette Theme
                                </label>
                                <select
                                    name="colorTheme"
                                    value={formData.colorTheme}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg bg-emerald-950 border border-emerald-700 text-white focus:outline-none focus:border-yellow-400"
                                >
                                    <option value="patriot">Patriot (Green & Gold)</option>
                                    <option value="gold">Royal Gold & Amber</option>
                                    <option value="emerald">Emerald Teal</option>
                                    <option value="midnight">Midnight Leadership</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-yellow-300 font-medium mb-1 text-sm">
                                    Party Symbol
                                </label>
                                <select
                                    name="symbol"
                                    value={formData.symbol}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg bg-emerald-950 border border-emerald-700 text-white focus:outline-none focus:border-yellow-400"
                                >
                                    <option value="star">⭐ Victory Star</option>
                                    <option value="scale">⚖️ Justice Scale</option>
                                    <option value="sun">☀️ Rising Sun</option>
                                    <option value="flag">🚩 Campaign Flag</option>
                                    <option value="dove">🕊️ Peace Dove</option>
                                </select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={handleSavePoster}
                                disabled={saving}
                                className="flex-1 py-3 px-6 bg-yellow-400 hover:bg-yellow-500 text-green-950 font-bold rounded-xl shadow-lg transition duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-green-950 border-t-transparent rounded-full animate-spin"></div>
                                        <span>Saving Poster...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>💾</span>
                                        <span>Save to My Posters</span>
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleDownloadCanvas}
                                className="py-3 px-6 bg-emerald-800 hover:bg-emerald-700 border border-yellow-400 text-yellow-300 font-bold rounded-xl shadow-lg transition duration-200 cursor-pointer flex items-center justify-center gap-2"
                            >
                                <span>📥</span>
                                <span>Download PNG</span>
                            </button>
                        </div>

                    </div>

                    {/* Live Preview Canvas Container */}
                    <div className="lg:col-span-6 flex flex-col items-center">
                        <div className="w-full max-w-md sticky top-24">
                            <div className="text-center mb-3 flex items-center justify-between">
                                <span className="text-xs uppercase tracking-widest text-yellow-400 font-semibold">Live Preview</span>
                                <span className="text-xs text-green-300">Aspect 2:3 (Portrait)</span>
                            </div>

                            {/* Dynamic Live Poster Preview Box */}
                            <div className={`relative w-full rounded-2xl p-6 border-4 shadow-2xl overflow-hidden bg-gradient-to-br ${currentTheme.bg} ${currentTheme.border}`}>

                                {/* Inner Decorative Frame */}
                                <div className="border border-yellow-400/40 rounded-xl p-4 flex flex-col items-center text-center relative min-h-[580px]">

                                    {/* Top Party Badge */}
                                    <div className="w-full bg-yellow-400 text-green-950 font-serif font-black tracking-wider text-xs lg:text-sm py-1.5 px-3 rounded shadow mb-4 uppercase">
                                        {formData.party || 'POLITICAL PARTY'}
                                    </div>

                                    {/* Photo / Avatar Placeholder */}
                                    <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-xl border-4 border-yellow-400 shadow-xl overflow-hidden mb-4 bg-emerald-950 flex items-center justify-center relative">
                                        {previewPhoto ? (
                                            <img
                                                src={previewPhoto}
                                                alt={formData.candidateName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-yellow-400 p-4">
                                                <span className="text-5xl mb-2">{renderSymbolIcon(formData.symbol)}</span>
                                                <span className="text-xs text-green-300 font-medium">Upload Photo Above</span>
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-yellow-400 text-green-950 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow">
                                            {renderSymbolIcon(formData.symbol)}
                                        </div>
                                    </div>

                                    {/* Position Badge */}
                                    <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${currentTheme.badgeBg}`}>
                                        {formData.position || 'CANDIDATE POSITION'}
                                    </div>

                                    {/* Candidate Name */}
                                    <h3 className="text-2xl lg:text-3xl font-bold font-serif text-white tracking-wide mb-1 leading-tight">
                                        {formData.candidateName || 'Candidate Name'}
                                    </h3>

                                    {/* Golden Divider */}
                                    <div className="w-24 h-0.5 bg-yellow-400 my-2"></div>

                                    {/* Slogan */}
                                    <p className="text-yellow-200 text-xs lg:text-sm italic font-serif px-2 mb-3 max-w-sm">
                                        "{formData.slogan || 'Your Campaign Slogan'}"
                                    </p>

                                    {/* Location / Details */}
                                    {formData.constituency && (
                                        <p className="text-emerald-200 text-xs mb-4">
                                            📍 {formData.constituency}
                                        </p>
                                    )}

                                    {/* Bottom Election Box */}
                                    <div className="mt-auto w-full bg-yellow-400 text-green-950 rounded-lg p-2 font-bold shadow-md">
                                        <div className="text-xs uppercase tracking-widest">VOTE FOR PROGRESS</div>
                                        <div className="text-sm font-black">ELECTION DATE: {formData.electionDate || '2026'}</div>
                                    </div>

                                </div>

                            </div>

                            {/* Hidden canvas for downloading image */}
                            <canvas ref={canvasRef} className="hidden" />

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
