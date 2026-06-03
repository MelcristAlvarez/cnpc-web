import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import getCroppedImg from '../utils/cropUtils'; 
import ImageCropper from '../components/ImageCropper';
import { Shield, Megaphone, Calendar, ShoppingBag, Plus, Image as ImageIcon, Pin, MapPin, Clock, UserPlus, Loader2, Trash2, ArrowDownUp, Edit3, X, AlignLeft, CheckCircle, XCircle, Award, Mail, Phone, Map as MapIcon, Users, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaFacebook } from 'react-icons/fa';

const Admin = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // SET DEFAULT TAB TO 'about' (Hub Images)
  const [activeTab, setActiveTab] = useState('about'); 
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // =========================================
  // STATE MANAGEMENT
  // =========================================
  const [postTitle, setPostTitle] = useState(''); 
  const [postContent, setPostContent] = useState(''); 
  const [existingImages, setExistingImages] = useState([]); 
  const [postImages, setPostImages] = useState([]); 
  const [isPinned, setIsPinned] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [adminPosts, setAdminPosts] = useState([]); 
  const [postSortOrder, setPostSortOrder] = useState('newest'); 
  const [editingPostId, setEditingPostId] = useState(null); 
  const [postCropFile, setPostCropFile] = useState(null);

  const [pendingItems, setPendingItems] = useState([]);
  
  const [pendingCoaches, setPendingCoaches] = useState([]); 
  const [approvedCoaches, setApprovedCoaches] = useState([]); 
  const [editingCoachId, setEditingCoachId] = useState(null); 
  const [coachName, setCoachName] = useState(''); 
  const [coachTagline, setCoachTagline] = useState(''); 
  const [coachCerts, setCoachCerts] = useState(['']); 
  const [coachAchievements, setCoachAchievements] = useState(['']); 
  const [coachEmail, setCoachEmail] = useState(''); 
  const [coachFacebook, setCoachFacebook] = useState(''); 
  const [coachPhone, setCoachPhone] = useState(''); 
  const [isCoachSubmitting, setIsCoachSubmitting] = useState(false); 
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [coachImageFile, setCoachImageFile] = useState(null); 
  const [currentCoachImage, setCurrentCoachImage] = useState(null); 
  
  const [pendingCourts, setPendingCourts] = useState([]); 
  const [approvedCourts, setApprovedCourts] = useState([]); 
  const [editingCourtId, setEditingCourtId] = useState(null); 
  const [courtName, setCourtName] = useState(''); 
  const [courtArea, setCourtArea] = useState(''); 
  const [courtAddress, setCourtAddress] = useState(''); 
  const [courtGmapsUrl, setCourtGmapsUrl] = useState(''); 
  const [courtExistingImages, setCourtExistingImages] = useState([]); 
  const [courtNewImages, setCourtNewImages] = useState([]); 
  const [isCourtSubmitting, setIsCourtSubmitting] = useState(false); 
  const [courtCropFile, setCourtCropFile] = useState(null);
  
  const [adminMembers, setAdminMembers] = useState([]);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [memberForm, setMemberForm] = useState({ name: '', location: 'Daet, Bicol, PH', gender: 'M', role: 'Organizer' });
  const [isMemberSubmitting, setIsMemberSubmitting] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const [aboutImages, setAboutImages] = useState([]);
  const [aboutCropFile, setAboutCropFile] = useState(null);
  const [isAboutSubmitting, setIsAboutSubmitting] = useState(false);

  const handleArrayChange = (index, value, setter, array) => { const newArray = [...array]; newArray[index] = value; setter(newArray); };
  const addArrayItem = (setter, array) => setter([...array, '']);
  const removeArrayItem = (index, setter, array) => setter(array.filter((_, i) => i !== index));

  useEffect(() => {
    if (activeTab === 'posts') fetchAdminPosts();
    if (activeTab === 'marketplace') fetchPendingItems();
    if (activeTab === 'coaches') { fetchPendingCoaches(); fetchApprovedCoaches(); }
    if (activeTab === 'courts') { fetchPendingCourts(); fetchApprovedCourts(); }
    if (activeTab === 'members') fetchAdminMembers();
    if (activeTab === 'about') fetchAboutImages();
  }, [activeTab]);

  // =========================================
  // FETCHERS
  // =========================================
  const fetchAdminPosts = async () => { try { const res = await fetch('http://localhost:5000/api/posts'); if (res.ok) setAdminPosts(await res.json()); } catch (err) {} };
  const fetchPendingItems = async () => { try { const res = await fetch('http://localhost:5000/api/items/pending', { headers: { Authorization: `Bearer ${token}` } }); if (res.ok) setPendingItems(await res.json()); } catch (err) {} };
  const fetchPendingCoaches = async () => { try { const res = await fetch('http://localhost:5000/api/coaches/pending', { headers: { Authorization: `Bearer ${token}` } }); if (res.ok) setPendingCoaches(await res.json()); } catch (err) {} };
  const fetchApprovedCoaches = async () => { try { const res = await fetch('http://localhost:5000/api/coaches/approved'); if (res.ok) setApprovedCoaches(await res.json()); } catch (err) {} };
  const fetchPendingCourts = async () => { try { const res = await fetch('http://localhost:5000/api/courts/pending', { headers: { Authorization: `Bearer ${token}` } }); if (res.ok) setPendingCourts(await res.json()); } catch (err) {} };
  const fetchApprovedCourts = async () => { try { const res = await fetch('http://localhost:5000/api/courts/approved'); if (res.ok) setApprovedCourts(await res.json()); } catch (err) {} };
  const fetchAdminMembers = async () => { try { const res = await fetch('http://localhost:5000/api/members'); if (res.ok) setAdminMembers(await res.json()); } catch (err) {} };
  const fetchAboutImages = async () => { try { const res = await fetch('http://localhost:5000/api/about-images'); if (res.ok) setAboutImages(await res.json()); } catch (err) {} };

  // =========================================
  // ABOUT SECTION HANDLERS 
  // =========================================
  const handleAboutImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) setAboutCropFile(URL.createObjectURL(file));
    e.target.value = ''; 
  };

  const handleUploadAboutImage = async () => {
    setIsAboutSubmitting(true);
    try {
      const croppedFile = await getCroppedImg(aboutCropFile, croppedAreaPixels);
      const formData = new FormData();
      formData.append('image', croppedFile);
      
      const res = await fetch('http://localhost:5000/api/about-images', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      if (res.ok) {
        setAboutCropFile(null);
        fetchAboutImages();
      }
    } catch (err) {
      console.error("Failed to upload about image", err);
    } finally {
      setIsAboutSubmitting(false);
    }
  };

  const handleDeleteAboutImage = async (id) => {
    if (!window.confirm("Remove this photo from the homepage slider?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/about-images/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) fetchAboutImages();
    } catch (err) {}
  };

  // =========================================
  // MEMBER HANDLERS 
  // =========================================
  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    setIsMemberSubmitting(true);
    try {
      const url = editingMemberId ? `http://localhost:5000/api/members/${editingMemberId}` : 'http://localhost:5000/api/members';
      const method = editingMemberId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(memberForm) });
      if (res.ok) {
        alert(editingMemberId ? 'Member updated!' : 'Member added!');
        setEditingMemberId(null); setMemberForm({ name: '', location: 'Daet, Bicol, PH', gender: 'M', role: 'Organizer' });
        fetchAdminMembers();
      }
    } catch (err) {} finally { setIsMemberSubmitting(false); }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm("Delete member?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/members/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) fetchAdminMembers();
    } catch (err) {}
  };

  const handleEditMemberClick = (member) => {
    setEditingMemberId(member._id);
    setMemberForm({ name: member.name, location: member.location, gender: member.gender, role: member.role });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBulkImport = async () => {
    if (!bulkText.trim()) return alert("Paste the text first!");
    if (!window.confirm("Ready to bulk import these members? This may take a few seconds.")) return;
    
    setIsMemberSubmitting(true);
    try {
      const lines = bulkText.split('\n')
        .map(l => l.trim())
        .filter(l => l !== '' && l.toLowerCase() !== 'avatar');
      
      let count = 0;
      let i = 0;
      
      while (i < lines.length) {
        if (i + 3 >= lines.length) break; 
        
        const name = lines[i++]; 
        i++; 
        
        let location = 'Daet, Bicol, PH'; 
        let ageGenderLine = '';
        
        if (lines[i].includes('•')) {
          ageGenderLine = lines[i++];
        } else {
          location = lines[i++];
          if (i < lines.length && lines[i].includes('•')) {
             ageGenderLine = lines[i++];
          } else {
             ageGenderLine = 'M'; 
          }
        }

        i++; 
        i++; 

        const parts = ageGenderLine.split('•').map(p => p.trim());
        let gender = 'M';
        if (parts.length === 2) { 
           gender = parts[1].toUpperCase() === 'F' ? 'F' : 'M'; 
        } else if (parts.length === 1) { 
           gender = parts[0].toUpperCase().includes('F') ? 'F' : 'M'; 
        }

        const payload = { name, location, gender, role: 'Member' };
        
        await fetch('http://localhost:5000/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        count++;
      }
      
      alert(`Successfully imported ${count} members!`);
      setBulkText('');
      fetchAdminMembers();
    } catch (err) { 
      alert("Error during bulk import. Check console."); 
      console.error(err); 
    } 
    finally { setIsMemberSubmitting(false); }
  };

  // =========================================
  // COURTS HANDLERS
  // =========================================
  const handleCourtImageSelect = (e) => { const file = e.target.files[0]; if (file) setCourtCropFile(URL.createObjectURL(file)); e.target.value = ''; };
  const handleSaveCourtCrop = async () => { try { const croppedFile = await getCroppedImg(courtCropFile, croppedAreaPixels); setCourtNewImages([...courtNewImages, croppedFile]); setCourtCropFile(null); } catch (err) { } };
  const handleCourtSubmit = async (e) => {
    e.preventDefault(); setIsCourtSubmitting(true);
    try {
      const formData = new FormData(); formData.append('name', courtName); formData.append('area', courtArea); formData.append('address', courtAddress); formData.append('gmapsUrl', courtGmapsUrl);
      if (editingCourtId) formData.append('existingImages', JSON.stringify(courtExistingImages));
      courtNewImages.forEach((file) => formData.append('images', file));
      const url = editingCourtId ? `http://localhost:5000/api/courts/${editingCourtId}` : `http://localhost:5000/api/courts`;
      const res = await fetch(url, { method: editingCourtId ? 'PUT' : 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
      if (res.ok) { if (!editingCourtId) { const newCourt = await res.json(); await fetch(`http://localhost:5000/api/courts/${newCourt._id}/approve`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }); } alert(editingCourtId ? 'Court updated!' : 'Court added!'); resetCourtForm(); fetchApprovedCourts(); }
    } catch (error) { } finally { setIsCourtSubmitting(false); }
  };
  const handleApproveCourt = async (id) => { try { const res = await fetch(`http://localhost:5000/api/courts/${id}/approve`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }); if (res.ok) { setPendingCourts(pendingCourts.filter(c => c._id !== id)); fetchApprovedCourts(); } } catch (error) { } };
  const handleDeleteCourt = async (id) => { if (!window.confirm("Delete court?")) return; try { const res = await fetch(`http://localhost:5000/api/courts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); if (res.ok) { setPendingCourts(pendingCourts.filter(c => c._id !== id)); setApprovedCourts(approvedCourts.filter(c => c._id !== id)); if (editingCourtId === id) resetCourtForm(); } } catch (error) {} };
  const handleEditCourtClick = (court) => { setEditingCourtId(court._id); setCourtName(court.name); setCourtArea(court.area); setCourtAddress(court.address); setCourtGmapsUrl(court.gmapsUrl || ''); setCourtExistingImages(court.images || []); setCourtNewImages([]); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const resetCourtForm = () => { setEditingCourtId(null); setCourtName(''); setCourtArea(''); setCourtAddress(''); setCourtGmapsUrl(''); setCourtExistingImages([]); setCourtNewImages([]); };
  const removeCourtExistingImage = (idx) => setCourtExistingImages(courtExistingImages.filter((_, i) => i !== idx)); const removeCourtNewImage = (idx) => setCourtNewImages(courtNewImages.filter((_, i) => i !== idx));

  // =========================================
  // COACH HANDLERS
  // =========================================
  const handleCoachSubmit = async (e) => {
    e.preventDefault(); if (!coachImageFile && !currentCoachImage && !editingCoachId) return alert("Photo required."); setIsCoachSubmitting(true);
    try {
      const formData = new FormData(); formData.append('name', coachName); formData.append('tagline', coachTagline); formData.append('certs', coachCerts.filter(c => c.trim() !== '').join(',')); formData.append('achievements', coachAchievements.filter(a => a.trim() !== '').join(',')); formData.append('email', coachEmail); formData.append('facebook', coachFacebook); formData.append('phone', coachPhone);
      if (previewUrl && croppedAreaPixels) { try { formData.append('image', await getCroppedImg(previewUrl, croppedAreaPixels)); } catch (err) { formData.append('image', coachImageFile); } } else if (coachImageFile) { formData.append('image', coachImageFile); }
      const res = await fetch(editingCoachId ? `http://localhost:5000/api/coaches/${editingCoachId}` : `http://localhost:5000/api/coaches`, { method: editingCoachId ? 'PUT' : 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
      if (res.ok) { if (!editingCoachId) { const newCoach = await res.json(); await fetch(`http://localhost:5000/api/coaches/${newCoach._id}/approve`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }); } alert(editingCoachId ? 'Coach updated successfully!' : 'Community Coach added successfully!'); resetCoachForm(); fetchApprovedCoaches(); } 
    } catch (error) {} finally { setIsCoachSubmitting(false); }
  };
  const handleApproveCoach = async (id) => { try { const res = await fetch(`http://localhost:5000/api/coaches/${id}/approve`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }); if (res.ok) { setPendingCoaches(pendingCoaches.filter(coach => coach._id !== id)); fetchApprovedCoaches(); } } catch (error) {} };
  const handleDeleteCoach = async (id) => { if (!window.confirm("Delete coach?")) return; try { const res = await fetch(`http://localhost:5000/api/coaches/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); if (res.ok) { setPendingCoaches(pendingCoaches.filter(coach => coach._id !== id)); setApprovedCoaches(approvedCoaches.filter(coach => coach._id !== id)); if (editingCoachId === id) resetCoachForm(); } } catch (error) {} };
  const handleEditCoachClick = (coach) => { setEditingCoachId(coach._id); setCoachName(coach.name); setCoachTagline(coach.tagline); setCoachCerts(coach.certs ? coach.certs.split(',') : ['']); setCoachAchievements(coach.achievements ? coach.achievements.split(',') : ['']); setCoachEmail(coach.email || ''); setCoachFacebook(coach.facebook || ''); setCoachPhone(coach.phone || ''); setCurrentCoachImage(coach.image); setCoachImageFile(null); setPreviewUrl(null); setCroppedAreaPixels(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const resetCoachForm = () => { setEditingCoachId(null); setCoachName(''); setCoachTagline(''); setCoachCerts(['']); setCoachAchievements(['']); setCoachEmail(''); setCoachFacebook(''); setCoachPhone(''); setCurrentCoachImage(null); setCoachImageFile(null); setPreviewUrl(null); setCroppedAreaPixels(null); };

  // =========================================
  // MARKETPLACE HANDLERS
  // =========================================
  const handleApproveItem = async (id) => { try { const res = await fetch(`http://localhost:5000/api/items/${id}/approve`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }); if (res.ok) setPendingItems(pendingItems.filter(item => item._id !== id)); } catch (error) {} };
  const handleRejectItem = async (id) => { if (!window.confirm("Reject listing?")) return; try { const res = await fetch(`http://localhost:5000/api/items/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); if (res.ok) setPendingItems(pendingItems.filter(item => item._id !== id)); } catch (error) {} };

  // =========================================
  // POST HANDLERS 
  // =========================================
  const handlePostImageSelect = (e) => { 
    const filesArray = Array.from(e.target.files);
    if ((existingImages.length + postImages.length + filesArray.length) > 20) return alert("Maximum 20 images allowed.");
    setPostImages([...postImages, ...filesArray]);
  };
  
  const moveExistingImageLeft = (idx) => {
    if (idx === 0) return;
    const arr = [...existingImages];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    setExistingImages(arr);
  };
  const moveExistingImageRight = (idx) => {
    if (idx === existingImages.length - 1) return;
    const arr = [...existingImages];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    setExistingImages(arr);
  };

  const moveNewImageLeft = (idx) => {
    if (idx === 0) return;
    const arr = [...postImages];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    setPostImages(arr);
  };
  const moveNewImageRight = (idx) => {
    if (idx === postImages.length - 1) return;
    const arr = [...postImages];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    setPostImages(arr);
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault(); 
    setIsSubmitting(true);
    try {
      const formData = new FormData(); 
      formData.append('title', postTitle); 
      formData.append('content', postContent); 
      formData.append('isPinned', isPinned);
      
      if (editingPostId) formData.append('existingImages', JSON.stringify(existingImages));
      postImages.forEach((file) => formData.append('images', file));
      
      const res = await fetch(editingPostId ? `http://localhost:5000/api/posts/${editingPostId}` : `http://localhost:5000/api/posts`, { 
        method: editingPostId ? 'PUT' : 'POST', 
        headers: { Authorization: `Bearer ${token}` }, 
        body: formData 
      });
      if (res.ok) { 
        alert(editingPostId ? 'Post updated!' : 'Post published!'); 
        resetPostForm(); 
        fetchAdminPosts(); 
      }
    } catch (error) {} finally { setIsSubmitting(false); }
  };
  
  const handleDeletePost = async (id) => { if (!window.confirm("Delete post?")) return; try { const res = await fetch(`http://localhost:5000/api/posts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); if (res.ok) { setAdminPosts(adminPosts.filter(post => post._id !== id)); if (editingPostId === id) resetPostForm(); } } catch (error) {} };
  const handleEditPostClick = (post) => { setEditingPostId(post._id); setPostTitle(post.title); setPostContent(post.content); setIsPinned(post.isPinned); setExistingImages(post.images || []); setPostImages([]); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const resetPostForm = () => { setEditingPostId(null); setPostTitle(''); setPostContent(''); setExistingImages([]); setPostImages([]); setIsPinned(false); };
  const handleRemoveExistingImage = (idx) => setExistingImages(existingImages.filter((_, i) => i !== idx)); 
  const handleRemoveNewImage = (idx) => setPostImages(postImages.filter((_, i) => i !== idx));
  const sortedPosts = [...adminPosts].sort((a, b) => { if (postSortOrder === 'newest') return new Date(b.createdAt) - new Date(a.createdAt); return new Date(a.createdAt) - new Date(b.createdAt); });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col items-center justify-center px-6 text-center">
        <Shield className="w-20 h-20 text-red-500 mb-6" />
        <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Admin Access Denied</h1>
        <button onClick={() => navigate('/')} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-bold transition-all">Return Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 font-sans pt-36 pb-20 px-6 lg:px-12 bg-gradient-to-b from-[#0B0F19] via-[#0A192F] to-[#0B0F19] relative">
      
      {/* GLOBAL MODALS */}
      {courtCropFile && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-3xl bg-[#0B0F19] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-black text-white uppercase tracking-wide mb-2">Crop Court Photo</h3>
            <p className="text-sm text-slate-400 mb-4">Drag and zoom to perfectly frame the court.</p>
            <ImageCropper imageSrc={courtCropFile} onCropComplete={setCroppedAreaPixels} aspect={16 / 9} />
            <div className="flex gap-4 mt-6">
              <button type="button" onClick={() => setCourtCropFile(null)} className="flex-1 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-slate-400 bg-white/5 hover:bg-white/10 transition-all">Cancel</button>
              <button type="button" onClick={handleSaveCourtCrop} className="flex-1 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-slate-950 bg-cnpc-accent hover:brightness-110 flex justify-center gap-2 transition-all"><CheckCircle className="w-5 h-5" /> Confirm & Add</button>
            </div>
          </div>
        </div>
      )}

      {aboutCropFile && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-3xl bg-[#0B0F19] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-black text-white uppercase tracking-wide mb-2">Crop Homepage Photo</h3>
            <p className="text-sm text-slate-400 mb-4">Drag and zoom to format the image for the "About Us" slider.</p>
            <ImageCropper imageSrc={aboutCropFile} onCropComplete={setCroppedAreaPixels} aspect={16 / 9} />
            <div className="flex gap-4 mt-6">
              <button type="button" onClick={() => setAboutCropFile(null)} className="flex-1 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-slate-400 bg-white/5 hover:bg-white/10 transition-all">Cancel</button>
              <button type="button" onClick={handleUploadAboutImage} disabled={isAboutSubmitting} className="flex-1 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-slate-950 bg-cnpc-accent hover:brightness-110 flex justify-center gap-2 transition-all disabled:opacity-50">
                {isAboutSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : <CheckCircle className="w-5 h-5" />} 
                {isAboutSubmitting ? 'Uploading...' : 'Confirm & Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <div className="inline-block bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-1">Restricted Access</div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">Admin Dashboard</h1>
            </div>
          </div>
        </div>

        {/* ====================================================
            TAB NAVIGATION (LOCKED INTO A SINGLE ROW) 
            ==================================================== */}
        <div className="flex w-full gap-1.5 md:gap-2 mb-8">
          
          {/* 1. Hub Images */}
          <button onClick={() => setActiveTab('about')} className={`flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-1 py-2 md:py-3 rounded-xl font-bold text-[8px] md:text-[10px] lg:text-xs uppercase tracking-tight transition-all border ${activeTab === 'about' ? 'bg-cnpc-accent text-slate-950 border-cnpc-accent shadow-[0_0_15px_rgba(196,214,0,0.3)]' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'}`}>
            <Camera className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" /> 
            <span className="text-center">Club Images</span>
          </button>
          
          {/* 2. Manage Posts */}
          <button onClick={() => setActiveTab('posts')} className={`flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-1 py-2 md:py-3 rounded-xl font-bold text-[8px] md:text-[10px] lg:text-xs uppercase tracking-tight transition-all border ${activeTab === 'posts' ? 'bg-cnpc-accent text-slate-950 border-cnpc-accent shadow-[0_0_15px_rgba(196,214,0,0.3)]' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'}`}>
            <Megaphone className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" /> 
            <span className="text-center">Manage Posts</span>
          </button>

          {/* 3. Court Manager */}
          <button onClick={() => setActiveTab('courts')} className={`flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-1 py-2 md:py-3 rounded-xl font-bold text-[8px] md:text-[10px] lg:text-xs uppercase tracking-tight transition-all border ${activeTab === 'courts' ? 'bg-cnpc-accent text-slate-950 border-cnpc-accent shadow-[0_0_15px_rgba(196,214,0,0.3)]' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'}`}>
            <MapIcon className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" /> 
            <span className="text-center relative">
              Court Manager 
              {pendingCourts.length > 0 && <span className="absolute -top-2 -right-3 md:relative md:top-0 md:right-0 bg-red-500 text-white text-[8px] px-1 md:px-1.5 py-0.5 rounded-full md:ml-1">{pendingCourts.length}</span>}
            </span>
          </button>

          {/* 4. Coach Manager */}
          <button onClick={() => setActiveTab('coaches')} className={`flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-1 py-2 md:py-3 rounded-xl font-bold text-[8px] md:text-[10px] lg:text-xs uppercase tracking-tight transition-all border ${activeTab === 'coaches' ? 'bg-cnpc-accent text-slate-950 border-cnpc-accent shadow-[0_0_15px_rgba(196,214,0,0.3)]' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'}`}>
            <UserPlus className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" /> 
            <span className="text-center relative">
              Coach Manager 
              {pendingCoaches.length > 0 && <span className="absolute -top-2 -right-3 md:relative md:top-0 md:right-0 bg-red-500 text-white text-[8px] px-1 md:px-1.5 py-0.5 rounded-full md:ml-1">{pendingCoaches.length}</span>}
            </span>
          </button>

          {/* 5. Club Roster */}
          <button onClick={() => setActiveTab('members')} className={`flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-1 py-2 md:py-3 rounded-xl font-bold text-[8px] md:text-[10px] lg:text-xs uppercase tracking-tight transition-all border ${activeTab === 'members' ? 'bg-cnpc-accent text-slate-950 border-cnpc-accent shadow-[0_0_15px_rgba(196,214,0,0.3)]' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'}`}>
            <Users className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" /> 
            <span className="text-center">Club Roster</span>
          </button>

          {/* 6. Market Approvals */}
          <button onClick={() => setActiveTab('marketplace')} className={`flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-1 py-2 md:py-3 rounded-xl font-bold text-[8px] md:text-[10px] lg:text-xs uppercase tracking-tight transition-all border ${activeTab === 'marketplace' ? 'bg-cnpc-accent text-slate-950 border-cnpc-accent shadow-[0_0_15px_rgba(196,214,0,0.3)]' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'}`}>
            <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" /> 
            <span className="text-center relative">
              Market Approvals 
              {pendingItems.length > 0 && <span className="absolute -top-2 -right-3 md:relative md:top-0 md:right-0 bg-red-500 text-white text-[8px] px-1 md:px-1.5 py-0.5 rounded-full md:ml-1">{pendingItems.length}</span>}
            </span>
          </button>

        </div>

        <div className="bg-[#0B0F19]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">

          {/* ==============================================
              CLUB IMAGES TAB (Hub)
              ============================================== */}
          {activeTab === 'about' && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-8">
                <div className="flex items-center gap-3">
                  <Camera className="w-8 h-8 text-cnpc-accent" />
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wide">Homepage Slider Photos</h2>
                    <p className="text-sm text-slate-400">Manage the auto-sliding image gallery in the "About The Club" section.</p>
                  </div>
                </div>
                
                <label className="bg-gradient-to-r from-cnpc-accent to-lime-400 text-slate-950 px-6 py-3 rounded-xl font-bold uppercase tracking-widest cursor-pointer hover:brightness-110 flex items-center gap-2 shadow-[0_0_20px_rgba(196,214,0,0.2)] transition-all">
                  <Plus className="w-5 h-5"/> Add Photo
                  <input type="file" className="hidden" accept="image/*" onChange={handleAboutImageSelect} />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aboutImages.length === 0 ? (
                  <div className="col-span-full py-16 text-center bg-white/5 border border-white/10 rounded-3xl">
                    <p className="text-slate-400">No images uploaded yet. Add a photo to start the homepage slider.</p>
                  </div>
                ) : (
                  aboutImages.map((img) => (
                    <div key={img._id} className="relative aspect-video rounded-2xl overflow-hidden border border-white/20 group">
                      <img src={img.image} alt="About Club" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => handleDeleteAboutImage(img._id)} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm uppercase flex items-center gap-2 hover:bg-red-600">
                          <Trash2 className="w-4 h-4"/> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ==============================================
              MEMBERS TAB
              ============================================== */}
          {activeTab === 'members' && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-12 border-b border-white/10 pb-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-cnpc-accent" />
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                        {editingMemberId ? 'Edit Player' : 'Add Club Member'}
                      </h2>
                    </div>
                  </div>
                  {editingMemberId && (
                    <button onClick={() => {setEditingMemberId(null); setMemberForm({ name: '', location: 'Daet, Bicol, PH', gender: 'M', role: 'Organizer' });}} className="text-sm font-bold text-slate-400 hover:text-white flex gap-2 border border-white/10 px-3 py-1.5 rounded-lg"><X className="w-4 h-4" /> Cancel Edit</button>
                  )}
                </div>

                <form onSubmit={handleMemberSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                      <input type="text" required value={memberForm.name} onChange={(e) => setMemberForm({...memberForm, name: e.target.value})} className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Location</label>
                      <input type="text" required value={memberForm.location} onChange={(e) => setMemberForm({...memberForm, location: e.target.value})} className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
                      <select value={memberForm.gender} onChange={(e) => setMemberForm({...memberForm, gender: e.target.value})} className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors appearance-none cursor-pointer">
                        <option value="M">Male (M)</option>
                        <option value="F">Female (F)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Club Role</label>
                      <select value={memberForm.role} onChange={(e) => setMemberForm({...memberForm, role: e.target.value})} className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors appearance-none cursor-pointer font-bold">
                        <option value="Member">Regular Member</option>
                        <option value="Officer">Club Officer</option>
                        <option value="Organizer">Organizer</option>
                        <option value="Director">Director</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" disabled={isMemberSubmitting} className="px-8 py-4 bg-gradient-to-r from-cnpc-accent to-lime-400 text-slate-950 rounded-xl font-bold uppercase disabled:opacity-50 flex items-center gap-2">
                    {isMemberSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5"/> }
                    {isMemberSubmitting ? 'Saving...' : (editingMemberId ? 'Update Player' : 'Add Player')}
                  </button>
                </form>
              </div>

              {!editingMemberId && (
                <div className="mb-12 bg-white/5 p-6 rounded-3xl border border-cnpc-accent/30 shadow-[0_0_15px_rgba(196,214,0,0.05)]">
                  <h2 className="text-xl font-black text-white uppercase tracking-wide mb-2 flex items-center gap-2"><ArrowDownUp className="w-5 h-5 text-cnpc-accent" /> Mass Bulk Import Tool</h2>
                  <p className="text-sm text-slate-400 mb-6">Paste the raw DUPR roster text block directly into this box. It automatically ignores the word 'avatar' and extracts only Name, Location, and Gender.</p>
                  <textarea rows="4" value={bulkText} onChange={(e) => setBulkText(e.target.value)} placeholder="Paste DUPR list here..." className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-400 focus:outline-none focus:border-cnpc-accent resize-y mb-4 font-mono"></textarea>
                  <button onClick={handleBulkImport} disabled={isMemberSubmitting} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold uppercase disabled:opacity-50 transition-colors">
                    {isMemberSubmitting ? 'Processing Import...' : 'Run Bulk Import'}
                  </button>
                </div>
              )}

              <div className="pt-4 border-t border-white/10">
                <h2 className="text-xl font-black text-white uppercase tracking-wide mb-6">Manage Roster Directory</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {adminMembers.map((member) => (
                    <div key={member._id} className={`bg-[#111827] border rounded-2xl p-4 flex gap-4 items-center group transition-colors ${member.role !== 'Member' ? 'border-cnpc-accent/50' : 'border-white/5 hover:border-white/20'}`}>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white uppercase">{member.name}</h4>
                          {member.role !== 'Member' && <span className="bg-cnpc-accent text-slate-900 text-[8px] font-black uppercase px-1.5 py-0.5 rounded">{member.role}</span>}
                        </div>
                        <p className="text-xs text-slate-400">{member.location} • {member.gender === 'F' ? 'Female' : 'Male'}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleEditMemberClick(member)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteMember(member._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              COURTS TAB
              ============================================== */}
          {activeTab === 'courts' && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-12 border-b border-white/10 pb-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <MapIcon className="w-8 h-8 text-cnpc-accent" />
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                        {editingCourtId ? 'Edit Court Details' : 'Add Official Court'}
                      </h2>
                      <p className="text-sm text-slate-400">Manually add or edit community courts to the map.</p>
                    </div>
                  </div>
                  {editingCourtId && (
                    <button onClick={resetCourtForm} className="text-sm font-bold text-slate-400 hover:text-white flex gap-2 border border-white/10 px-3 py-1.5 rounded-lg"><X className="w-4 h-4" /> Cancel Edit</button>
                  )}
                </div>

                <form onSubmit={handleCourtSubmit} className="max-w-4xl space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Court Name</label>
                      <input type="text" required value={courtName} onChange={(e) => setCourtName(e.target.value)} placeholder="e.g. Habibi Complex" className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Area / City</label>
                      <input type="text" required value={courtArea} onChange={(e) => setCourtArea(e.target.value)} placeholder="e.g. Daet" className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Address</label>
                      <input type="text" required value={courtAddress} onChange={(e) => setCourtAddress(e.target.value)} placeholder="e.g. Magallanes Iraya..." className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Google Maps Link (Optional)</label>
                      <input type="url" value={courtGmapsUrl} onChange={(e) => setCourtGmapsUrl(e.target.value)} placeholder="https://maps.google.com/..." className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Court Photos (Max 5)</label>
                      <div className="flex flex-wrap gap-4">
                        {courtExistingImages.map((imgUrl, index) => (
                          <div key={`c-ext-${index}`} className="relative w-32 h-20 rounded-xl overflow-hidden border border-white/20 group">
                            <img src={imgUrl} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                            <div className="absolute top-1 left-1 bg-black/50 text-white text-[8px] font-black px-1.5 py-0.5 rounded">Saved</div>
                            <button type="button" onClick={() => removeCourtExistingImage(index)} className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-6 h-6 text-red-400" /></button>
                          </div>
                        ))}
                        {courtNewImages.map((file, index) => (
                          <div key={`c-new-${index}`} className="relative w-32 h-20 rounded-xl overflow-hidden border-2 border-cnpc-accent group">
                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                            <div className="absolute top-1 left-1 bg-cnpc-accent text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">New</div>
                            <button type="button" onClick={() => removeCourtNewImage(index)} className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-6 h-6 text-red-400" /></button>
                          </div>
                        ))}
                        {(courtExistingImages.length + courtNewImages.length) < 5 && (
                          <label className="w-32 h-20 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-cnpc-accent/50 hover:bg-white/5 transition-all group">
                            <Plus className="w-6 h-6 text-slate-400 group-hover:text-cnpc-accent mb-1" />
                            <span className="text-[10px] font-bold text-slate-400 group-hover:text-cnpc-accent uppercase">Add Photo</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleCourtImageSelect} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                  <button type="submit" disabled={isCourtSubmitting} className="px-8 py-4 bg-gradient-to-r from-cnpc-accent to-lime-400 text-slate-950 rounded-xl font-bold uppercase hover:brightness-110 disabled:opacity-50 flex items-center gap-2 transition-all">
                    {isCourtSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapIcon className="w-5 h-5"/> }
                    {isCourtSubmitting ? 'Saving...' : (editingCourtId ? 'Update Court' : 'Add Official Court')}
                  </button>
                </form>
              </div>

              {pendingCourts.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-xl font-black text-white uppercase tracking-wide mb-6">Review Community Suggestions</h2>
                  <div className="space-y-4">
                    {pendingCourts.map((court) => (
                      <div key={court._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row gap-6 hover:border-white/20 transition-all">
                        {court.images.length > 0 && (
                          <img src={court.images[0]} alt="Court" className="w-32 h-24 object-cover rounded-xl border border-white/10 shrink-0" />
                        )}
                        <div className="flex-grow">
                          <h3 className="text-lg font-bold text-white uppercase">{court.name}</h3>
                          <p className="text-sm text-slate-400">{court.address}</p>
                          <p className="text-xs text-cnpc-accent mt-2">Suggested By: {court.submitterName}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleApproveCourt(court._id)} className="bg-green-500/10 text-green-400 px-4 py-2 rounded-lg text-sm font-bold uppercase hover:bg-green-500/20"><CheckCircle className="w-4 h-4 inline mr-2"/>Approve</button>
                          <button onClick={() => handleDeleteCourt(court._id)} className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-sm font-bold uppercase hover:bg-red-500/20"><XCircle className="w-4 h-4 inline mr-2"/>Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4">
                <h2 className="text-xl font-black text-white uppercase tracking-wide mb-6">Manage Approved Courts</h2>
                <div className="space-y-4">
                  {approvedCourts.map((court) => (
                    <div key={court._id} className="bg-[#111827] border border-white/5 rounded-2xl p-5 flex gap-4 items-center group hover:border-white/20 transition-colors">
                      <div className="flex-grow">
                        <h4 className="font-bold text-white uppercase">{court.name}</h4>
                        <p className="text-xs text-slate-400">{court.area}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditCourtClick(court)} className="p-3 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteCourt(court._id)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              COACHES TAB
              ============================================== */}
          {activeTab === 'coaches' && (
            <div className="animate-in fade-in duration-300">
              
              <div className="mb-12 border-b border-white/10 pb-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <UserPlus className="w-8 h-8 text-cnpc-accent" />
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                        {editingCoachId ? 'Edit Coach Details' : 'Add Community Coach'}
                      </h2>
                      <p className="text-sm text-slate-400">
                        {editingCoachId ? 'Update details for this community coach.' : 'Manually create and approve a new coach.'}
                      </p>
                    </div>
                  </div>
                  {editingCoachId && (
                    <button onClick={resetCoachForm} className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all">
                      <X className="w-4 h-4" /> Cancel Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleCoachSubmit} className="max-w-4xl space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Coach Name</label>
                      <input type="text" required value={coachName} onChange={(e) => setCoachName(e.target.value)} placeholder="e.g. Coach Miguel" className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tagline / Specialty</label>
                      <input type="text" required value={coachTagline} onChange={(e) => setCoachTagline(e.target.value)} placeholder="e.g. Defensive Play Specialist" className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Profile Photo {editingCoachId && '(Upload new to change)'}
                      </label>

                      {currentCoachImage && !previewUrl && (
                        <div className="mb-4 flex items-center gap-4 bg-[#0B0F19] p-4 rounded-xl border border-white/10">
                           <img src={currentCoachImage} alt="Current" className="w-16 h-16 rounded-full object-cover border-2 border-cnpc-accent shadow-md shadow-cnpc-accent/20" />
                           <div>
                             <span className="text-sm font-bold text-white block">Current Profile Photo</span>
                             <span className="text-xs text-slate-500">Already formatted and saved</span>
                           </div>
                        </div>
                      )}

                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setCoachImageFile(file);
                            setPreviewUrl(URL.createObjectURL(file));
                          }
                        }} 
                        className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-cnpc-accent file:text-slate-900 cursor-pointer focus:outline-none mb-4" 
                      />
                      
                      {previewUrl && (
                        <div className="border border-white/10 rounded-2xl p-4 bg-[#0B0F19]">
                          <p className="text-xs font-bold text-cnpc-accent uppercase tracking-wider mb-2 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> Align Face in Square
                          </p>
                          <ImageCropper 
                            imageSrc={previewUrl} 
                            onCropComplete={(area) => setCroppedAreaPixels(area)} 
                            aspect={1}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Certifications / Badges</label>
                      {coachCerts.map((cert, index) => (
                        <div key={`cert-${index}`} className="flex gap-2 mb-3">
                          <input type="text" value={cert} onChange={(e) => handleArrayChange(index, e.target.value, setCoachCerts, coachCerts)} placeholder="e.g. DUPR Registered" className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cnpc-accent" />
                          <button type="button" onClick={() => removeArrayItem(index, setCoachCerts, coachCerts)} className="p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addArrayItem(setCoachCerts, coachCerts)} className="text-xs font-bold text-cnpc-accent flex items-center gap-1 mt-2 hover:underline"><Plus className="w-3 h-3"/> Add Another</button>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Resume / Achievements</label>
                      {coachAchievements.map((ach, index) => (
                        <div key={`ach-${index}`} className="flex gap-2 mb-3">
                          <input type="text" value={ach} onChange={(e) => handleArrayChange(index, e.target.value, setCoachAchievements, coachAchievements)} placeholder="e.g. Head Clinic Instructor" className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cnpc-accent" />
                          <button type="button" onClick={() => removeArrayItem(index, setCoachAchievements, coachAchievements)} className="p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addArrayItem(setCoachAchievements, coachAchievements)} className="text-xs font-bold text-cnpc-accent flex items-center gap-1 mt-2 hover:underline"><Plus className="w-3 h-3"/> Add Another</button>
                    </div>
                  </div>

                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Information</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input type="email" value={coachEmail} onChange={(e) => setCoachEmail(e.target.value)} placeholder="Email Address" className="w-full bg-[#0B0F19] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cnpc-accent" />
                      </div>
                      <div className="relative">
                        <FaFacebook className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input type="url" value={coachFacebook} onChange={(e) => setCoachFacebook(e.target.value)} placeholder="Facebook Link" className="w-full bg-[#0B0F19] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cnpc-accent" />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input type="tel" value={coachPhone} onChange={(e) => setCoachPhone(e.target.value)} placeholder="Phone Number" className="w-full bg-[#0B0F19] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cnpc-accent" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button type="submit" disabled={isCoachSubmitting} className={`px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed ${editingCoachId ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white' : 'bg-gradient-to-r from-cnpc-accent to-lime-400 text-slate-950'}`}>
                      {isCoachSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingCoachId ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />)} 
                      {isCoachSubmitting ? 'Saving...' : (editingCoachId ? 'Update Coach' : 'Add Community Coach')}
                    </button>
                  </div>
                </form>
              </div>

              {!editingCoachId && pendingCoaches.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-xl font-black text-white uppercase tracking-wide mb-6">Review Pending Applications</h2>
                  <div className="space-y-4">
                    {pendingCoaches.map((coach) => (
                      <div key={coach._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row gap-6 hover:border-white/20 transition-all">
                        <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border border-white/10"><img src={coach.image} alt="Coach" className="w-full h-full object-cover" /></div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-bold text-white uppercase">{coach.name}</h3>
                          <p className="text-sm text-cnpc-accent">{coach.tagline}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleApproveCoach(coach._id)} className="bg-green-500/10 text-green-400 px-4 py-2 rounded-lg text-sm font-bold uppercase hover:bg-green-500/20"><CheckCircle className="w-4 h-4 inline mr-2"/>Approve</button>
                          <button onClick={() => handleDeleteCoach(coach._id)} className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-sm font-bold uppercase hover:bg-red-500/20"><XCircle className="w-4 h-4 inline mr-2"/>Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-cnpc-accent" />
                  <h2 className="text-xl font-black text-white uppercase tracking-wide">Manage Active Coaches</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {approvedCoaches.length === 0 ? (
                    <p className="text-slate-500 italic">No approved coaches yet.</p>
                  ) : (
                    approvedCoaches.map((coach) => (
                      <div key={coach._id} className="bg-[#111827] border border-white/5 rounded-2xl p-4 flex gap-4 items-center group hover:border-white/20 transition-colors">
                        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-white/10"><img src={coach.image} alt={coach.name} className="w-full h-full object-cover" /></div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-white text-sm uppercase">{coach.name}</h4>
                          <p className="text-xs text-slate-400 truncate max-w-[150px]">{coach.tagline}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditCoachClick(coach)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteCoach(coach._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ==============================================
              MARKETPLACE TAB
              ============================================== */}
          {activeTab === 'marketplace' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
                <ShoppingBag className="w-8 h-8 text-cnpc-accent" />
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-wide">Pending Listings</h2>
                  <p className="text-sm text-slate-400">Review member submissions before they appear on the public storefront.</p>
                </div>
              </div>

              <div className="space-y-4">
                {pendingItems.length === 0 ? (
                  <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 p-10 backdrop-blur-sm">
                    <p className="text-slate-400 font-medium">No pending items to review. The queue is clear!</p>
                  </div>
                ) : (
                  pendingItems.map((item) => (
                    <div key={item._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row gap-6 hover:border-white/20 transition-all">
                      <div className="w-full sm:w-48 h-48 rounded-xl overflow-hidden bg-[#0A192F] shrink-0 border border-white/10">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-white line-clamp-1">{item.title}</h3>
                          <span className="text-lg font-black text-cnpc-accent ml-4">{item.price}</span>
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2 mb-4">{item.description}</p>
                        
                        <div className="space-y-1 mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                          <div>Seller: <span className="text-slate-300">{item.sellerName}</span></div>
                          <div>Contact: <span className="text-slate-300">{item.contactInfo}</span></div>
                          <div>Submitted: <span className="text-slate-300">{new Date(item.createdAt).toLocaleDateString()}</span></div>
                        </div>

                        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                          <button onClick={() => handleApproveItem(item._id)} className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 border border-green-500/20 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
                            <CheckCircle className="w-4 h-4" /> Approve Listing
                          </button>
                          <button onClick={() => handleRejectItem(item._id)} className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ==============================================
              POSTS TAB 
              ============================================== */}
          {activeTab === 'posts' && (
             <div className="animate-in fade-in duration-300">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                   {editingPostId ? 'Edit Community Post' : 'Publish Community Post'}
                 </h2>
                 {editingPostId && (
                   <button onClick={resetPostForm} className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all">
                     <X className="w-4 h-4" /> Cancel Edit
                   </button>
                 )}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
                 
                 <form onSubmit={handleSubmitPost} className="space-y-6">
                   <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Announcement Title</label>
                     <input type="text" required value={postTitle} onChange={(e) => setPostTitle(e.target.value)} placeholder="e.g. Court Maintenance Notice" className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Content</label>
                     <textarea rows="5" required value={postContent} onChange={(e) => setPostContent(e.target.value)} placeholder="Write your announcement here..." className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors resize-none"></textarea>
                   </div>

                   <div className="flex flex-col gap-4">
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Attached Images ({existingImages.length + postImages.length}/20)</label>
                     <div className="flex flex-wrap gap-4">
                       
                       {existingImages.map((imgUrl, index) => (
                         <div key={`existing-${index}`} className="relative w-32 h-20 rounded-xl overflow-hidden border border-white/20 group">
                           <img src={imgUrl} alt="Existing" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                           <div className="absolute top-1 left-1 bg-black/50 text-white text-[8px] font-black px-1.5 py-0.5 rounded">
                             {index === 0 && postImages.length === 0 ? 'Cover' : 'Saved'}
                           </div>
                           
                           <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                              {index > 0 ? (
                                <button type="button" onClick={() => moveExistingImageLeft(index)} className="p-1 bg-white/10 hover:bg-cnpc-accent hover:text-slate-900 rounded text-white transition-colors"><ChevronLeft className="w-4 h-4"/></button>
                              ) : <div className="w-6"></div>}
                              
                              <button type="button" onClick={() => handleRemoveExistingImage(index)} className="p-1 bg-white/10 hover:bg-red-500 rounded text-red-400 hover:text-white transition-colors"><Trash2 className="w-4 h-4"/></button>
                              
                              {index < existingImages.length - 1 ? (
                                <button type="button" onClick={() => moveExistingImageRight(index)} className="p-1 bg-white/10 hover:bg-cnpc-accent hover:text-slate-900 rounded text-white transition-colors"><ChevronRight className="w-4 h-4"/></button>
                              ) : <div className="w-6"></div>}
                           </div>
                         </div>
                       ))}
                       
                       {postImages.map((file, index) => (
                         <div key={`new-${index}`} className="relative w-32 h-20 rounded-xl overflow-hidden border-2 border-cnpc-accent group">
                           <img src={URL.createObjectURL(file)} alt="New upload" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                           <div className="absolute top-1 left-1 bg-cnpc-accent text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                             {index === 0 && existingImages.length === 0 ? 'Cover' : 'New'}
                           </div>
                           
                           <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                              {index > 0 ? (
                                <button type="button" onClick={() => moveNewImageLeft(index)} className="p-1 bg-white/10 hover:bg-cnpc-accent hover:text-slate-900 rounded text-white transition-colors"><ChevronLeft className="w-4 h-4"/></button>
                              ) : <div className="w-6"></div>}
                              
                              <button type="button" onClick={() => handleRemoveNewImage(index)} className="p-1 bg-white/10 hover:bg-red-500 rounded text-red-400 hover:text-white transition-colors"><Trash2 className="w-4 h-4"/></button>
                              
                              {index < postImages.length - 1 ? (
                                <button type="button" onClick={() => moveNewImageRight(index)} className="p-1 bg-white/10 hover:bg-cnpc-accent hover:text-slate-900 rounded text-white transition-colors"><ChevronRight className="w-4 h-4"/></button>
                              ) : <div className="w-6"></div>}
                           </div>
                         </div>
                       ))}
                       
                       {(existingImages.length + postImages.length) < 20 && (
                         <label className="w-32 h-20 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-cnpc-accent/50 hover:bg-white/5 transition-all group">
                           <Plus className="w-6 h-6 text-slate-400 group-hover:text-cnpc-accent mb-1" />
                           <span className="text-[10px] font-bold text-slate-400 group-hover:text-cnpc-accent uppercase tracking-wider">Add Photo</span>
                           <input type="file" className="hidden" accept="image/*" multiple onChange={handlePostImageSelect} />
                         </label>
                       )}
                     </div>
                   </div>

                   <div className="flex-1 flex items-center p-4 border border-white/10 rounded-xl bg-white/5 max-w-sm mt-4">
                     <label className="flex items-center gap-3 cursor-pointer w-full">
                       <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} className="w-5 h-5 accent-cnpc-accent bg-[#0B0F19] border-white/10 rounded" />
                       <div>
                         <div className="text-sm font-bold text-white flex items-center gap-2"><Pin className="w-4 h-4 text-cnpc-accent" /> Pin to Top</div>
                       </div>
                     </label>
                   </div>

                   <div className="pt-4 flex gap-4">
                     <button type="submit" disabled={isSubmitting} className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${editingPostId ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white' : 'bg-gradient-to-r from-cnpc-accent to-lime-400 text-slate-950'}`}>
                       {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingPostId ? <Edit3 className="w-5 h-5" /> : <Megaphone className="w-5 h-5" />)} 
                       {isSubmitting ? 'Saving...' : (editingPostId ? 'Update Post' : 'Publish Post')}
                     </button>
                   </div>
                 </form>

                 <div className="bg-[#0A192F] p-6 rounded-3xl border border-white/10 shadow-2xl h-fit sticky top-24 hidden sm:block">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                     <ImageIcon className="w-4 h-4 text-cnpc-accent"/> Live Post Preview
                   </h3>

                   <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg">
                     <div className="flex items-center gap-2 mb-3">
                       {isPinned && <Pin className="w-4 h-4 text-cnpc-accent shrink-0" />}
                       <h4 className="font-bold text-lg text-white break-words">
                         {postTitle || 'Your Announcement Title'}
                       </h4>
                     </div>
                     <p className="text-sm text-slate-300 whitespace-pre-wrap break-words mb-4 leading-relaxed">
                       {postContent || 'Start typing to see your announcement text here...'}
                     </p>

                     {(existingImages.length > 0 || postImages.length > 0) && (
                       <div className="grid grid-cols-2 gap-2 mt-4">
                         {existingImages.map((img, i) => (
                           <img key={`prev-ext-${i}`} src={img} className="w-full h-24 object-cover rounded-xl border border-white/10" alt="Preview" />
                         ))}
                         {postImages.map((file, i) => (
                           <img key={`prev-new-${i}`} src={URL.createObjectURL(file)} className="w-full h-24 object-cover rounded-xl border border-white/10" alt="Preview" />
                         ))}
                       </div>
                     )}

                     <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       {new Date().toLocaleDateString()} • CNPC Admin
                     </div>
                   </div>
                 </div>

               </div>

               <div className="pt-10 border-t border-white/10">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                   <h2 className="text-xl font-black text-white uppercase tracking-wide">Manage Published Posts</h2>
                   <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                     <ArrowDownUp className="w-4 h-4 text-slate-400" />
                     <select value={postSortOrder} onChange={(e) => setPostSortOrder(e.target.value)} className="bg-transparent text-sm font-bold text-slate-300 focus:outline-none uppercase tracking-wider cursor-pointer">
                       <option value="newest" className="bg-[#0A192F]">Newest First</option>
                       <option value="oldest" className="bg-[#0A192F]">Oldest First</option>
                     </select>
                   </div>
                 </div>

                 <div className="space-y-4">
                   {sortedPosts.length === 0 ? (
                     <p className="text-slate-500 italic">No posts published yet.</p>
                   ) : (
                     sortedPosts.map((post) => (
                       <div key={post._id} className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row justify-between gap-4 group hover:border-white/20 transition-all">
                         <div className="flex-grow">
                           <div className="flex items-center gap-2 mb-1">
                             {post.isPinned && <Pin className="w-3 h-3 text-cnpc-accent" />}
                             <h4 className="font-bold text-white">{post.title}</h4>
                           </div>
                           <p className="text-sm text-slate-400 line-clamp-2 mb-3">{post.content}</p>
                           <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                             {new Date(post.createdAt).toLocaleDateString()} • {post.images?.length || 0} Images
                           </div>
                         </div>
                         
                         <div className="flex items-center shrink-0 gap-2">
                           <button onClick={() => handleEditPostClick(post)} className="p-3 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors border border-transparent hover:border-blue-400/20" title="Edit Post">
                             <Edit3 className="w-5 h-5" />
                           </button>
                           <button onClick={() => handleDeletePost(post._id)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20" title="Delete Post">
                             <Trash2 className="w-5 h-5" />
                           </button>
                         </div>
                       </div>
                     ))
                   )}
                 </div>
               </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Admin;