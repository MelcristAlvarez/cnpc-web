import { Trophy, ExternalLink, Activity, Users, Target } from 'lucide-react';

const Dupr = () => {
  const duprClubUrl = "https://dashboard.dupr.com/dashboard/browse/clubs/6525623784";

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans pt-36 pb-20 px-6 lg:px-12 relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cnpc-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Official CNPC Roster
          </div>
          {/* Fixed: Colored DUPR instead of Ratings */}
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-6">
            Club <span className="text-cnpc-accent">DUPR</span> Ratings
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Track player progress, view official club standings, and ensure fair match placement within the Camarines Norte Pickleball Club network.
          </p>
        </div>

        {/* Main CTA Card */}
        <div className="bg-gradient-to-br from-[#111827] to-[#0A192F] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl mb-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-black text-white uppercase tracking-wide mb-4">
              View Club Standings
            </h2>
            <p className="text-slate-400 mb-8">
              Click below to view our verified club roster on the official DUPR dashboard. Check out member skill brackets, individual player profiles, and current ratings.
            </p>
            <a 
              href={duprClubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-cnpc-accent hover:brightness-110 text-slate-950 px-8 py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(196,214,0,0.2)] hover:-translate-y-1 w-full md:w-auto"
            >
              <Trophy className="w-5 h-5" />
              View Club DUPR Roster
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>
          </div>
          
          {/* Decorative Right Side Graphic */}
          <div className="hidden md:flex w-64 h-64 bg-white/5 border border-white/10 rounded-full items-center justify-center relative shrink-0">
            <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
            <Trophy className="w-24 h-24 text-cnpc-accent drop-shadow-[0_0_15px_rgba(196,214,0,0.5)]" />
          </div>
        </div>

        {/* How It Works Section */}
        <div className="pt-8 border-t border-white/10">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-black text-white uppercase tracking-wide">Club Integration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-cnpc-accent/30 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-lg font-bold text-white uppercase mb-3">1. Create Profile</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Sign up via the official DUPR mobile application or online portal to establish your individual player identifier.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-cnpc-accent/30 transition-colors">
              <div className="w-12 h-12 bg-cnpc-accent/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-cnpc-accent" />
              </div>
              <h4 className="text-lg font-bold text-white uppercase mb-3">2. Request Entry</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Use our direct link to search for Camarines Norte Pickleball Club and submit a join request to link your profile to our roster.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-cnpc-accent/30 transition-colors">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="text-lg font-bold text-white uppercase mb-3">3. Record Results</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Submit scores from local club matches and recreational sessions. Your dynamic rating updates directly within our club log.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dupr;