import { useState, useEffect } from 'react';
import { CheckCircle2, Star, Mail, Phone, Loader2 } from 'lucide-react';
import { FaFacebook } from 'react-icons/fa'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Coaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await fetch(`${API_URL}/api/coaches/approved`);
        if (response.ok) {
          const data = await response.json();
          setCoaches(data);
        }
      } catch (error) {
        console.error("Failed to fetch coaches:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoaches();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans pt-36 pb-20 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12">
          <div className="inline-block bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Learn Pickleball
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
            <span className="text-cnpc-accent">Coaches </span> 
            WITHIN THE COMMUNITY
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg">
            Elevate your game with guidance from our recognized local community coaches. From beginners learning the fundamentals to advanced players refining tournament strategies.
          </p>
        </div>

        {/* Coaches Grid */}
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-12 h-12 text-cnpc-accent animate-spin" />
          </div>
        ) : coaches.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
            <Star className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2">No Coaches Yet</h3>
            <p className="text-slate-400">We are currently reviewing coach applications. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {coaches.map((coach) => {
              // Safely split strings into arrays for mapping and filter out empty values
              const certsArray = coach.certs ? coach.certs.split(',').filter(c => c.trim() !== '') : [];
              const achievementsArray = coach.achievements ? coach.achievements.split(',').filter(a => a.trim() !== '') : [];

              return (
                <div key={coach._id} className="bg-[#131B2B] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col sm:flex-row group transition-all">
                  
                  {/* Left Side: Coach Image */}
                  <div className="sm:w-2/5 h-72 sm:h-auto relative overflow-hidden bg-[#0A192F] shrink-0 border-r border-white/5">
                    <img 
                      src={coach.image} 
                      alt={coach.name} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                    />
                    {/* Mobile Gradient fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131B2B] via-transparent to-transparent sm:hidden"></div>
                  </div>

                  {/* Right Side: Coach Details */}
                  <div className="p-8 sm:w-3/5 flex flex-col">
                    
                    {/* Top Badges (DUPR, PPR, etc.) */}
                    {certsArray.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {certsArray.map((cert, index) => (
                          <span key={index} className="bg-[#1A2436] border border-cnpc-accent/30 text-cnpc-accent text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                            {cert.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Name & Official Title */}
                    <h2 className="text-2xl font-black text-white uppercase tracking-wide mb-1">
                      {coach.name}
                    </h2>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                      <Star className="w-3.5 h-3.5 text-cnpc-accent" />
                      Official CNPC Coach
                    </div>

                    {/* Yellow Vertical Tagline */}
                    <div className="mb-6 border-l-2 border-cnpc-accent pl-3">
                      <p className="text-slate-300 italic text-sm">
                        "{coach.tagline}"
                      </p>
                    </div>

                    {/* Resume / Achievements List (Replaced Trophy with CheckCircle2) */}
                    {achievementsArray.length > 0 && (
                      <div className="space-y-3 mb-8">
                        {achievementsArray.map((achievement, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-cnpc-accent shrink-0 mt-0.5" />
                            <span className="text-xs text-slate-300 leading-snug">
                              {achievement.trim()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Contact Buttons */}
                    <div className="mt-auto flex gap-2 flex-wrap">
                      {coach.facebook && (
                        <a href={coach.facebook} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-[#1877F2] py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                          <FaFacebook className="w-4 h-4" /> FB
                        </a>
                      )}
                      {coach.email && (
                        <a href={`mailto:${coach.email}`} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                          <Mail className="w-4 h-4" /> Email
                        </a>
                      )}
                      {coach.phone && (
                        <a href={`tel:${coach.phone}`} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                          <Phone className="w-4 h-4" /> Phone
                        </a>
                      )}
                    </div>
                    
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Coaches;