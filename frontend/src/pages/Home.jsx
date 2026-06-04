import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { ArrowDown, ShoppingBag, Trophy, Users, ShieldCheck, MapPin, Megaphone, X, ChevronLeft, ChevronRight, Award, Star, Maximize2, Image as ImageIcon, ExternalLink, CheckCircle, Pin, Calendar } from 'lucide-react';
import heroImg from '../assets/images/hero.jpg'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SmartLinkifier = ({ text, isExpanded }) => {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  if (!text || typeof text !== 'string') return null;
  const parts = text.split(urlRegex);

  return (
    <div className={`text-slate-200 leading-relaxed whitespace-pre-wrap mb-2 text-xs sm:text-sm md:text-base ${isExpanded ? '' : 'line-clamp-4'}`}>
      {parts.map((part, index) => {
        if (part.match(urlRegex)) {
          const href = part.startsWith('www.') ? `https://${part}` : part;
          return (
            <a key={index} href={href} target="_blank" rel="noopener noreferrer" className="text-cnpc-accent hover:text-lime-400 font-bold underline transition-colors break-all">
              {part}
            </a>
          );
        }
        return part;
      })}
    </div>
  );
};

const ImageLightboxModal = ({ images, currentIndex, onClose, onPrev, onNext }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && images.length > 1) onPrev();
      if (e.key === 'ArrowRight' && images.length > 1) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onPrev, onNext, images?.length]);

  if (!images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-2 md:p-12 animate-in fade-in duration-300">
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/60 to-transparent">
        <div className="text-white font-medium text-xs sm:text-sm md:text-base">Photo {currentIndex + 1} of {images.length}</div>
        <button onClick={onClose} className="p-2 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/80 transition-all">
          <X className="w-5 h-5 md:w-7 md:h-7" />
        </button>
      </div>
      <div className="relative w-full max-w-full max-h-full flex items-center justify-center p-2 md:p-0" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <img src={images[currentIndex]} alt={`Full screen view ${currentIndex + 1}`} className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl animate-in zoom-in-75 duration-300" />
      </div>
      {images.length > 1 && (
        <>
          <button onClick={onPrev} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/60 text-white/60 hover:text-white hover:bg-black/90 transition-all z-20"><ChevronLeft className="w-5 h-5 md:w-8 md:h-8" /></button>
          <button onClick={onNext} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/60 text-white/60 hover:text-white hover:bg-black/90 transition-all z-20"><ChevronRight className="w-5 h-5 md:w-8 md:h-8" /></button>
        </>
      )}
    </div>
  );
};

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  const [posts, setPosts] = useState([]);
  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [aboutImages, setAboutImages] = useState([]);
  const [currentAboutIndex, setCurrentAboutIndex] = useState(0);

  const [lightbox, setLightbox] = useState({ isOpen: false, images: [], currentIndex: 0 });
  const [isPostExpanded, setIsPostExpanded] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [postsRes, courtsRes, coachesRes, aboutRes] = await Promise.all([
          fetch(`${API_URL}/api/posts`),
          fetch(`${API_URL}/api/courts/approved`),
          fetch(`${API_URL}/api/coaches/approved`),
          fetch(`${API_URL}/api/about-images`)
        ]);

        if (postsRes.ok) setPosts(await postsRes.json());
        if (courtsRes.ok) setCourts(await courtsRes.json());
        if (coachesRes.ok) setCoaches(await coachesRes.json());
        if (aboutRes.ok) setAboutImages(await aboutRes.json());
      } catch (error) { 
        console.error("Failed to fetch dashboard data:", error); 
      }
    };

    fetchAllData();

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setIsMounted(true), 50);
    }, 300); 

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    if (aboutImages && aboutImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentAboutIndex((prev) => (prev + 1) % aboutImages.length);
      }, 4000); 
      return () => clearInterval(timer);
    }
  }, [aboutImages]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const openLightbox = (postImages, clickedIndex) => {
    if (!postImages || postImages.length === 0) return;
    setLightbox({ isOpen: true, images: postImages, currentIndex: clickedIndex });
  };
  const closeLightbox = () => setLightbox({ isOpen: false, images: [], currentIndex: 0 });
  const nextImage = () => setLightbox(prev => ({ ...prev, currentIndex: (prev.currentIndex + 1) % prev.images.length }));
  const prevImage = () => setLightbox(prev => ({ ...prev, currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length }));

  const fadeUp = (delayClass) => `transition-all duration-1000 ease-out transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${delayClass}`;

  const nextCourtSlide = () => { const slider = document.getElementById('courts-slider'); if (slider) slider.scrollBy({ left: 280, behavior: 'smooth' }); };
  const prevCourtSlide = () => { const slider = document.getElementById('courts-slider'); if (slider) slider.scrollBy({ left: -280, behavior: 'smooth' }); };
  const nextCoachSlide = () => { const slider = document.getElementById('coaches-slider'); if (slider) slider.scrollBy({ left: 280, behavior: 'smooth' }); };
  const prevCoachSlide = () => { const slider = document.getElementById('coaches-slider'); if (slider) slider.scrollBy({ left: -280, behavior: 'smooth' }); };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] via-[#0A192F] to-[#0B0F19] pt-20 px-4 overflow-hidden pointer-events-none">
        <div className="max-w-5xl mx-auto w-full flex flex-col items-center gap-6 mt-12 mb-32">
          <div className="w-full max-w-full lg:max-w-3xl h-[35vh] lg:h-[45vh] rounded-3xl bg-white/5 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 font-sans overflow-x-hidden selection:bg-cnpc-accent selection:text-[#0B0F19] bg-gradient-to-b from-[#0B0F19] via-[#0A192F] to-[#0B0F19]">
      
      {lightbox.isOpen && (
        <ImageLightboxModal images={lightbox.images} currentIndex={lightbox.currentIndex} onClose={closeLightbox} onPrev={prevImage} onNext={nextImage} />
      )}

      {/* 1. HERO SECTION - Locked to exactly 100svh to prevent background bleed on load */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 pt-20 pb-8">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:25px_25px] md:bg-[size:40px_40px] pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center gap-4 sm:gap-6 md:gap-8 text-center mt-auto mb-auto">
          
          <div className={`w-full flex justify-center ${fadeUp('delay-100')}`}>
            <div className="relative w-full max-w-full lg:max-w-3xl rounded-xl md:rounded-3xl overflow-hidden shadow-[0_20px_40px_-12px_rgba(0,0,0,0.7)] border border-white/10">
              <img src={heroImg} alt="Pickleball Players" className="w-full h-auto max-h-[35vh] lg:max-h-[45vh] object-cover block" />
            </div>
          </div>

          <div className={`flex flex-col items-center max-w-4xl w-full px-1 ${fadeUp('delay-300')}`}>
            
            <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md py-1 px-3 rounded-full border border-white/10 mb-2 sm:mb-4 shadow-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-cnpc-accent shrink-0" />
              <span className="text-slate-300 text-[8px] md:text-[10px] font-bold tracking-widest uppercase">Member of the Philippine Pickleball Federation</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2 sm:mb-3 uppercase leading-[1.05] text-transparent">
              <span className="bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 block mb-1">Welcome to</span>
              <span className="bg-clip-text bg-gradient-to-r from-cnpc-accent to-lime-400 drop-shadow-[0_2px_10px_rgba(196,214,0,0.15)] block">
                <span className="block">Camarines Norte</span>
                <span className="block sm:mt-1">Pickleball Club</span>
              </span>
            </h1>
            
            <p className="text-xs sm:text-sm md:text-lg text-slate-400 font-medium max-w-xs sm:max-w-xl mb-4 sm:mb-6 leading-relaxed px-1">
              Connecting players. Building champions. The official hub of Camarines Norte Pickleball.
            </p>
            
            <a 
              href="#about" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-cnpc-accent to-lime-400 text-slate-950 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-black uppercase tracking-widest hover:brightness-110 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_10px_30px_rgba(196,214,0,0.25)] text-[11px] sm:text-sm"
            >
              Explore the Hub
              <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce" />
            </a>
          </div>
        </div>
      </section>

      {/* ==============================================
          ABOUT US SECTION
          ============================================== */}
      <div id="about" className={`scroll-mt-24 py-12 md:py-24 border-t border-white/5 relative z-10 bg-[#0A192F]/50 ${fadeUp('delay-500')}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-16 items-center">
            
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-block bg-white/5 border border-white/10 text-cnpc-accent text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 md:mb-6">
                Our Story
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-3 md:mb-6">
                About The <span className="text-cnpc-accent">Club</span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm md:text-lg leading-relaxed mb-3 md:mb-6">
                Our pickleball journey began with Freemason brothers discovering the sport. We soon introduced it to our families, friends, and the community, sparking a wave of interest.
              </p>
              <p className="text-slate-400 text-xs sm:text-sm md:text-lg leading-relaxed">
                Today, we've grown to 200 members, hosted 2 local tournaments, and proudly organized the first DUPR-sanctioned match in the province with 60 participants. Promoting fun, fitness, and fellowship, on and off the court!
              </p>
            </div>

            <div className="w-full lg:w-1/2">
              {aboutImages && aboutImages.length > 0 ? (
                <div 
                  className="relative w-full h-[220px] sm:h-[300px] md:h-[400px] rounded-xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0B0F19] group cursor-pointer"
                  onClick={() => openLightbox(aboutImages.map(img => img.image), currentAboutIndex)}
                >
                  {aboutImages.map((imgObj, idx) => (
                    <div 
                      key={imgObj._id || idx}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentAboutIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                      <img 
                        src={imgObj.image} 
                        alt={`Club moment ${idx + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-transparent"></div>
                    </div>
                  ))}
                  
                  <div className="absolute top-4 right-4 z-30 bg-black/50 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-lg border border-white/10 hidden md:block">
                    <Maximize2 className="w-5 h-5" />
                  </div>

                  <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5">
                    {aboutImages.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation(); 
                          setCurrentAboutIndex(idx);
                        }}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentAboutIndex ? 'bg-cnpc-accent w-4' : 'bg-white/50 hover:bg-white'}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                 <div className="w-full h-[200px] sm:h-[260px] rounded-xl md:rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-500 flex-col gap-3 shadow-inner">
                   <ImageIcon className="w-8 h-8 opacity-50" />
                   <p className="text-[10px] font-bold uppercase tracking-widest text-center px-4">More photos coming soon</p>
                 </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ==============================================
          MEMBERSHIP REGISTRATION
          ============================================== */}
      <section id="membership" className="py-12 md:py-24 px-4 sm:px-6 md:px-12 relative z-10 bg-[#0B0F19] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          
          <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
            
            {/* Left Panel: Pricing Card */}
            <div className="lg:w-2/5 p-6 sm:p-10 md:p-14 bg-gradient-to-b from-[#112A58]/80 to-[#0A192F]/80 flex flex-col justify-center relative overflow-hidden text-center lg:text-left">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cnpc-accent/10 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="relative z-10">
                <div className="inline-block bg-cnpc-accent/10 text-cnpc-accent text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 md:mb-6 border border-cnpc-accent/20">
                  Join The Community
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-2 md:mb-4">
                  Official <br className="hidden lg:block"/> Membership
                </h2>
                <div className="flex items-baseline justify-center lg:justify-start gap-1.5 mb-3 md:mb-4">
                  <span className="text-4xl sm:text-5xl md:text-7xl font-black text-cnpc-accent">₱350</span>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] md:text-sm">/ Year</span>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed mb-6 md:mb-10 max-w-sm mx-auto lg:mx-0">
                  Become an official member of the Camarines Norte Pickleball Club today. Your membership is valid for one full year from the date of approval.
                </p>
                <a 
                  href="https://docs.google.com/forms/d/e/1FAIpQLScjfd4snulmyKM8lymDsETE3bM6-lDTYeuWqcdJG7-sK_TzAw/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cnpc-accent to-lime-400 text-slate-950 px-6 py-3 md:px-8 md:py-4 rounded-xl font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(196,214,0,0.3)] text-xs md:text-sm"
                >
                  Register Now <ExternalLink className="w-3.5 h-3.5 md:w-5 md:h-5" />
                </a>
              </div>
            </div>

            {/* Right Panel: Perks & Benefits Checkmarks */}
            <div className="lg:w-3/5 p-6 sm:p-10 md:p-14 bg-white/[0.02]">
              <h3 className="text-lg md:text-2xl font-black text-white uppercase tracking-wide mb-5 md:mb-8 flex items-center gap-2.5 justify-center lg:justify-start">
                <Award className="w-5 h-5 md:w-7 md:h-7 text-cnpc-accent" />
                Exclusive Member Perks
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8">
                
                <div className="flex items-start gap-3">
                  <div className="bg-cnpc-accent/10 p-2 rounded-lg shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-cnpc-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm md:text-base mb-0.5">Sunday DUPR Games</h4>
                    <p className="text-[11px] md:text-sm text-slate-400 leading-relaxed">Exclusive access to club-organized sanctioned matches to build your global rating.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-cnpc-accent/10 p-2 rounded-lg shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-cnpc-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm md:text-base mb-0.5">Discounted Clinics</h4>
                    <p className="text-[11px] md:text-sm text-slate-400 leading-relaxed">Special member rates for training and coaching sessions with official instructors.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-cnpc-accent/10 p-2 rounded-lg shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-cnpc-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm md:text-base mb-0.5">Organized Open Plays</h4>
                    <p className="text-[11px] md:text-sm text-slate-400 leading-relaxed">Priority access to reserved court times and open play schedules.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-cnpc-accent/10 p-2 rounded-lg shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-cnpc-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm md:text-base mb-0.5">Partner Deals & Gear</h4>
                    <p className="text-[11px] md:text-sm text-slate-400 leading-relaxed">Discounted club balls and exclusive offers from our partnered businesses.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-cnpc-accent/10 p-2 rounded-lg shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-cnpc-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm md:text-base mb-0.5">Members Tournaments</h4>
                    <p className="text-[11px] md:text-sm text-slate-400 leading-relaxed">Participate in beginner and intermediate club-only competitive events.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-cnpc-accent/10 p-2 rounded-lg shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-cnpc-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm md:text-base mb-0.5">Digital Club QR ID</h4>
                    <p className="text-[11px] md:text-sm text-slate-400 leading-relaxed">Receive your official digital ID card for fast event check-ins and profiling.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ALL HUB FEATURES IN EXACT ORDER */}
      <section id="features" className="py-12 md:py-20 px-4 sm:px-6 md:px-12 text-white relative border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">Hub Features</h2>
            <div className="w-14 md:w-20 h-1 bg-gradient-to-r from-cnpc-accent to-lime-400 mx-auto rounded-full"></div>
          </div>

          {/* 6 Grid Items in precise order: Events, Courts, Coaches, Roster, DUPR, Market */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            
            <Link to="/events" className="group bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-md p-5 md:p-8 rounded-xl md:rounded-2xl border border-white/[0.05] hover:border-cnpc-accent/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 md:w-14 md:h-14 bg-cnpc-accent/10 rounded-lg md:rounded-xl flex items-center justify-center text-cnpc-accent mb-4 md:mb-6 group-hover:bg-cnpc-accent group-hover:text-slate-950 transition-all duration-300 shadow-inner">
                  <Calendar className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <h3 className="text-lg md:text-2xl font-bold mb-1.5 md:mb-3 text-white tracking-wide">Upcoming Events</h3>
                <p className="text-slate-400 leading-relaxed mb-5 text-xs md:text-base">Stay updated with the latest news, announcements, and match results.</p>
              </div>
              <div className="text-cnpc-accent font-bold group-hover:text-white uppercase text-[10px] md:text-sm tracking-wider flex items-center gap-1.5 transition-colors duration-300 mt-auto pt-3 border-t border-white/[0.03] w-max">View Events →</div>
            </Link>

            <Link to="/courts" className="group bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-md p-5 md:p-8 rounded-xl md:rounded-2xl border border-white/[0.05] hover:border-cnpc-accent/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 md:w-14 md:h-14 bg-cnpc-accent/10 rounded-lg md:rounded-xl flex items-center justify-center text-cnpc-accent mb-4 md:mb-6 group-hover:bg-cnpc-accent group-hover:text-slate-950 transition-all duration-300 shadow-inner">
                  <MapPin className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <h3 className="text-lg md:text-2xl font-bold mb-1.5 md:mb-3 text-white tracking-wide">Local Courts</h3>
                <p className="text-slate-400 leading-relaxed mb-5 text-xs md:text-base">Find the best places to rally, drill, and compete across Camarines Norte.</p>
              </div>
              <div className="text-cnpc-accent font-bold group-hover:text-white uppercase text-[10px] md:text-sm tracking-wider flex items-center gap-1.5 transition-colors duration-300 mt-auto pt-3 border-t border-white/[0.03] w-max">Find Courts →</div>
            </Link>

            <Link to="/coaches" className="group bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-md p-5 md:p-8 rounded-xl md:rounded-2xl border border-white/[0.05] hover:border-cnpc-accent/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 md:w-14 md:h-14 bg-cnpc-accent/10 rounded-lg md:rounded-xl flex items-center justify-center text-cnpc-accent mb-4 md:mb-6 group-hover:bg-cnpc-accent group-hover:text-slate-950 transition-all duration-300 shadow-inner">
                  <Award className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <h3 className="text-lg md:text-2xl font-bold mb-1.5 md:mb-3 text-white tracking-wide">Pro Coaches</h3>
                <p className="text-slate-400 leading-relaxed mb-5 text-xs md:text-base">Elevate your game with guidance from our recognized local community coaches.</p>
              </div>
              <div className="text-cnpc-accent font-bold group-hover:text-white uppercase text-[10px] md:text-sm tracking-wider flex items-center gap-1.5 transition-colors duration-300 mt-auto pt-3 border-t border-white/[0.03] w-max">Meet Coaches →</div>
            </Link>

            <Link to="/members" className="group bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-md p-5 md:p-8 rounded-xl md:rounded-2xl border border-white/[0.05] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/5 rounded-lg md:rounded-xl flex items-center justify-center text-white mb-4 md:mb-6 group-hover:bg-white group-hover:text-slate-950 transition-all duration-300 shadow-inner">
                  <Users className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <h3 className="text-lg md:text-2xl font-bold mb-1.5 md:mb-3 text-white tracking-wide">Club Roster</h3>
                <p className="text-slate-400 leading-relaxed mb-5 text-xs md:text-base">View our complete list of verified players, connect with the community, and find match partners.</p>
              </div>
              <div className="text-white font-bold group-hover:text-slate-300 uppercase text-[10px] md:text-sm tracking-wider flex items-center gap-1.5 transition-colors duration-300 mt-auto pt-3 border-t border-white/[0.03] w-max">View Roster →</div>
            </Link>

            <Link to="/dupr" className="group bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-md p-5 md:p-8 rounded-xl md:rounded-2xl border border-white/[0.05] hover:border-cnpc-gold/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 md:w-14 md:h-14 bg-cnpc-gold/10 rounded-lg md:rounded-xl flex items-center justify-center text-cnpc-gold mb-4 md:mb-6 group-hover:bg-cnpc-gold group-hover:text-slate-950 transition-all duration-300 shadow-inner">
                  <Trophy className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <h3 className="text-lg md:text-2xl font-bold mb-1.5 md:mb-3 text-white tracking-wide">DUPR Standings</h3>
                <p className="text-slate-400 leading-relaxed mb-5 text-xs md:text-base">Check out the top players of the club and see who dominates the local community standings.</p>
              </div>
              <div className="text-cnpc-gold font-bold group-hover:text-white uppercase text-[10px] md:text-sm tracking-wider flex items-center gap-1.5 transition-colors duration-300 mt-auto pt-3 border-t border-white/[0.03] w-max">View Standings →</div>
            </Link>

            <Link to="/marketplace" className="group bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-md p-5 md:p-8 rounded-xl md:rounded-2xl border border-white/[0.05] hover:border-cnpc-accent/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 md:w-14 md:h-14 bg-cnpc-accent/10 rounded-lg md:rounded-xl flex items-center justify-center text-cnpc-accent mb-4 md:mb-6 group-hover:bg-cnpc-accent group-hover:text-slate-950 transition-all duration-300 shadow-inner">
                  <ShoppingBag className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <h3 className="text-lg md:text-2xl font-bold mb-1.5 md:mb-3 text-white tracking-wide">Marketplace</h3>
                <p className="text-slate-400 leading-relaxed mb-5 text-xs md:text-base">Gear up with custom apparel, professional paddles, and premium club merchandise.</p>
              </div>
              <div className="text-cnpc-accent font-bold group-hover:text-white uppercase text-[10px] md:text-sm tracking-wider flex items-center gap-1.5 transition-colors duration-300 mt-auto pt-3 border-t border-white/[0.03] w-max">Enter Shop →</div>
            </Link>

          </div>
        </div>
      </section>

      {/* 3. LIVE CAROUSELS SECTION (Courts & Coaches) */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 bg-white/5 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto space-y-12 md:space-y-20">
          
          {/* COURTS CAROUSEL */}
          {courts && courts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4 md:mb-8">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 md:w-6 md:h-6 text-cnpc-accent" />
                  <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-white uppercase tracking-wider">Where To Play</h2>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={prevCourtSlide} className="p-1 md:p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10"><ChevronLeft className="w-4 h-4 md:w-5 md:h-5"/></button>
                  <button onClick={nextCourtSlide} className="p-1 md:p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10"><ChevronRight className="w-4 h-4 md:w-5 md:h-5"/></button>
                </div>
              </div>

              <div 
                id="courts-slider" 
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-3 group px-0.5"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {courts.map((court) => (
                  <Link to="/courts" key={court._id} className="min-w-[260px] sm:min-w-[320px] md:min-w-[350px] snap-center bg-[#0B0F19] border border-white/10 rounded-xl md:rounded-3xl overflow-hidden hover:border-cnpc-accent/40 transition-all hover:shadow-xl group/card">
                    <div className="h-36 md:h-48 relative overflow-hidden bg-[#0A192F]">
                      {court.images && court.images.length > 0 ? (
                        <img src={court.images[0]} alt={court.name} className="w-full h-full object-cover group-hover/card:scale-105 transition-all duration-700 opacity-80 group-hover/card:opacity-100" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500 text-xs">No Image</div>
                      )}
                      <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 bg-cnpc-accent text-slate-950 text-[8px] md:text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-md">
                        {court.area}
                      </div>
                    </div>
                    <div className="p-3.5 md:p-5">
                      <h3 className="text-base md:text-xl font-bold mb-1 text-white line-clamp-1">{court.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs md:text-sm text-slate-400"><MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500" /> <span className="line-clamp-1">{court.address}</span></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* COACHES CAROUSEL */}
          {coaches && coaches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4 md:mb-8">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 md:w-6 md:h-6 text-cnpc-accent" />
                  <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-white uppercase tracking-wider">Meet the Coaches</h2>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={prevCoachSlide} className="p-1 md:p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10"><ChevronLeft className="w-4 h-4 md:w-5 md:h-5"/></button>
                  <button onClick={nextCoachSlide} className="p-1 md:p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10"><ChevronRight className="w-4 h-4 md:w-5 md:h-5"/></button>
                </div>
              </div>

              <div 
                id="coaches-slider" 
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-3 group px-0.5"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {coaches.map((coach) => (
                  <Link to="/coaches" key={coach._id} className="min-w-[260px] sm:min-w-[320px] md:min-w-[350px] snap-center bg-[#0B0F19] border border-white/10 rounded-xl md:rounded-3xl p-4 md:p-6 hover:border-cnpc-accent/40 transition-all hover:shadow-xl flex items-center gap-3.5 md:gap-5">
                    <div className="w-14 h-14 md:w-20 md:h-20 shrink-0 rounded-full overflow-hidden border-2 border-white/10 bg-[#0A192F]">
                      <img src={coach.image} alt={coach.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0"> 
                      <div className="flex items-center gap-0.5 text-[8px] md:text-[10px] font-bold text-cnpc-accent uppercase tracking-widest mb-0.5"><Star className="w-2.5 h-2.5 fill-cnpc-accent"/> Official</div>
                      <h3 className="text-sm md:text-lg font-black text-white uppercase tracking-wide leading-tight mb-0.5 truncate">{coach.name}</h3>
                      <p className="text-[11px] md:text-sm text-slate-400 line-clamp-2 italic pr-1">"{coach.tagline}"</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 4. COMMUNITY POSTS SECTION */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 relative bg-[#0B0F19] border-t border-white/5 overflow-hidden">
        
        {/* Clean CNPC accent glow */}
        <div className="absolute top-1/4 right-0 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-cnpc-accent/5 blur-[100px] md:blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-2xl mx-auto relative z-10 w-full">
          
          <div className="flex items-center gap-2 pb-3 border-b border-white/10 mb-5 md:mb-8">
            <Megaphone className="w-5 h-5 md:w-8 md:h-8 text-cnpc-accent" />
            <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-wider">Latest Update</h2>
          </div>
          
          {posts && posts.length === 0 ? (
            <div className="bg-[#111827] border border-white/10 rounded-xl md:rounded-2xl p-8 md:p-12 text-center shadow-xl">
              <p className="text-slate-400 italic font-medium text-xs md:text-base">No recent community posts at the moment.</p>
            </div>
          ) : (
            posts.slice(0, 1).map((post) => (
              <div key={post._id} className="bg-[#111827] border border-white/10 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl w-full hover:border-white/20 transition-all">
                
                {/* POST HEADER */}
                <div className="p-4 md:p-5 pb-2 md:pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-cnpc-accent to-lime-400 flex items-center justify-center text-slate-900 font-bold shrink-0 shadow-md">
                        <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-bold text-white text-xs md:text-base leading-tight flex items-center gap-1 md:gap-2">
                          CNPC Admin {post.isPinned && <Pin className="w-3 h-3 text-cnpc-accent" />}
                        </h4>
                        <span className="text-[9px] md:text-xs text-slate-400">{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* POST CONTENT */}
                  <h5 className="font-black text-sm md:text-lg uppercase tracking-wide mb-1.5">{post.title}</h5>
                  
                  <SmartLinkifier text={post.content} isExpanded={isPostExpanded} />
                  
                  {post.content && post.content.length > 200 && (
                    <button 
                      onClick={() => setIsPostExpanded(!isPostExpanded)} 
                      className="text-cnpc-accent text-[11px] md:text-sm font-bold hover:underline mb-1 transition-all"
                    >
                      {isPostExpanded ? 'See less' : '... See more'}
                    </button>
                  )}
                </div>
                
                {/* POST IMAGES */}
                {post.images && post.images.length > 0 && (
                  <div className={`grid gap-0.5 bg-[#0B0F19] ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
                    {post.images.map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt="Post attachment" 
                        onClick={() => openLightbox(post.images, i)} 
                        className={`w-full object-cover cursor-pointer hover:opacity-90 transition-opacity ${post.images.length === 1 ? 'max-h-[260px] md:max-h-[500px]' : 'h-24 sm:h-40 md:h-56'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
          
          {posts && posts.length > 0 && (
            <div className="mt-6 md:mt-8 text-center">
              <Link to="/events" className="inline-block bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-full font-bold text-[11px] md:text-sm uppercase tracking-widest transition-all shadow-lg">
                View All Posts →
              </Link>
            </div>
          )}
        </div>
      </section>
      
    </div>
  );
};

export default Home;