import { useState, useEffect } from 'react';
import { Users, ShieldCheck, Loader2, MapPin, Search, ExternalLink, Star, Target } from 'lucide-react';

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

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    const parts = name.trim().split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return '?';
    return parts.length > 1 
      ? `${parts[0][0]}${parts[parts.length-1][0]}`.toUpperCase() 
      : parts[0][0].toUpperCase();
  };

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

  const MemberCard = ({ member }) => {
    const isLeadership = member.role === 'Director' || member.role === 'Organizer';
    
    return (
      <div className={`bg-[#111827] border rounded-3xl p-5 flex items-center gap-5 transition-all hover:-translate-y-1 hover:shadow-2xl ${isLeadership ? 'border-cnpc-accent/50 shadow-[0_0_15px_rgba(196,214,0,0.1)]' : 'border-white/10 hover:border-white/20'}`}>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl shrink-0 ${isLeadership ? 'bg-cnpc-accent text-slate-950' : 'bg-white/5 text-slate-300 border border-white/10'}`}>
          {getInitials(member?.name)}
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-bold text-white text-lg leading-tight uppercase tracking-wide">{member?.name || 'Unknown Player'}</h3>
            {isLeadership && <span className="bg-cnpc-accent text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-sm">{member.role}</span>}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 opacity-70" /> {member?.location || 'Unknown'}</span>
            <span className="opacity-50">•</span>
            <span className={member?.gender === 'F' ? 'text-pink-400' : 'text-blue-400'}>{member?.gender === 'F' ? "Women's" : "Men's"}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans pt-36 pb-20 relative overflow-hidden">
      
      <div className="max-w-5xl mx-auto relative z-10 px-6 lg:px-12 mb-20">
        <div className="text-center mb-12">
          <div className="inline-block bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Official Community
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
            Club <span className="text-cnpc-accent">Roster</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            The official member directory for the Camarines Norte Pickleball Club.
          </p>
        </div>

        {/* SEARCH & FILTERS (LOCKED IN A SINGLE HORIZONTAL LINE, ALLOWED TO SHRINK) */}
        <div 
          className="flex items-center justify-between gap-4 mb-12 w-full overflow-x-auto pb-4" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Search Bar - Allowed to shrink so it doesn't push buttons off-screen */}
          <div className="relative w-full min-w-[150px] max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full bg-[#111827] border border-white/10 text-white rounded-full pl-12 pr-4 py-3.5 focus:outline-none focus:border-cnpc-accent transition-colors shadow-lg placeholder:text-slate-500" 
            />
          </div>
          
          {/* Buttons (Strictly aligned on the same line, will not shrink) */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {['All', 'M', 'F'].map(cat => (
              <button 
                key={cat} 
                onClick={() => setFilter(cat)} 
                className={`px-4 md:px-6 py-3.5 rounded-full font-bold text-xs md:text-sm tracking-widest uppercase transition-all whitespace-nowrap ${filter === cat ? 'bg-cnpc-accent text-slate-950 shadow-[0_0_15px_rgba(196,214,0,0.3)]' : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'}`}
              >
                {cat === 'All' ? 'All Players' : cat === 'M' ? "Men's Roster" : "Women's Roster"}
              </button>
            ))}
          </div>
        </div>

        {/* SIMPLIFIED REGISTRATION BANNER */}
        <div className="mb-16 bg-gradient-to-r from-cnpc-accent/10 to-transparent border border-cnpc-accent/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-black text-white uppercase tracking-wide mb-2">Want to be a member?</h3>
            <p className="text-sm text-slate-400">Join the Camarines Norte Pickleball Club today to access exclusive perks, tournaments, and events!</p>
          </div>
          <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLScjfd4snulmyKM8lymDsETE3bM6-lDTYeuWqcdJG7-sK_TzAw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-cnpc-accent text-slate-950 px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_15px_rgba(196,214,0,0.2)] text-sm"
          >
            Register Here <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* ROSTER LISTS */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 text-cnpc-accent animate-spin" /></div>
        ) : (
          <>
            {/* DIRECTORS SECTION */}
            {directors.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                  <Star className="w-6 h-6 text-cnpc-accent" />
                  <h2 className="text-xl font-black text-white uppercase tracking-wide">Board of Directors</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {directors.map(member => <MemberCard key={member._id} member={member} />)}
                </div>
              </div>
            )}

            {/* ORGANIZERS SECTION */}
            {organizers.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                  <Target className="w-6 h-6 text-cnpc-accent" />
                  <h2 className="text-xl font-black text-white uppercase tracking-wide">Club Organizers</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {organizers.map(member => <MemberCard key={member._id} member={member} />)}
                </div>
              </div>
            )}

           
            {/* REGULAR MEMBERS SECTION */}
            <div>
              <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                <Users className="w-6 h-6 text-slate-400" />
                <h2 className="text-xl font-black text-white uppercase tracking-wide">Registered Members</h2>
                <span className="bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold px-3 py-1 rounded-full ml-auto uppercase tracking-widest">
                  {regularMembers.length} Players
                </span>
              </div>
              
              {regularMembers.length === 0 ? (
                <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
                  <p className="text-slate-400 font-bold uppercase tracking-wider">{searchQuery ? `No members found matching "${searchQuery}"` : 'No members found in this category.'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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