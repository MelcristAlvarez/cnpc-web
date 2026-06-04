import { useState, useEffect } from 'react';
import { Users, ShieldCheck, Loader2, MapPin, Search, ExternalLink, Star, Target, UserCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All'); 
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/members`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setMembers(data);
          } else {
            setMembers([]);
          }
        }
      } catch (error) { 
        console.error("Failed to fetch members:", error); 
      } 
      finally { setIsLoading(false); }
    };
    fetchMembers();
  }, []);

  const getLastName = (fullName) => {
    if (!fullName || typeof fullName !== 'string') return '';
    const parts = fullName.trim().split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return '';
    return parts[parts.length - 1].toLowerCase();
  };

  const processedMembers = members
    .filter(m => filter === 'All' ? true : m.gender === filter)
    .filter(m => (m?.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => getLastName(a?.name).localeCompare(getLastName(b?.name)));

  // Role Filtering
  const directors = processedMembers.filter(m => m.role === 'Director');
  const organizers = processedMembers.filter(m => m.role === 'Organizer');
  const regularMembers = processedMembers.filter(m => m.role === 'Member' || !m.role);
  
  // Total Count including all roles
  const totalCount = processedMembers.length;

  const MemberCard = ({ member }) => {
    const isLeadership = member.role === 'Director' || member.role === 'Organizer';
    
    return (
      <div className={`bg-[#111827] border rounded-3xl p-5 flex items-center gap-4 md:gap-5 transition-all hover:-translate-y-1 hover:shadow-2xl ${isLeadership ? 'border-cnpc-accent/50 shadow-[0_0_15px_rgba(196,214,0,0.1)]' : 'border-white/10 hover:border-white/20'}`}>
        
        {/* Replaced Initials with a generic Profile Placeholder */}
        <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${isLeadership ? 'bg-cnpc-accent/20 border border-cnpc-accent/50 text-cnpc-accent' : 'bg-white/5 text-slate-400 border border-white/10'}`}>
          <UserCircle className="w-8 h-8 opacity-80" />
        </div>

        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-bold text-white text-base md:text-lg leading-tight uppercase tracking-wide">{member?.name || 'Unknown Player'}</h3>
            {isLeadership && <span className="bg-cnpc-accent text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-sm">{member.role}</span>}
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 opacity-70" /> {member?.location || 'Unknown'}</span>
            <span className="opacity-50">•</span>
            <span className={member?.gender === 'F' ? 'text-pink-400' : 'text-blue-400'}>{member?.gender === 'F' ? "Women's" : "Men's"}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans pt-36 pb-20 relative overflow-hidden">
      
      <div className="max-w-5xl mx-auto relative z-10 px-4 sm:px-6 lg:px-12 mb-20">
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-block bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 md:mb-6">
            Official Community
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-3 md:mb-4">
            Club <span className="text-cnpc-accent">Roster</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto">
            The official member directory for the Camarines Norte Pickleball Club.
          </p>
        </div>

        {/* SEARCH & FILTERS (Stacked and Gridded on mobile so nothing hides!) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 md:mb-12 w-full">
          
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 md:h-5 md:w-5 text-slate-500" />
            </div>
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full bg-[#111827] border border-white/10 text-white rounded-full pl-10 md:pl-12 pr-4 py-3 md:py-3.5 text-sm md:text-base focus:outline-none focus:border-cnpc-accent transition-colors shadow-lg placeholder:text-slate-500" 
            />
          </div>
          
          {/* Changed to an instantly visible Grid structure on mobile */}
          <div className="grid grid-cols-3 md:flex gap-2 md:gap-3 w-full md:w-auto shrink-0">
            {['All', 'M', 'F'].map(cat => (
              <button 
                key={cat} 
                onClick={() => setFilter(cat)} 
                className={`w-full px-2 md:px-6 py-2.5 md:py-3.5 rounded-full font-bold text-[10px] md:text-sm tracking-widest uppercase transition-all text-center ${filter === cat ? 'bg-cnpc-accent text-slate-950 shadow-[0_0_15px_rgba(196,214,0,0.3)]' : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'}`}
              >
                {cat === 'All' ? 'All' : cat === 'M' ? "Men" : "Women"}
              </button>
            ))}
          </div>
        </div>

        {/* REGISTRATION BANNER */}
        <div className="mb-12 md:mb-16 bg-gradient-to-r from-cnpc-accent/10 to-transparent border border-cnpc-accent/20 rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6 shadow-lg">
          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-wide mb-1 md:mb-2">Want to be a member?</h3>
            <p className="text-xs md:text-sm text-slate-400">Join the Camarines Norte Pickleball Club today to access exclusive perks, tournaments, and events!</p>
          </div>
          <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLScjfd4snulmyKM8lymDsETE3bM6-lDTYeuWqcdJG7-sK_TzAw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-full md:w-auto flex justify-center items-center gap-2 bg-cnpc-accent text-slate-950 px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_15px_rgba(196,214,0,0.2)] text-xs md:text-sm"
          >
            Register Here <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </a>
        </div>

        {/* ROSTER LISTS */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 text-cnpc-accent animate-spin" /></div>
        ) : (
          <>
            {/* Total Count Badge placed above lists */}
            <div className="text-center md:text-left mb-6">
              <span className="bg-white/5 border border-white/10 text-slate-300 text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest inline-block shadow-sm">
                Total Roster: {totalCount} Players
              </span>
            </div>

            {/* DIRECTORS SECTION */}
            {directors.length > 0 && (
              <div className="mb-12 md:mb-16">
                <div className="flex items-center justify-center md:justify-start gap-2.5 mb-6 border-b border-white/10 pb-4">
                  <Star className="w-5 h-5 md:w-6 md:h-6 text-cnpc-accent" />
                  <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-wide">Board of Directors</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {directors.map(member => <MemberCard key={member._id} member={member} />)}
                </div>
              </div>
            )}

            {/* ORGANIZERS SECTION */}
            {organizers.length > 0 && (
              <div className="mb-12 md:mb-16">
                <div className="flex items-center justify-center md:justify-start gap-2.5 mb-6 border-b border-white/10 pb-4">
                  <Target className="w-5 h-5 md:w-6 md:h-6 text-cnpc-accent" />
                  <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-wide">Club Organizers</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {organizers.map(member => <MemberCard key={member._id} member={member} />)}
                </div>
              </div>
            )}

            {/* REGULAR MEMBERS SECTION */}
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2.5 mb-6 border-b border-white/10 pb-4">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
                <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-wide">Registered Members</h2>
              </div>
              
              {regularMembers.length === 0 ? (
                <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-sm">{searchQuery ? `No members found matching "${searchQuery}"` : 'No members found in this category.'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {regularMembers.map(member => <MemberCard key={member._id} member={member} />)}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Members;