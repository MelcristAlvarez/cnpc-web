import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search, Tag, X, MessageCircle, ExternalLink, CheckCircle, Filter, Loader2, ShieldCheck, UserCircle } from 'lucide-react';

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
  const [imageFile, setImageFile] = useState(null);

  // Fetch approved items on load
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/items/approved');
        if (res.ok) {
          const data = await res.json();
          // Map backend data to fit your custom UI structure
          const formattedData = data.map(item => ({
            id: item._id,
            title: item.title,
            price: item.price,
            category: item.category || 'Others',
            sellerName: item.sellerName,
            description: item.description,
            images: [item.image], // Wrap the single Cloudinary string in an array for your gallery
            facebookLink: item.contactInfo
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
  }, []);

  const openModal = (item) => {
    setSelectedListing(item);
    setActiveImageIndex(0); 
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleListSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Please upload an image.");
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('sellerName', user.fullName); 
    formData.append('contactInfo', facebookLink);
    formData.append('description', description);
    formData.append('image', imageFile);

    try {
      const response = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }, 
        body: formData
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form
        setTitle(''); setCategory(''); setPrice('');
        setFacebookLink(''); setDescription(''); setImageFile(null);
        
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

  const filteredListings = listings.filter(item => 
    activeCategory === "All" || item.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans pt-36 pb-20 px-6 lg:px-12">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Club <span className="text-cnpc-accent">Marketplace</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Buy, sell, or trade gear with other CNPC members. Click on an item to view details and contact the seller directly.
        </p>
      </div>

      {/* Tools Section (Search & Add Button) */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search gear, apparel, paddles..." 
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

      {/* Categories Filter Bar */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-6 mb-4 scrollbar-hide">
        <Filter className="w-5 h-5 text-slate-500 mr-2 flex-shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 border ${
              activeCategory === cat 
                ? 'bg-cnpc-accent text-slate-950 border-cnpc-accent shadow-[0_0_15px_rgba(196,214,0,0.3)]' 
                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <div className="col-span-full py-20 flex justify-center">
            <Loader2 className="w-10 h-10 text-cnpc-accent animate-spin" />
          </div>
        ) : filteredListings.length > 0 ? (
          filteredListings.map((item) => (
            <div 
              key={item.id}
              onClick={() => openModal(item)}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-cnpc-accent/40 transition-all hover:-translate-y-1 shadow-lg flex flex-col"
            >
              <div className="aspect-square w-full bg-slate-800 overflow-hidden relative">
                 <img 
                   src={item.images[0]} 
                   alt={item.title} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                 />
                 <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 font-bold text-cnpc-accent">
                   {item.price}
                 </div>
                 <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                   {item.category}
                 </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 text-white line-clamp-1">{item.title}</h3>
                <p className="text-sm text-slate-400 mt-auto">By {item.sellerName}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-500 mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No items found</h3>
            <p className="text-slate-400">There are currently no listings in the {activeCategory} category.</p>
          </div>
        )}
      </div>

      {/* Detail Modal Overlay */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-white/10 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative flex flex-col md:flex-row max-h-[90vh]">
            
            <button 
              onClick={() => setSelectedListing(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black p-2 rounded-full text-white transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Side: Image Gallery */}
            <div className="md:w-1/2 flex flex-col bg-black">
              <div className="w-full h-64 md:h-[400px] bg-slate-900">
                <img 
                  src={selectedListing.images[activeImageIndex]} 
                  alt={selectedListing.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Right Side: Details */}
            <div className="md:w-1/2 p-8 flex flex-col justify-between overflow-y-auto bg-[#111827]">
              <div>
                <div className="inline-block bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                  {selectedListing.category}
                </div>
                <h2 className="text-2xl font-black text-white uppercase leading-tight mb-4 pr-8">
                  {selectedListing.title}
                </h2>
                <div className="text-3xl font-black text-cnpc-accent mb-6">
                  {selectedListing.price}
                </div>
                
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {selectedListing.description}
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Seller</h4>
                  <p className="text-white font-medium">
                    {selectedListing.sellerName}
                  </p>
                </div>
              </div>

              <a 
                href={selectedListing.facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors shadow-lg mt-6"
              >
                <MessageCircle className="w-5 h-5" />
                Message on Facebook
                <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* "List an Item" Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 p-8 relative max-h-[95vh] overflow-y-auto">
            
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-6 right-6 bg-white/5 hover:bg-white/10 p-2 rounded-full text-slate-400 hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {!user ? (
              /* RESTRICTED ACCESS VIEW */
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShieldCheck className="w-20 h-20 text-slate-600 mb-6" />
                <h2 className="text-2xl font-black text-white uppercase tracking-wide mb-4">Members Only</h2>
                <p className="text-slate-400 mb-8 max-w-sm">You must be logged in with a verified account to list gear on the marketplace.</p>
                <button 
                  onClick={() => navigate('/auth')} 
                  className="w-full bg-gradient-to-r from-cnpc-accent to-lime-400 text-slate-950 py-4 rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition-all"
                >
                  Log In to Continue
                </button>
              </div>
            ) : !isSubmitted ? (
              /* SUBMISSION FORM */
              <>
                <h2 className="text-2xl font-black text-white uppercase mb-2">List Your Gear</h2>
                <p className="text-slate-400 text-sm mb-8">All listings require admin approval before going live.</p>

                <form onSubmit={handleListSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Item Name</label>
                    <input required value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="e.g. Selkirk Vanguard" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                      <select required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors appearance-none">
                        <option value="" disabled>Select...</option>
                        <option value="Paddles" className="bg-[#111827]">Paddles</option>
                        <option value="Apparel" className="bg-[#111827]">Apparel</option>
                        <option value="Footwear" className="bg-[#111827]">Footwear</option>
                        <option value="Accessories" className="bg-[#111827]">Accessories</option>
                        <option value="Others" className="bg-[#111827]">Others</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Price</label>
                      <input required value={price} onChange={(e) => setPrice(e.target.value)} type="text" placeholder="e.g. ₱8500" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Item Image</label>
                    <input 
                      required 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-cnpc-accent file:text-slate-900 hover:file:bg-lime-400 focus:outline-none transition-colors" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Facebook Profile Link</label>
                    <input required value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} type="url" placeholder="https://facebook.com/yourprofile" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description / Condition</label>
                    <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows="3" placeholder="Describe the item's condition..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors resize-none"></textarea>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-cnpc-accent to-lime-400 text-slate-950 py-4 rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition-all mt-4 flex justify-center items-center gap-2 disabled:opacity-70">
                    {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
                  </button>
                </form>
              </>
            ) : (
              /* SUCCESS VIEW */
              <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in duration-300">
                <CheckCircle className="w-20 h-20 text-cnpc-accent mb-6" />
                <h2 className="text-3xl font-black text-white uppercase mb-2">Success!</h2>
                <p className="text-slate-400">Your listing has been submitted and is pending admin approval. It will appear on the marketplace once reviewed.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Marketplace;