import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import logoImg from '../assets/images/cnpc-icon.jpg';

const Footer = () => {
    return (
        <footer className="bg-[#0B0F19] border-t border-white/10 pt-16 pb-8 px-6 lg:px-12 mt-auto">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                    {/* Brand Section */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <Link to="/" className="flex items-center gap-3 mb-4 group">
                            <img
                                src={logoImg}
                                alt="CNPC Logo"
                                className="w-12 h-12 rounded-full border border-white/20 group-hover:border-cnpc-accent transition-colors object-cover"
                            />
                            <span className="text-white font-black tracking-widest text-2xl uppercase group-hover:text-cnpc-accent transition-colors">
                                CNPC
                            </span>
                        </Link>

                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
                            Connecting players. Building champions. The official hub of Camarines Norte Pickleball.
                        </p>

                        <a
                            href="https://www.facebook.com/CNPC.pb"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/30 px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-widest transition-all"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                            </svg>
                            Follow our Facebook
                        </a>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h4 className="text-white font-black uppercase tracking-widest mb-6">Explore</h4>
                        <div className="flex flex-col gap-3 text-sm font-bold text-slate-400 uppercase tracking-wider">
                            <Link to="/events" className="hover:text-cnpc-accent transition-colors">Upcoming Events</Link>
                            <Link to="/coaches" className="hover:text-cnpc-accent transition-colors">Find a Coach</Link>
                            <Link to="/dupr" className="hover:text-cnpc-accent transition-colors">DUPR Standings</Link>
                            <Link to="/marketplace" className="hover:text-cnpc-accent transition-colors">Marketplace</Link>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h4 className="text-white font-black uppercase tracking-widest mb-6">Contact Us</h4>
                        <div className="space-y-4 text-slate-400 text-sm">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <MapPin className="w-5 h-5 text-cnpc-accent shrink-0" />
                                <span>Daet, Camarines Norte, Philippines</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <Mail className="w-5 h-5 text-cnpc-accent shrink-0" />
                                <a href="mailto:cnpcdev@gmail.com" className="hover:text-white transition-colors">cnpcdev@gmail.com</a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Copyright */}
                <div className="border-t border-white/10 pt-8 flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                    <p>&copy; {new Date().getFullYear()} Camarines Norte Pickleball Club. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;