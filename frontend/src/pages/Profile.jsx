import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Settings, MapPin, Calendar, Tag, Save, UserCircle, Cake, Hash, Users, Camera, LogOut, ShieldCheck } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Profile = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState({
    name: "",
    clubId: "", 
    location: "",
    birthDate: "",
    age: "",
    gender: "",
    joined: "May 2026", 
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Holds the actual file for the backend
  const [isEditing, setIsEditing] = useState(true);

  const myListings = [];

  // =========================================
  // FETCH DATA FROM MONGODB ON LOAD
  // =========================================
  useEffect(() => {
    const fetchProfile = async () => {
      if (user && token) {
        try {
          const res = await fetch(`${API_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUserProfile({
              name: data.fullName || user.fullName || "",
              clubId: data.clubId || "",
              location: data.location || "",
              birthDate: data.birthDate || "",
              age: calculateAge(data.birthDate) || "",
              gender: data.gender || "",
              joined: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "May 2026"
            });
            setAvatarPreview(data.profileImage || null);
            
            // If they already generated an ID, skip the edit screen
            if (data.clubId) setIsEditing(false);
          }
        } catch (error) {
          console.error("Failed to fetch profile");
        }
      }
    };
    fetchProfile();
  }, [user, token]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col items-center justify-center px-6 text-center">
        <UserCircle className="w-20 h-20 text-slate-600 mb-6" />
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
          Access Restricted
        </h1>
        <p className="text-slate-400 text-lg max-w-md mb-8">
          You must log in to your account to create an official CNPC Digital ID and manage your marketplace listings.
        </p>
        <button 
          onClick={() => navigate('/auth')} 
          className="bg-gradient-to-r from-cnpc-accent to-lime-400 text-slate-950 px-10 py-4 rounded-full font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(196,214,0,0.3)]"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === 'name' || name === 'location') {
      updatedValue = value.toUpperCase();
    }

    const updatedUser = { ...userProfile, [name]: updatedValue };

    if (name === 'birthDate') {
      updatedUser.age = calculateAge(updatedValue);
    }

    setUserProfile(updatedUser);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Save file for the FormData upload
      setAvatarPreview(URL.createObjectURL(file)); // Show temporary local preview
    }
  };

  // =========================================
  // SAVE DATA TO MONGODB (WITH CLOUDINARY)
  // =========================================
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const currentYear = new Date().getFullYear();
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const generatedId = userProfile.clubId || `CNPC-${currentYear}-${randomDigits}`;
    
    try {
      // Use FormData to support file uploads
      const formData = new FormData();
      formData.append('name', userProfile.name);
      formData.append('location', userProfile.location);
      formData.append('birthDate', userProfile.birthDate);
      formData.append('gender', userProfile.gender);
      formData.append('clubId', generatedId);
      
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        body: formData
      });

      if (res.ok) {
        const updatedData = await res.json();
        setUserProfile({ ...userProfile, clubId: generatedId });
        setAvatarPreview(updatedData.profileImage); // Use the permanent Cloudinary URL
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans pt-36 pb-20 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        
        {isEditing ? (
          /* =========================================
             1. ONBOARDING / EDIT PROFILE FORM
             ========================================= */
          <div className="bg-[#111827] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl mb-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-6 border-b border-white/5 text-center md:text-left">
              
              <label className="relative cursor-pointer group flex items-center justify-center w-24 h-24 rounded-full border-2 border-dashed border-slate-500 bg-white/5 hover:border-cnpc-accent hover:bg-cnpc-accent/5 transition-all overflow-hidden shrink-0">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-slate-400 group-hover:text-cnpc-accent transition-colors" />
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>

              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Complete Your Profile</h2>
                <p className="text-slate-400 text-sm mt-1">Upload a photo and enter your details to generate your Digital ID.</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    required 
                    name="name"
                    value={userProfile.name}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="E.G. JUAN DE LA CRUZ" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white uppercase focus:outline-none focus:border-cnpc-accent transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Location / City</label>
                  <input 
                    required 
                    name="location"
                    value={userProfile.location}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="E.G. DAET, CAMARINES NORTE" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white uppercase focus:outline-none focus:border-cnpc-accent transition-colors" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Birth Date</label>
                  <input 
                    required 
                    name="birthDate"
                    value={userProfile.birthDate}
                    onChange={handleInputChange}
                    type="date" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors [color-scheme:dark]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Age</label>
                  <input 
                    readOnly
                    name="age"
                    value={userProfile.age}
                    type="number" 
                    placeholder="Auto-calculated" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
                  <select 
                    required 
                    name="gender"
                    value={userProfile.gender}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cnpc-accent transition-colors appearance-none"
                  >
                    <option value="" disabled>SELECT GENDER</option>
                    <option value="MALE" className="bg-[#111827]">MALE</option>
                    <option value="FEMALE" className="bg-[#111827]">FEMALE</option>
                    <option value="OTHER" className="bg-[#111827]">OTHER</option>
                    <option value="PREFER NOT TO SAY" className="bg-[#111827]">PREFER NOT TO SAY</option>
                  </select>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-4 gap-4">
                <button type="button" onClick={handleLogout} className="w-full sm:w-auto border border-red-500/20 text-red-400 hover:bg-red-500/10 px-8 py-4 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
                
                <button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-cnpc-accent to-lime-400 text-slate-950 px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" />
                  Save & Generate ID
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* =========================================
             2. DIGITAL ID CARD & LISTINGS (VIEW MODE)
             ========================================= */
          <>
            {user.role === 'admin' && (
               <div className="mb-6 flex justify-end animate-in fade-in duration-500">
                 <button onClick={() => navigate('/admin')} className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-6 py-3 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center gap-2">
                   <ShieldCheck className="w-5 h-5" /> Open Admin Dashboard
                 </button>
               </div>
            )}

            <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl mb-8 group animate-in fade-in duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cnpc-accent/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-cnpc-accent/20 transition-all duration-700"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                
                <div className="relative shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-cnpc-accent/30 overflow-hidden shadow-[0_0_20px_rgba(196,214,0,0.2)] bg-black/50 flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt={userProfile.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-16 h-16 text-slate-600" />
                    )}
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-white/5">
                    ID: {userProfile.clubId}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                    {userProfile.name}
                  </h1>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex flex-col items-center md:items-start gap-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Age</span>
                      <div className="flex items-center gap-1.5 text-slate-200 text-sm font-bold">
                        <Hash className="w-4 h-4 text-cnpc-accent" />
                        {userProfile.age} YRS
                      </div>
                    </div>
                    <div className="flex flex-col items-center md:items-start gap-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gender</span>
                      <div className="flex items-center gap-1.5 text-slate-200 text-sm font-bold uppercase">
                        <Users className="w-4 h-4 text-cnpc-accent" />
                        {userProfile.gender}
                      </div>
                    </div>
                    <div className="flex flex-col items-center md:items-start gap-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">DOB</span>
                      <div className="flex items-center gap-1.5 text-slate-200 text-sm font-bold">
                        <Cake className="w-4 h-4 text-cnpc-accent" />
                        {new Date(userProfile.birthDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex flex-col items-center md:items-start gap-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Joined</span>
                      <div className="flex items-center gap-1.5 text-slate-200 text-sm font-bold">
                        <Calendar className="w-4 h-4 text-cnpc-accent" />
                        {userProfile.joined}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 font-medium text-sm border-t border-white/10 pt-4 mt-2">
                    <MapPin className="w-4 h-4 text-cnpc-accent" />
                    {userProfile.location}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-white/5"
                  >
                    <Settings className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button onClick={handleLogout} className="flex-1 md:flex-none w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-red-500/20">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 animate-in fade-in duration-500 delay-100">
              
              {/* FIXED: Using responsive flex-col to stack button on mobile, preventing overlap */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-cnpc-accent shrink-0" />
                  <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider leading-tight">My Marketplace Listings</h2>
                </div>
                <button onClick={() => navigate('/marketplace')} className="text-xs sm:text-sm font-bold text-cnpc-accent hover:text-white uppercase tracking-wider transition-colors shrink-0">
                  Go to Marketplace &rarr;
                </button>
              </div>

              <div>
                {myListings.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {myListings.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors gap-6">
                        <div className="flex-1 text-center sm:text-left">
                          <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                          <div className="flex items-center justify-center sm:justify-start gap-4 text-sm font-medium">
                            <span className="text-cnpc-accent">{item.price}</span>
                            <span className="text-slate-500">·</span>
                            <span className="text-slate-400">{item.views} Views</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <div className="flex-1 sm:flex-none px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-xs font-bold uppercase tracking-widest text-center">
                            {item.status}
                          </div>
                          <button className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition-colors border border-white/10">
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    You haven't listed any items for sale yet.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;