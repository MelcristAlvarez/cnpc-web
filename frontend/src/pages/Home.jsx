import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { ArrowDown, ShoppingBag, Trophy, Users, ShieldCheck, MapPin, Megaphone, Info, X, ChevronLeft, ChevronRight, Target, Award, Star, Maximize2, Image as ImageIcon, Dumbbell, QrCode, Handshake, ExternalLink, MessageSquare, Activity, Pin, Calendar } from 'lucide-react';
import heroImg from '../assets/images/hero.jpg'; 

// =========================================
// HELPER COMPONENT: SmartLinkifier
// =========================================
const SmartLinkifier = ({ text, isExpanded }) => {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  if (!text || typeof text !== 'string') return null;
  const parts = text.split(urlRegex);

  return (
    <div className={`text-slate-200 leading-relaxed whitespace-pre-wrap mb-2 ${isExpanded ? '' : 'line-clamp-4'}`}>
      {parts.map((part, index) => {
        if (part.match(urlRegex)) {
          const href = part.startsWith('www.') ? `https://${part}` : part;
          return (
            <a key={index} href={href} target="_blank" rel="noopener noreferrer" className="text-cnpc-accent hover:text-lime-400 font-bold underline transition-colors">
              {part}
            </a>
          );
        }
        return part;
      })}
    </div>
  );
};

// =========================================
// COMPONENT: ImageLightboxModal
// =========================================
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-12 animate-in fade-in duration-300">
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/60 to-transparent">
        <div className="text-white font-medium">Photo {currentIndex + 1} of {images.length}</div>
        <button onClick={onClose} className="p-2 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/80 transition-all">
          <X className="w-7 h-7" />
        </button>
      </div>
      <div className="relative max-w-full max-h-full flex items-center justify-center p-4 md:p-0" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <img src={images[currentIndex]} alt={`Full screen view ${currentIndex + 1}`} className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl animate-in zoom-in-75 duration-300" />
      </div>
      {images.length > 1 && (
        <>
          <button onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white/60 hover:text-white hover:bg-black/90 transition-all z-20"><ChevronLeft className="w-8 h-8" /></button>
          <button onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white/60 hover:text-white hover:bg-black/90 transition-all z-20"><ChevronRight className="w-8 h-8" /></button>
        </>
      )}
    </div>
  );
};

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // LIVE DATABASE STATE
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
          fetch('http://localhost:5000/api/posts'),
          fetch('http://localhost:5000/api/courts/approved'),
          fetch('http://localhost:5000/api/coaches/approved'),
          fetch('http://localhost:5000/api/about-images')
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

  // AUTO-SLIDER LOGIC FOR ABOUT SECTION
  useEffect(() => {
    if (aboutImages && aboutImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentAboutIndex((prev) => (prev + 1) % aboutImages.length);
      }, 4000); 
      return () => clearInterval(timer);
    }
  }, [aboutImages]);

  // FORMATTING HELPERS
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // LIGHTBOX HANDLERS
  const openLightbox = (postImages, clickedIndex) => {
    if (!postImages || postImages.length === 0) return;
    setLightbox({ isOpen: true, images: postImages, currentIndex: clickedIndex });
  };
  const closeLightbox = () => setLightbox({ isOpen: false, images: [], currentIndex: 0 });
  const nextImage = () => setLightbox(prev => ({ ...prev, currentIndex: (prev.currentIndex + 1) % prev.images.length }));
  const prevImage = () => setLightbox(prev => ({ ...prev, currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length }));

  const fadeUp = (delayClass) => `transition-all duration-1000 ease-out transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${delayClass}`;

  // CAROUSEL LOGIC HELPERS
  const nextCourtSlide = () => { const slider = document.getElementById('courts-slider'); if (slider) slider.scrollBy({ left: 320, behavior: 'smooth' }); };
  const prevCourtSlide = () => { const slider = document.getElementById('courts-slider'); if (slider) slider.scrollBy({ left: -320, behavior: 'smooth' }); };
  const nextCoachSlide = () => { const slider = document.getElementById('coaches-slider'); if (slider) slider.scrollBy({ left: 320, behavior: 'smooth' }); };
  const prevCoachSlide = () => { const slider = document.getElementById('coaches-slider'); if (slider) slider.scrollBy({ left: -320, behavior: 'smooth' }); };

  useEffect(() => {
    if (courts && courts.length > 0) {
      const courtInterval = setInterval(() => {
        const slider = document.getElementById('courts-slider');
        if (slider) {
          if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) { slider.scrollTo({ left: 0, behavior: 'smooth' }); } 
          else { slider.scrollBy({ left: 320, behavior: 'smooth' }); }
        }
      }, 5000);
      return () => clearInterval(courtInterval);
    }
  }, [courts]);

  useEffect(() => {
    if (coaches && coaches.length > 0) {
      const coachInterval = setInterval(() => {
        const slider = document.getElementById('coaches-slider');
        if (slider) {
          if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) { slider.scrollTo({ left: 0, behavior: 'smooth' }); } 
          else { slider.scrollBy({ left: 320, behavior: 'smooth' }); }
        }
      }, 4000); 
      return () => clearInterval(coachInterval);
    }
  }, [coaches]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] via-[#0A192F] to-[#0B0F19] pt-20 px-4 lg:px-12 overflow-hidden pointer-events-none">
        <div className="max-w-5xl mx-auto w-full flex flex-col items-center gap-6 mt-12 mb-32">
          <div className="w-full max-w-xl lg:max-w-3xl h-[35vh] lg:h-[45vh] rounded-3xl bg-white/5 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 font-sans overflow-x-hidden selection:bg-cnpc-accent selection:text-[#0B0F19] bg-gradient-to-b from-[#0B0F19] via-[#0A192F] to-[#0B0F19]">
      
      {lightbox.isOpen && (
        <ImageLightboxModal images={lightbox.images} currentIndex={lightbox.currentIndex} onClose={closeLightbox} onPrev={prevImage} onNext={nextImage} />
      )}

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-4 lg:px-12 pt-20 pb-8">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center gap-6 mt-2 text-center">
          <div className={`w-full flex justify-center ${fadeUp('delay-100')}`}>
            <div className="relative max-w-xl lg:max-w-3xl w-full rounded-3xl overflow-hidden shadow-[0_20px_40px_-12px_rgba(0,0,0,0.7)] border border-white/10">
              <img src={heroImg} alt="Pickleball Players" className="w-full h-auto max-h-[35vh] lg:max-h-[45vh] object-cover block" />
            </div>
          </div>

          <div className={`flex flex-col items-center max-w-4xl w-full px-2 ${fadeUp('delay-300')}`}>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md py-1.5 px-4 rounded-full border border-white/10 mb-4 shadow-lg">
              <ShieldCheck className="w-4 h-4 text-cnpc-accent" />
              <span className="text-slate-300 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase">Member of the Philippine Pickleball Federation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 uppercase leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400">
              Welcome to <br/> 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cnpc-accent to-lime-400 drop-shadow-[0_2px_10px_rgba(196,214,0,0.15)] block mt-1">Camarines Norte Pickleball Club</span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 font-medium max-w-xl mb-6 leading-relaxed balance">
              Connecting players. Building champions. The official hub of Camarines Norte Pickleball.
            </p>
            <a 
              href="#about" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-cnpc-accent to-lime-400 text-slate-950 px-8 py-3 rounded-full font-black uppercase tracking-widest hover:brightness-110 hover:-translate-y-1 transition-all duration-200 shadow-[0_10px_30px_rgba(196,214,0,0.25)] text-sm"
            >
              Explore the Hub
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </a>
          </div>
        </div>
      </section>

      {/* ==============================================
          ABOUT US SECTION
          ============================================== */}
      <div id="about" className={`scroll-mt-32 py-24 border-t border-white/5 relative z-10 bg-[#0A192F]/50 ${fadeUp('delay-500')}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-block bg-white/5 border border-white/10 text-cnpc-accent text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                Our Story
              </div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
                About The <span className="text-cnpc-accent">Club</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                Our pickleball journey began with Freemason brothers discovering the sport. We soon introduced it to our families, friends, and the community—sparking a wave of interest.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed">
                Today, we've grown to 200 members, hosted 2 local tournaments, and proudly organized the first DUPR-sanctioned match in the province with 60 participants. Promoting fun, fitness, and fellowship—on and off the court!
              </p>
            </div>

            <div className="lg:w-1/2 w-full">
              {aboutImages && aboutImages.length > 0 ? (
                <div 
                  className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0B0F19] group cursor-pointer"
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
                  
                  <div className="absolute top-4 right-4 z-30 bg-black/50 backdrop-blur-md text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-lg border border-white/10">
                    <Maximize2 className="w-5 h-5" />
                  </div>

                  <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
                    {aboutImages.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation(); 
                          setCurrentAboutIndex(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentAboutIndex ? 'bg-cnpc-accent w-6' : 'bg-white/50 hover:bg-white'}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                 <div className="w-full h-[300px] rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-500 flex-col gap-4 shadow-inner">
                   <ImageIcon className="w-12 h-12 opacity-50" />
                   <p className="text-sm font-bold uppercase tracking-widest">More photos coming soon</p>
                 </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* 2. FEATURES SECTION */}
      <section id="features" className="py-20 px-6 md:px-12 text-white relative border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">Club Features</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cnpc-accent to-lime-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-md p-8 rounded-2xl border border-white/[0.05] hover:border-cnpc-accent/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-14 h-14 bg-cnpc-accent/10 rounded-xl flex items-center justify-center text-cnpc-accent mb-6 group-hover:bg-cnpc-accent group-hover:text-slate-950 transition-all duration-300 shadow-inner">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white tracking-wide">Marketplace</h3>
                <p className="text-slate-400 leading-relaxed mb-6 text-sm md:text-base">Gear up with custom apparel, professional paddles, and premium club merchandise.</p>
              </div>
              <Link to="/marketplace" className="text-cnpc-accent font-bold group-hover:text-white uppercase text-sm tracking-wider flex items-center gap-2 transition-colors duration-300 mt-auto pt-4 border-t border-white/[0.03] w-max">Enter Shop →</Link>
            </div>

            <div className="group bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-md p-8 rounded-2xl border border-white/[0.05] hover:border-cnpc-gold/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-14 h-14 bg-cnpc-gold/10 rounded-xl flex items-center justify-center text-cnpc-gold mb-6 group-hover:bg-cnpc-gold group-hover:text-slate-950 transition-all duration-300 shadow-inner">
                  <Trophy className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white tracking-wide">DUPR Standings</h3>
                <p className="text-slate-400 leading-relaxed mb-6 text-sm md:text-base">Check out the top players of the club and see who dominates the local community standings.</p>
              </div>
              <Link to="/dupr" className="text-cnpc-gold font-bold group-hover:text-white uppercase text-sm tracking-wider flex items-center gap-2 transition-colors duration-300 mt-auto pt-4 border-t border-white/[0.03] w-max">View Standings →</Link>
            </div>

            <div className="group bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-md p-8 rounded-2xl border border-white/[0.05] hover:border-white/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-white mb-6 group-hover:bg-white group-hover:text-slate-950 transition-all duration-300 shadow-inner">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white tracking-wide">Club Directory</h3>
                <p className="text-slate-400 leading-relaxed mb-6 text-sm md:text-base">View our complete list of verified players, connect with the community, and find match partners.</p>
              </div>
              <Link to="/members" className="text-white font-bold group-hover:text-slate-300 uppercase text-sm tracking-wider flex items-center gap-2 transition-colors duration-300 mt-auto pt-4 border-t border-white/[0.03] w-max">View Roster →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LIVE CAROUSELS SECTION (Courts & Coaches) */}
      <section className="py-20 px-6 md:px-12 bg-white/5 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto space-y-20">
          
          {/* COURTS CAROUSEL */}
          {courts && courts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-cnpc-accent" />
                  <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider">Where To Play</h2>
                </div>
                <div className="flex gap-2">
                  <button onClick={prevCourtSlide} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10"><ChevronLeft className="w-5 h-5"/></button>
                  <button onClick={nextCourtSlide} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10"><ChevronRight className="w-5 h-5"/></button>
                </div>
              </div>

              <div 
                id="courts-slider" 
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 group"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {courts.map((court) => (
                  <Link to="/courts" key={court._id} className="min-w-[300px] md:min-w-[350px] snap-center bg-[#0B0F19] border border-white/10 rounded-3xl overflow-hidden hover:border-cnpc-accent/40 transition-all hover:-translate-y-2 shadow-xl group/card">
                    <div className="h-48 relative overflow-hidden bg-[#0A192F]">
                      {/* SAFELY CHECK FOR COURT IMAGES */}
                      {court.images && court.images.length > 0 ? (
                        <img src={court.images[0]} alt={court.name} className="w-full h-full object-cover group-hover/card:scale-105 transition-all duration-700 opacity-80 group-hover/card:opacity-100" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500 text-xs">No Image</div>
                      )}
                      <div className="absolute bottom-3 left-3 bg-cnpc-accent text-slate-950 text-[10px] font-black uppercase px-2 py-1 rounded shadow-md">
                        {court.area}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold mb-2 text-white line-clamp-1">{court.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-400"><MapPin className="w-4 h-4 shrink-0" /> <span className="line-clamp-1">{court.address}</span></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* COACHES CAROUSEL */}
          {coaches && coaches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-cnpc-accent" />
                  <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider">Meet the Coaches</h2>
                </div>
                <div className="flex gap-2">
                  <button onClick={prevCoachSlide} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10"><ChevronLeft className="w-5 h-5"/></button>
                  <button onClick={nextCoachSlide} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10"><ChevronRight className="w-5 h-5"/></button>
                </div>
              </div>

              <div 
                id="coaches-slider" 
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 group"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {coaches.map((coach) => (
                  <Link to="/coaches" key={coach._id} className="min-w-[300px] md:min-w-[350px] snap-center bg-[#0B0F19] border border-white/10 rounded-3xl p-6 hover:border-cnpc-accent/40 transition-all hover:-translate-y-2 shadow-xl flex items-center gap-5">
                    <div className="w-20 h-20 shrink-0 rounded-full overflow-hidden border-2 border-white/10 bg-[#0A192F]">
                      <img src={coach.image} alt={coach.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-cnpc-accent uppercase tracking-widest mb-1"><Star className="w-3 h-3 fill-cnpc-accent"/> Official</div>
                      <h3 className="text-lg font-black text-white uppercase tracking-wide leading-tight mb-1">{coach.name}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2 italic">"{coach.tagline}"</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 4. COMMUNITY POSTS SECTION (Single FB-Style Card) */}
      <section className="py-20 px-6 md:px-12 relative bg-gradient-to-br from-[#0B0F19] via-[#112A58] to-[#0B0F19] border-t border-white/5 overflow-hidden">
        
        {/* Subtle cyan/blue background glow matching logo hues */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none"></div>

        {/* max-w-2xl restricts the width perfectly to resemble a social media feed card */}
        <div className="max-w-2xl mx-auto relative z-10">
          
          <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-8">
            <Megaphone className="w-8 h-8 text-cnpc-accent" />
            <h2 className="text-3xl font-black text-white uppercase tracking-wider">Latest Update</h2>
          </div>
          
          {posts && posts.length === 0 ? (
            <div className="bg-[#1A3668]/40 backdrop-blur-md border border-blue-400/20 rounded-2xl p-12 text-center shadow-2xl">
              <p className="text-slate-400 italic font-medium">No recent community posts at the moment.</p>
            </div>
          ) : (
            posts.slice(0, 1).map((post) => (
              <div key={post._id} className="bg-[#1A3668]/40 backdrop-blur-md border border-blue-400/20 rounded-2xl overflow-hidden shadow-2xl">
                
                {/* POST HEADER (FB Style: Avatar + Name + Date) */}
                <div className="p-5 pb-3">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cnpc-accent to-lime-400 flex items-center justify-center text-slate-900 font-bold shrink-0 shadow-md">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-bold text-white text-base leading-tight flex items-center gap-2">
                          CNPC Admin {post.isPinned && <Pin className="w-3 h-3 text-cnpc-accent" />}
                        </h4>
                        <span className="text-xs text-slate-400">{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* POST CONTENT (Title + Text + See More) */}
                  <h5 className="font-black text-white text-lg uppercase tracking-wide mb-2">{post.title}</h5>
                  
                  <SmartLinkifier text={post.content} isExpanded={isPostExpanded} />
                  
                  {/* Show "See More" if text is over ~200 chars */}
                  {post.content && post.content.length > 200 && (
                    <button 
                      onClick={() => setIsPostExpanded(!isPostExpanded)} 
                      className="text-cnpc-accent text-sm font-bold hover:underline mb-2 transition-all"
                    >
                      {isPostExpanded ? 'See less' : '... See more'}
                    </button>
                  )}
                </div>
                
                {/* POST IMAGES (Full Bleed - Touching the edges like social media) */}
                {post.images && post.images.length > 0 && (
                  <div className={`grid gap-0.5 bg-[#0B0F19] ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
                    {post.images.map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt="Post attachment" 
                        onClick={() => openLightbox(post.images, i)} 
                        className={`w-full object-cover cursor-pointer hover:opacity-90 transition-opacity ${post.images.length === 1 ? 'max-h-[500px]' : 'h-40 sm:h-56'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
          
          {posts && posts.length > 0 && (
            <div className="mt-8 text-center">
              <Link to="/events" className="inline-block bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/30 text-blue-300 px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all">
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