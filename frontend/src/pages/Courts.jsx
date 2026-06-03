import { useState, useEffect } from 'react';
import { MapPin, Navigation, Map as MapIcon, Loader2, Plus, Trash2, X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import ImageCropper from '../components/ImageCropper';
import getCroppedImg from '../utils/cropUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Courts = () => {
  const [courts, setCourts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Image Zoom State for live courts
  const [zoomedImage, setZoomedImage] = useState(null);

  // Suggestion Form State
  const [courtName, setCourtName] = useState('');
  const [courtArea, setCourtArea] = useState('');
  const [courtAddress, setCourtAddress] = useState('');
  const [courtGmapsUrl, setCourtGmapsUrl] = useState('');
  const [suggestedImages, setSuggestedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image Cropper Modal State
  const [cropFile, setCropFile] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/courts/approved`);
      if (response.ok) setCourts(await response.json());
    } catch (error) { console.error("Failed to fetch courts:", error); } 
    finally { setIsLoading(false); }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCropFile(URL.createObjectURL(file)); // Open the cropper modal!
    }
    e.target.value = ''; // Reset input so they can select the same file again if needed
  };

  const handleSaveCrop = async () => {
    try {
      const croppedImageFile = await getCroppedImg(cropFile, croppedAreaPixels);
      setSuggestedImages([...suggestedImages, croppedImageFile]);
      setCropFile(null); // Close modal
    } catch (error) {
      console.error("Failed to crop image", error);
    }
  };

  const removeSuggestedImage = (indexToRemove) => {
    setSuggestedImages(suggestedImages.filter((_, index) => index !== indexToRemove));
  };

  const handleSuggestSubmit = async (e) => {
    e.preventDefault();
    if (suggestedImages.length === 0) return alert("Please upload at least one photo of the court.");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', courtName);
      formData.append('area', courtArea);
      formData.append('address', courtAddress);
      formData.append('gmapsUrl', courtGmapsUrl);
      formData.append('submitterName', 'Anonymous Member');
      suggestedImages.forEach((file) => formData.append('images', file));

      const response = await fetch(`${API_URL}/api/courts`, { method: 'POST', body: formData });

      if (response.ok) {
        alert('Court suggestion submitted! Our admins will review it shortly.');
        setCourtName(''); setCourtArea(''); setCourtAddress(''); setCourtGmapsUrl(''); setSuggestedImages([]);
      } else { alert('Failed to submit court.'); }
    } catch (error) { console.error('Error submitting court:', error); } 
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans pt-36 pb-20 px-6 lg:px-12 relative">
      
      {/* CROPPER MODAL (Pops up when they add a photo) */}
      {cropFile && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-3xl bg-[#0B0F19] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-black text-white uppercase tracking-wide mb-2">Crop Court Photo</h3>
            <p className="text-sm text-slate-400 mb-4">Drag and zoom to perfectly frame the court.</p>
            
            <ImageCropper imageSrc={cropFile} onCropComplete={setCroppedAreaPixels} aspect={16 / 9} />
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button type="button" onClick={() => setCropFile(null)} className="px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-slate-400 bg-white/5 hover:bg-white/10 hover:text-white transition-all flex-1">
                Cancel
              </button>
              <button type="button" onClick={handleSaveCrop} className="px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-slate-950 bg-cnpc-accent hover:brightness-110 transition-all flex items-center justify-center gap-2 flex-1">
                <CheckCircle className="w-5 h-5" /> Confirm & Add Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE ZOOM LIGHTBOX */}
      {zoomedImage && !cropFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setZoomedImage(null)}>
          <button className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors bg-white/10 p-2 rounded-full">
            <X className="w-8 h-8" />
          </button>
          <img src={zoomedImage} alt="Zoomed Court" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="mb-14 text-center md:text-left">
          <div className="inline-block bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Where to Play
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
            Pickleball <span className="text-cnpc-accent">Courts</span>
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg mx-auto md:mx-0">
            Find the best places to rally, drill, and compete across Camarines Norte. 
          </p>
        </div>

        {/* Courts Grid */}
        {isLoading ? (
          <div className="py-20 flex justify-center"><Loader2 className="w-12 h-12 text-cnpc-accent animate-spin" /></div>
        ) : courts.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
            <MapIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2">No Courts Listed Yet</h3>
            <p className="text-slate-400">Be the first to suggest a local court below!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {courts.map((court) => (
              <div key={court._id} className="bg-[#111827] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col group transition-all">
                
                <div className="h-64 relative overflow-hidden bg-[#0A192F] cursor-pointer" onClick={() => setZoomedImage(court.images[0])}>
                  <img src={court.images[0]} alt={court.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-6 bg-cnpc-accent text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-lg">
                    {court.area}
                  </div>
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                </div>

                {court.images.length > 1 && (
                  <div className="flex gap-2 p-4 bg-[#0B0F19] overflow-x-auto border-b border-white/5 scrollbar-thin scrollbar-thumb-white/10">
                    {court.images.slice(1).map((img, idx) => (
                      <img key={idx} src={img} onClick={() => setZoomedImage(img)} alt="Additional view" className="w-20 h-16 object-cover rounded-lg cursor-pointer hover:opacity-70 border border-white/10 flex-shrink-0" />
                    ))}
                  </div>
                )}

                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-2xl font-black text-white uppercase tracking-wide mb-3 leading-tight">{court.name}</h2>
                  <div className="flex items-start gap-3 text-sm text-slate-400 mb-6">
                    <MapPin className="w-5 h-5 text-slate-500 shrink-0" />
                    <p className="leading-snug">{court.address}</p>
                  </div>

                  {court.gmapsUrl && (
                    <div className="mt-auto pt-4 border-t border-white/5">
                      <a href={court.gmapsUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-white/5 hover:bg-cnpc-accent/10 border border-white/10 hover:border-cnpc-accent/30 text-white hover:text-cnpc-accent py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                        <Navigation className="w-4 h-4" /> Open in Google Maps
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Suggest a Court Submission Form */}
        <div className="mt-20 bg-[#0A192F] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
            <MapIcon className="w-8 h-8 text-cnpc-accent" />
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-wide">Add a Court</h3>
              <p className="text-sm text-slate-400">Help us expand the community map! Submit a new spot below.</p>
            </div>
          </div>

          <form onSubmit={handleSuggestSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Court Name</label>
                <input type="text" required value={courtName} onChange={(e) => setCourtName(e.target.value)} placeholder="e.g. Habibi Sports Complex" className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Area / City</label>
                <input type="text" required value={courtArea} onChange={(e) => setCourtArea(e.target.value)} placeholder="e.g. Daet Central" className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Address</label>
                <input type="text" required value={courtAddress} onChange={(e) => setCourtAddress(e.target.value)} placeholder="e.g. Magallanes Iraya, Daet, Camarines Norte" className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Google Maps Link (Optional)</label>
                <input type="url" value={courtGmapsUrl} onChange={(e) => setCourtGmapsUrl(e.target.value)} placeholder="https://maps.google.com/..." className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors" />
              </div>

              {/* Multiple Image Cropper Grid */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Court Photos (Max 5)</label>
                <div className="flex flex-wrap gap-4">
                  {suggestedImages.map((file, index) => (
                    <div key={index} className="relative w-32 h-20 rounded-xl overflow-hidden border border-white/20 group">
                      <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                      <button type="button" onClick={() => removeSuggestedImage(index)} className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-6 h-6 text-red-400" />
                      </button>
                    </div>
                  ))}
                  {suggestedImages.length < 5 && (
                    <label className="w-32 h-20 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-cnpc-accent/50 hover:bg-white/5 transition-all group">
                      <Plus className="w-6 h-6 text-slate-400 group-hover:text-cnpc-accent mb-1" />
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-cnpc-accent uppercase tracking-wider">Add Photo</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="mt-6 w-full md:w-auto px-8 py-4 bg-gradient-to-r from-cnpc-accent to-lime-400 text-slate-950 rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapIcon className="w-5 h-5" />} 
              {isSubmitting ? 'Uploading...' : 'Submit Court Suggestion'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Courts;