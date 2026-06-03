import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    let result;
    if (isLogin) {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData.fullName, formData.email, formData.password);
    }

    if (result.success) {
      navigate('/profile'); // Send them to their profile on success
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12 bg-gradient-to-b from-[#0B0F19] via-[#0A192F] to-[#0B0F19]">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cnpc-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cnpc-accent/20 shadow-[0_0_20px_rgba(196,214,0,0.15)]">
            <ShieldCheck className="w-8 h-8 text-cnpc-accent" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Join the Club'}
          </h1>
          <p className="text-slate-400 text-sm">
            {isLogin ? 'Sign in to access your player profile.' : 'Create an account to join events and the marketplace.'}
          </p>
        </div>

        <div className="bg-[#0B0F19]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold px-4 py-3 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Juan De La Cruz" className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors" />
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="player@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors" />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors" />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-cnpc-accent to-lime-400 text-slate-950 py-4 rounded-xl font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70">
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-sm text-slate-400">
              {isLogin ? "Don't have an account yet?" : "Already a member?"}
              <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="ml-2 text-cnpc-accent hover:text-white font-bold uppercase tracking-wider transition-colors">
                {isLogin ? 'Register Here' : 'Log In Here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;