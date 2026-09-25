export default function Hero() {
    return (
        <div className="hero min-h-[85vh] bg-base-100 relative overflow-hidden text-base-content">
            {/* Decorative background glow elements matching the yellow brand theme */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-warning/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="hero-content flex-col lg:flex-row-reverse gap-12 max-w-7xl mx-auto px-6 py-12">
                {/* Right side: Modern Visual / Mockup Card */}
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
                        <button className="btn bg-warning text-black hover:bg-warning/90 px-8 font-bold shadow-lg shadow-warning/20 border-none">
                            Create Poster Now
                        </button>
                        <button className="btn btn-outline border-base-300 hover:bg-base-200">
                            View My Posters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}