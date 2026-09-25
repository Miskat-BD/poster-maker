import Link from "next/link";

export default function Hero() {
    return (
        <div className="min-h-screen bg-base-100 text-base-content overflow-hidden">

            {/* 1. HERO SECTION */}
            <section className="hero min-h-[85vh] relative">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-warning/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="hero-content flex-col lg:flex-row-reverse gap-12 max-w-7xl mx-auto px-6 py-12">
                    {/* Right side: Mockup Card */}
                    <div className="flex-1 w-full max-w-lg">
                        <div className="relative">
                            <div className="absolute -inset-1.5 bg-gradient-to-r from-warning to-primary rounded-2xl blur opacity-25 animate-pulse"></div>
                            <div className="relative card bg-base-200 border border-base-300 shadow-2xl p-8 rounded-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-error"></div>
                                        <div className="w-3 h-3 rounded-full bg-warning"></div>
                                        <div className="w-3 h-3 rounded-full bg-success"></div>
                                    </div>
                                    <span className="text-xs font-mono text-base-content/60">ai-poster.config.js</span>
                                </div>
                                <div className="space-y-4 font-mono text-sm">
                                    <div className="p-3 bg-base-300/50 rounded-lg text-warning">
                                        ✨ AI Political Solution initialized...
                                    </div>
                                    <div className="p-3 bg-base-300/50 rounded-lg text-base-content/80">
                                        🎨 Generating dynamic layout & assets
                                    </div>
                                    <div className="p-3 bg-base-300/50 rounded-lg text-success">
                                        🚀 Ready to create stunning posters.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Left side: Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-semibold mb-6 border border-warning/20">
                            <span className="w-2 h-2 rounded-full bg-warning animate-ping"></span>
                            AI Political Solution Live
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                            Create Stunning <br />
                            <span className="bg-gradient-to-r from-warning via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                                Political Posters
                            </span>{" "}
                            Instantly
                        </h1>
                        <p className="py-6 text-base-content/70 text-lg max-w-xl mx-auto lg:mx-0">
                            Empower your campaign with AI-driven poster designs. Fast, professional, and tailored specifically for your political branding.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                            <Link href="/create-poster"> <button className="btn bg-warning text-black hover:bg-warning/90 px-8 font-bold shadow-lg shadow-warning/20 border-none">
                                Create Poster Now
                            </button></Link>
                            <Link href="/my-poster"> <button className="btn btn-outline border-base-300 hover:bg-base-200">
                                View My Posters
                            </button></Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. FEATURES SECTION */}
            <section className="py-20 bg-base-200/50 border-y border-base-300">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose Our <span className="text-warning">Poster Maker</span></h2>
                        <p className="text-base-content/70">Designed to give your election campaign a sharp, professional edge without needing any graphic design skills.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card bg-base-100 border border-base-300 p-6 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center font-bold text-xl mb-4">⚡</div>
                            <h3 className="text-xl font-bold mb-2">AI-Powered Layouts</h3>
                            <p className="text-base-content/70 text-sm">Automatically generates balanced, high-impact structures customized for political symbols and slogans.</p>
                        </div>

                        <div className="card bg-base-100 border border-base-300 p-6 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center font-bold text-xl mb-4">🎯</div>
                            <h3 className="text-xl font-bold mb-2">Instant Customization</h3>
                            <p className="text-base-content/70 text-sm">Quickly swap candidate photos, party names, event schedules, and manifestos in seconds.</p>
                        </div>

                        <div className="card bg-base-100 border border-base-300 p-6 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center font-bold text-xl mb-4">📥</div>
                            <h3 className="text-xl font-bold mb-2">High-Res Multi-Export</h3>
                            <p className="text-base-content/70 text-sm">Download ultra-sharp formats optimized directly for Facebook, Instagram, Twitter feeds, and print media.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. HOW IT WORKS SECTION */}
            <section className="py-20 max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">How It <span className="text-warning">Works</span></h2>
                    <p className="text-base-content/70">Get your campaign poster ready in three simple steps.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-warning text-black font-extrabold text-2xl flex items-center justify-center mb-6 shadow-lg shadow-warning/20">1</div>
                        <h3 className="text-xl font-bold mb-2">Select a Template</h3>
                        <p className="text-base-content/70 text-sm">Choose from our exclusive collection of political campaign layouts.</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-warning text-black font-extrabold text-2xl flex items-center justify-center mb-6 shadow-lg shadow-warning/20">2</div>
                        <h3 className="text-xl font-bold mb-2">Add Your Details</h3>
                        <p className="text-base-content/70 text-sm">Upload your candidate photo, name, designation, and core campaign message.</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-warning text-black font-extrabold text-2xl flex items-center justify-center mb-6 shadow-lg shadow-warning/20">3</div>
                        <h3 className="text-xl font-bold mb-2">Generate & Download</h3>
                        <p className="text-base-content/70 text-sm">Let AI polish the design elements, then download instantly for sharing.</p>
                    </div>
                </div>
            </section>

            {/* 4. CALL TO ACTION (CTA) BANNER */}
            <section className="py-16 bg-base-200 border-t border-base-300">
                <div className="max-w-5xl mx-auto px-6 text-center bg-gradient-to-r from-warning/10 via-base-100 to-warning/10 border border-warning/20 p-12 rounded-3xl shadow-xl">
                    <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">Ready to Win Your Campaign?</h2>
                    <p className="text-base-content/70 max-w-xl mx-auto mb-8">Start designing professional election posters in less than 2 minutes. No credit card required.</p>
                    <button className="btn bg-warning text-black hover:bg-warning/90 px-10 font-bold text-base shadow-lg shadow-warning/20 border-none">
                        Get Started Now
                    </button>
                </div>
            </section>

        </div>
    );
}