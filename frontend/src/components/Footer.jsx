import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer footer-center p-10 bg-base-200 text-base-content border-t border-base-300">
            <aside className="space-y-2">
                {/* Logo matching your navbar style */}
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-warning flex items-center justify-center text-black font-black text-xl shadow-md">
                        PM
                    </div>
                    <div className="text-left">
                        <span className="text-xl font-bold tracking-wide text-warning block leading-none">
                            Poster Maker
                        </span>
                        <span className="text-[10px] tracking-widest uppercase text-base-content/60 block mt-1">
                            AI Political Solution
                        </span>
                    </div>
                </div>

                <p className="font-medium text-base-content/70 mt-2">
                    Empowering digital political campaigns with next-gen AI poster designs.
                </p>

                <p className="text-sm text-base-content/50">
                    Copyright © {new Date().getFullYear()} - All rights reserved by Poster Maker
                </p>
            </aside>

            {/* Navigation Links */}
            <nav className="grid grid-flow-col gap-6 font-semibold">
                <Link href="/" className="link link-hover hover:text-warning transition-colors">
                    Home
                </Link>
                <Link href="/create-poster" className="link link-hover hover:text-warning transition-colors">
                    Create Poster
                </Link>
                <Link href="/my-posters" className="link link-hover hover:text-warning transition-colors">
                    My Posters
                </Link>
                <Link href="/about" className="link link-hover hover:text-warning transition-colors">
                    About
                </Link>
                <Link href="/contact" className="link link-hover hover:text-warning transition-colors">
                    Contact
                </Link>
            </nav>

            {/* Social Media or Action Links */}
            <nav>
                <div className="flex gap-4">
                    <a href="#" className="btn btn-sm btn-ghost hover:text-warning">
                        Twitter
                    </a>
                    <a href="#" className="btn btn-sm btn-ghost hover:text-warning">
                        Facebook
                    </a>
                    <a href="#" className="btn btn-sm btn-ghost hover:text-warning">
                        LinkedIn
                    </a>
                </div>
            </nav>
        </footer>
    );
}