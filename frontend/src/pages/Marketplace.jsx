import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search, Tag, X, MessageCircle, ExternalLink, CheckCircle, Filter, Loader2, UserCircle, Image as ImageIcon } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Marketplace = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const categories = ["All", "Paddles", "Apparel", "Footwear", "Accessories", "Others"];
  const [activeCategory, setActiveCategory] = useState("All");

  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedListing, setSelectedListing] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [description, setDescription] = useState('');
  
  // RESTORED: Holds multiple files!
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Fetch ALL if admin, APPROVED if normal user
        const endpoint = user?.role === 'admin' ? '/api/items/all' : '/api/items/approved';
        const headers = user?.role === 'admin' ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`${API_URL}${endpoint}`, { headers });
        if (res.ok) {
          const data = await res.json();
          const formattedData = data.map(item => ({
            id: item._id,
            title: item.title,
            price: item.price,
            category: item.category || 'Others',
            sellerName: item.sellerName,
            description: item.description,
            images: Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.image || 'https://via.placeholder.com/400'], 
            facebookLink: item.contactInfo,
            status: item.status
          }));
          setListings(formattedData);
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, [user, token]);

  const openModal = (item) => {
    setSelectedListing(item);
    setActiveImageIndex(0); 
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("You can only upload a maximum of 5 images.");
      return;
    }
    setImageFiles(files);
  };

  const handleListSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) return alert("Please upload at least one image.");
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('sellerName', user.fullName); 
    formData.append('contactInfo', facebookLink);
    formData.append('description', description);
    
    // Append multiple files
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch(`${API_URL}/api/items`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }, 
        body: formData
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTitle(''); setCategory(''); setPrice('');
        setFacebookLink(''); setDescription(''); setImageFiles([]);
        
        setTimeout(() => {
          setIsSubmitted(false);
          setIsFormOpen(false);
        }, 3000);
      } else {
        alert("Failed to submit item.");
      }
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // NEW: Delete Function
  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      const res = await fetch(`${API_URL}/api/items/${itemId}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setListings(listings.filter(item => item.id !== itemId));
        setSelectedListing(null); 
      }
    } catch (error) { console.error(error); }
  };

  // NEW: Approve Function
  const handleApprove = async (itemId) => {
    try {
      const res = await fetch(`${API_URL}/api/items/${itemId}/approve`, {
        method: 'PUT', headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setListings(listings.map(item => item.id === itemId ? { ...item, status: 'approved' } : item));
        setSelectedListing({ ...selectedListing, status: 'approved' });
      }
    } catch (error) { console.error(error); }
  };

  const filteredListings = listings.filter(item => 
    activeCategory === "All" || item.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans pt-36 pb-20 px-4 md:px-6 lg:px-12">
      
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3 uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Club <span className="text-cnpc-accent">Marketplace</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-lg max-w-2xl">
          Buy, sell, or trade gear with other CNPC members.
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search gear..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-slate-200 focus:outline-none focus:border-cnpc-accent/50 transition-colors"
          />
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="w-full md:w-auto bg-gradient-to-r from-cnpc-accent to-lime-400 text-slate-950 px-8 py-3 rounded-full font-bold uppercase tracking-wide hover:brightness-110 transition-all flex items-center justify-center gap-2"
        >
          <Tag className="w-4 h-4" />
          List an Item
        </button>
      </div>

      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        <Filter className="w-4 h-4 text-slate-500 mr-1 flex-shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-1.5 md:px-6 md:py-2 rounded-full font-bold text-xs md:text-sm transition-all duration-300 border ${
              activeCategory === cat 
                ? 'bg-cnpc-accent text-slate-950 border-cnpc-accent shadow-[0_0_15px_rgba(196,214,0,0.3)]' 
                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* RESTORED: DENSE GRID: Shopee style (2-cols on mobile, up to 5 on large desktop) */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 flex justify-center">
            <Loader2 className="w-10 h-10 text-cnpc-accent animate-spin" />
          </div>
        ) : filteredListings.length > 0 ? (
          filteredListings.map((item) => (
            <div 
              key={item.id}
              onClick={() => openModal(item)}
              className="group bg-white/5 border border-white/10 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer hover:border-cnpc-accent/40 transition-all hover:-translate-y-1 shadow-lg flex flex-col"
            >
              <div className="aspect-square w-full bg-slate-800 overflow-hidden relative">
                 <img 
                   src={item.images[0]} 
                   alt={item.title} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                 />
                 
                 {/* RESTORED: h-max w-max FIX applied here to stop stretching */}
                 <div className="absolute bottom-2 right-2 md:top-3 md:right-3 bg-slate-900/90 backdrop-blur-md px-2 md:px-3 py-1 rounded-md md:rounded-full border border-white/10 font-bold text-cnpc-accent text-xs md:text-sm h-max w-max">
                   {item.price}
                 </div>

                 {/* RESTORED: Multiple Images Indicator */}
                 {item.images.length > 1 && (
                   <div className="absolute top-2 right-2 bg-black/60 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 text-white">
                     <ImageIcon className="w-3 h-3" /> {item.images.length}
                   </div>
                 )}

                 {/* RESTORED: Admin Pending Badge */}
                 {user?.role === 'admin' && item.status === 'pending' && (
                   <div className="absolute top-2 left-2 bg-yellow-500/90 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-black text-black uppercase tracking-widest shadow-lg">
                     Pending
                   </div>
                 )}
              </div>
              
              <div className="p-3 md:p-5 flex flex-col flex-grow">
                <div className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {item.category}
                </div>
                <h3 className="text-sm md:text-lg font-bold text-white line-clamp-2 leading-tight mb-2">{item.title}</h3>
                <p className="text-[10px] md:text-xs text-slate-500 mt-auto line-clamp-1">{item.sellerName}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <Search className="w-10 h-10 text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No items found</h3>
            <p className="text-slate-400 text-sm">There are currently no listings here.</p>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#111827] border border-white/10 rounded-2xl md:rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[95vh] animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setSelectedListing(null)}
              className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/60 hover:bg-black p-2 rounded-full text-white transition-colors z-20"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Left Side: Main Image & Thumbnail Gallery */}
            <div className="md:w-1/2 flex flex-col bg-black">
              {/* Main Image View */}
              <div className="w-full h-64 md:h-[400px] bg-slate-950 flex items-center justify-center">
                <img 
                  src={selectedListing.images[activeImageIndex]} 
                  alt={selectedListing.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              {/* RESTORED: Thumbnail Gallery (Only shows if > 1 image) */}
              {selectedListing.images.length > 1 && (
                <div className="flex gap-2 p-3 bg-[#0B0F19] overflow-x-auto scrollbar-hide border-t border-white/5">
                  {selectedListing.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx ? 'border-cnpc-accent opacity-100' : 'border-transparent opacity-40 hover:opacity-100'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Information */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-[#111827]">
              <div>
                <div className="inline-block bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded mb-3">
                  {selectedListing.category}
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white uppercase leading-tight mb-2 pr-6">
                  {selectedListing.title}
                </h2>
                <div className="text-2xl md:text-3xl font-black text-cnpc-accent mb-6">
                  {selectedListing.price}
                </div>
                
                <div className="mb-6 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Description</h4>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedListing.description}
                  </p>
                </div>

                <div className="mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Seller</h4>
                    <p className="text-white text-sm font-bold">{selectedListing.sellerName}</p>
                  </div>
                </div>
              </div>

              {/* RESTORED: Admin / Owner Controls */}
              {user && (user.role === 'admin' || user.fullName === selectedListing.sellerName) ? (
                <div className="mt-4 pt-6 border-t border-white/10 flex flex-col gap-3">
                  {user.role === 'admin' && selectedListing.status === 'pending' && (
                    <button onClick={() => handleApprove(selectedListing.id)} className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 px-6 py-4 rounded-xl font-bold flex items-center justify-center transition-colors">
                      <CheckCircle className="w-5 h-5 mr-2" /> Approve Listing
                    </button>
                  )}
                  <button onClick={() => handleDelete(selectedListing.id)} className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-6 py-4 rounded-xl font-bold flex items-center justify-center transition-colors">
                    Delete Listing
                  </button>
                </div>
              ) : (
                <a 
                  href={selectedListing.facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white px-6 py-3.5 md:py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg mt-4"
                >
                  <MessageCircle className="w-5 h-5" />
                  Message on Facebook
                  <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* "List an Item" Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 p-6 md:p-8 relative max-h-[95vh] overflow-y-auto">
            
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 bg-white/5 hover:bg-white/10 p-2 rounded-full text-slate-400 hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {!user ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <UserCircle className="w-16 h-16 text-slate-600 mb-4" />
                <h2 className="text-xl font-black text-white uppercase tracking-wide mb-3">Account Required</h2>
                <p className="text-slate-400 text-sm mb-6 max-w-sm">Please log in first to attach your official profile when listing items.</p>
                <button 
                  onClick={() => navigate('/auth')} 
                  className="w-full bg-gradient-to-r from-cnpc-accent to-lime-400 text-slate-950 py-3 rounded-xl font-bold uppercase tracking-widest"
                >
                  Log In
                </button>
              </div>
            ) : !isSubmitted ? (
              <>
                <h2 className="text-xl md:text-2xl font-black text-white uppercase mb-1">List Your Gear</h2>
                <p className="text-slate-400 text-xs mb-6">Requires admin approval before going live.</p>

                <form onSubmit={handleListSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Item Name</label>
                    <input required value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cnpc-accent" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                      <select required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cnpc-accent appearance-none">
                        <option value="" disabled>Select...</option>
                        {categories.filter(c => c !== "All").map(cat => (
                          <option key={cat} value={cat} className="bg-[#111827]">{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Price</label>
                      <input required value={price} onChange={(e) => setPrice(e.target.value)} type="text" placeholder="₱" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cnpc-accent" />
                    </div>
                  </div>

                  {/* RESTORED: MULTIPLE IMAGE INPUT */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Photos (Up to 5)</label>
                    <input 
                      required 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleImageChange}
                      className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-cnpc-accent file:text-slate-900 hover:file:bg-lime-400 focus:outline-none cursor-pointer" 
                    />
                    {imageFiles.length > 0 && (
                      <p className="text-[10px] text-cnpc-accent mt-2 font-bold">{imageFiles.length} file(s) selected.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Facebook Link</label>
                    <input required value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} type="url" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cnpc-accent" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                    <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cnpc-accent resize-none"></textarea>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-cnpc-accent to-lime-400 text-slate-950 py-3.5 rounded-xl font-bold uppercase tracking-widest mt-2 flex justify-center items-center gap-2 disabled:opacity-70">
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSubmitting ? 'Uploading...' : 'Submit Post'}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle className="w-16 h-16 text-cnpc-accent mb-4" />
                <h2 className="text-2xl font-black text-white uppercase mb-2">Success!</h2>
                <p className="text-slate-400 text-sm">Listing submitted for admin review.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Marketplace;