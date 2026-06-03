import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Edit, Plus, Loader2 } from 'lucide-react';

const DuprManager = () => {
  const { token } = useContext(AuthContext);
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [rating, setRating] = useState('');
  const [category, setCategory] = useState('Mens Doubles');
  const [editingId, setEditingId] = useState(null);

  const fetchPlayers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/dupr');
      const data = await res.json();
      setPlayers(data);
    } catch (error) {
      console.error("Failed to fetch players");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPlayers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `http://localhost:5000/api/dupr/${editingId}` : 'http://localhost:5000/api/dupr';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name, rating: Number(rating), category })
      });

      if (res.ok) {
        setName(''); setRating(''); setCategory('Mens Doubles'); setEditingId(null);
        fetchPlayers(); // Refresh list
      }
    } catch (error) {
      console.error("Failed to save player");
    }
  };

  const handleEdit = (player) => {
    setName(player.name);
    setRating(player.rating);
    setCategory(player.category);
    setEditingId(player._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this player from the leaderboard?")) return;
    try {
      await fetch(`http://localhost:5000/api/dupr/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPlayers();
    } catch (error) {
      console.error("Failed to delete");
    }
  };

  return (
    <div className="bg-[#111827] border border-white/10 rounded-3xl p-8">
      <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-6">Manage DUPR Standings</h2>
      
      {/* CRUD Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 bg-white/5 p-6 rounded-2xl border border-white/10">
        <div className="md:col-span-2">
          <input required type="text" placeholder="Player Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white uppercase focus:outline-none focus:border-cnpc-gold" />
        </div>
        <div>
          <input required type="number" step="0.001" placeholder="Rating (e.g. 4.185)" value={rating} onChange={(e) => setRating(e.target.value)} className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-gold" />
        </div>
        <div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-gold appearance-none">
            <option value="Mens Doubles">Men's Doubles</option>
            <option value="Womens Doubles">Women's Doubles</option>
          </select>
        </div>
        <div className="md:col-span-4 flex gap-4 mt-2">
          <button type="submit" className="bg-cnpc-gold text-slate-950 px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2">
            {editingId ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editingId ? 'Update Player' : 'Add Player'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setName(''); setRating(''); }} className="bg-white/10 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-white/20 transition-all">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Leaderboard Data Table */}
      {isLoading ? <Loader2 className="w-8 h-8 text-cnpc-gold animate-spin mx-auto" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Men's List */}
          <div>
            <h3 className="text-xl font-bold text-white uppercase mb-4 border-b border-white/10 pb-2">Men's Doubles</h3>
            <div className="flex flex-col gap-2">
              {players.filter(p => p.category === 'Mens Doubles').map((player, index) => (
                <div key={player._id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all">
                  <div>
                    <span className="text-cnpc-gold font-black mr-3">#{index + 1}</span>
                    <span className="text-white font-bold uppercase">{player.name}</span>
                    <span className="text-slate-400 ml-3">{player.rating.toFixed(3)}</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(player)} className="text-slate-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(player._id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Women's List */}
          <div>
            <h3 className="text-xl font-bold text-white uppercase mb-4 border-b border-white/10 pb-2">Women's Doubles</h3>
            <div className="flex flex-col gap-2">
              {players.filter(p => p.category === 'Womens Doubles').map((player, index) => (
                <div key={player._id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all">
                  <div>
                    <span className="text-cnpc-gold font-black mr-3">#{index + 1}</span>
                    <span className="text-white font-bold uppercase">{player.name}</span>
                    <span className="text-slate-400 ml-3">{player.rating.toFixed(3)}</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(player)} className="text-slate-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(player._id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuprManager;