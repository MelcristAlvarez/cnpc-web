import { useState, useEffect } from 'react';
import { Megaphone, Pin, Loader2, X, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

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
  }, [onClose, onPrev, onNext, images.length]);

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

// =========================================
// COMPONENT: Individual Post Card
// =========================================
const PostCard = ({ post, openLightbox }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all hover:border-white/20">
      {/* POST HEADER */}
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
        
        {/* POST CONTENT */}
        <h5 className="font-black text-white text-lg uppercase tracking-wide mb-2">{post.title}</h5>
        
        <SmartLinkifier text={post.content} isExpanded={isExpanded} />
        
        {post.content && post.content.length > 200 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-cnpc-accent text-sm font-bold hover:underline mb-2 transition-all"
          >
            {isExpanded ? 'See less' : '... See more'}
          </button>
        )}
      </div>
      
      {/* FULL BLEED IMAGES */}
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
  );
};

const Events = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightbox, setLightbox] = useState({ isOpen: false, images: [], currentIndex: 0 });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts');
        if (response.ok) setPosts(await response.json());
      } catch (error) { console.error("Failed to fetch posts:", error); } 
      finally { setIsLoading(false); }
    };
    fetchPosts();
  }, []);

  const openLightbox = (postImages, clickedIndex) => setLightbox({ isOpen: true, images: postImages, currentIndex: clickedIndex });
  const closeLightbox = () => setLightbox({ isOpen: false, images: [], currentIndex: 0 });
  const nextImage = () => setLightbox(prev => ({ ...prev, currentIndex: (prev.currentIndex + 1) % prev.images.length }));
  const prevImage = () => setLightbox(prev => ({ ...prev, currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length }));

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans pt-36 pb-20 px-6 lg:px-12 relative overflow-hidden">
      {lightbox.isOpen && (
        <ImageLightboxModal images={lightbox.images} currentIndex={lightbox.currentIndex} onClose={closeLightbox} onPrev={prevImage} onNext={nextImage} />
      )}

      {/* REPLACED max-w-4xl WITH max-w-2xl TO MATCH FACEBOOK FEED WIDTH */}
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Latest Updates
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
            Community <span className="text-cnpc-accent">Posts</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Stay updated with the latest news, announcements, and match results.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 text-cnpc-accent animate-spin" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
            <Megaphone className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2">No Posts Yet</h3>
            <p className="text-slate-400">Check back later for club announcements!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} openLightbox={openLightbox} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;