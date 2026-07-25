import { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Link as LinkIcon, Calendar, Mail, User, Globe, Check, X, Loader2, Verified, Phone } from 'lucide-react';
import { usePortalData } from '../../context/PortalDataContext';
import { updateProfile, getAvatarUrl } from '../../Api/profileApi.js';

const ProfileContent = () => {
  const { data, updateAccount, profileLoaded } = usePortalData();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: data.account.fullName,
    username: data.account.username || 'alexmorgan',
    bio: data.account.bio || 'Senior Full Stack Developer & UI Designer. Building open-source tools and exploring the future of modular web applications. 🚀',
    email: data.account.email || 'alex.morgan@example.com',
    phone: data.account.phone || '+61 412 345 678',
    location: 'San Francisco, CA',
    website: data.account.website || 'https://alexmorgan.dev',
    joinedDate: 'Joined March 2022',
    avatar: getAvatarUrl(data.account.avatar) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200&h=400',
    stats: [
      { label: 'Projects', value: '42', icon: 'folder' },
      { label: 'Followers', value: '12.5k', icon: 'users' },
      { label: 'Following', value: '842', icon: 'user' },
    ],
  });
  const [draft, setDraft] = useState(profile);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const avatarRef = useRef(null);
  const coverRef = useRef(null);

  // Update profile when context data changes
  useEffect(() => {
    if (data.account.fullName) {
      const updatedProfile = {
        ...profile,
        name: data.account.fullName || profile.name,
        username: data.account.username || profile.username,
        email: data.account.email || profile.email,
        phone: data.account.phone || profile.phone,
        bio: data.account.bio || profile.bio,
        website: data.account.website || profile.website,
        avatar: getAvatarUrl(data.account.avatar) || profile.avatar,
      };
      setProfile(updatedProfile);
      setDraft(updatedProfile);
    }
  }, [data.account]);

  const set = field => val => setDraft(p => ({ ...p, [field]: val }));

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      set('avatar')(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = e => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      set('cover')(URL.createObjectURL(file));
    }
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      
      if (draft.name !== profile.name) formData.append('fullName', draft.name);
      if (draft.username !== profile.username) formData.append('username', draft.username);
      if (draft.email !== profile.email) formData.append('email', draft.email);
      if (draft.phone !== profile.phone) formData.append('phone', draft.phone);
      if (draft.bio !== profile.bio) formData.append('bio', draft.bio);
      if (draft.website !== profile.website) formData.append('website', draft.website);

      const response = await updateProfile(formData);
      
      if (response?.data?.success && response?.data?.data) {
        const updatedData = response.data.data;
        
        const updatedProfile = {
          ...profile,
          name: updatedData.fullName || draft.name,
          username: updatedData.username || draft.username,
          bio: updatedData.bio || draft.bio,
          website: updatedData.website || draft.website,
          avatar: updatedData.avatar || profile.avatar,
        };
        
        setProfile(updatedProfile);
        setDraft(updatedProfile);
        
        updateAccount({
          ...data.account,
          fullName: updatedData.fullName,
          email: updatedData.email,
          avatar: updatedData.avatar,
          bio: updatedData.bio,
          username: updatedData.username,
          phone: updatedData.phone,
          website: updatedData.website,
        });
      }

      setEditing(false);
      setAvatarFile(null);
      setCoverFile(null);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  const getStatIcon = (iconType) => {
    if (iconType === 'folder') {
      return (
        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
      );
    } else if (iconType === 'users') {
      return (
        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      );
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">

      {/* Cover Image */}
      <div className="relative h-48 sm:h-60 bg-gray-100">
        <img src={editing ? draft.cover : profile.cover} alt="Cover" className="w-full h-full object-cover" />
        {editing && (
          <>
            <button type="button" onClick={() => coverRef.current.click()}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors">
              <Camera size={18} />
            </button>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          </>
        )}
      </div>

      {/* Profile Content */}
      <form onSubmit={handleSave} className="px-6 pb-6 relative">

        {/* Avatar + Edit button */}
        <div className="flex justify-between items-end -mt-16 sm:-mt-20 mb-4">
          <div className="relative group ring-4 ring-white rounded-full overflow-hidden bg-white">
            <img src={editing ? draft.avatar : profile.avatar} alt={profile.name}
              className="w-28 h-28 sm:w-36 sm:h-36 object-cover" />
            {editing && (
              <>
                <div onClick={() => avatarRef.current.click()}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={24} />
                </div>
                <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </>
            )}
          </div>

          {editing ? (
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleCancel}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm rounded-xl transition-all shadow-sm">
                <X size={14} /> Cancel
              </button>
              <button type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-all shadow-sm">
                <Check size={14} /> Save
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => { setDraft(profile); setEditing(true); }}
              className="px-5 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm rounded-lg transition-all shadow-sm">
              Edit Profile
            </button>
          )}
        </div>

        {/* Name & Username */}
        {editing ? (
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Full Name <span className="text-red-500">*</span></label>
              <input required value={draft.name} onChange={e => set('name')(e.target.value)} placeholder="Full name"
                className="w-full max-w-sm px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-800" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Username <span className="text-red-500">*</span></label>
              <div className="flex items-center w-full max-w-sm border border-gray-200 rounded-lg overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <span className="px-3 py-2 text-sm text-gray-400 bg-gray-50 border-r border-gray-200">@</span>
                <input required value={draft.username} onChange={e => set('username')(e.target.value)} placeholder="username"
                  className="w-full px-3 py-2 text-sm focus:outline-none focus:ring-0 text-gray-800" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Email <span className="text-red-500">*</span></label>
              <div className="flex items-center w-full max-w-sm border border-gray-200 rounded-lg overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <span className="px-3 py-2 bg-gray-50 border-r border-gray-200"><Mail size={14} className="text-gray-400" /></span>
                <input required type="email" value={draft.email} onChange={e => set('email')(e.target.value)} placeholder="your@email.com"
                  className="w-full px-3 py-2 text-sm focus:outline-none focus:ring-0 text-gray-800" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Phone</label>
              <div className="flex items-center w-full max-w-sm border border-gray-200 rounded-lg overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <span className="px-3 py-2 bg-gray-50 border-r border-gray-200"><Phone size={14} className="text-gray-400" /></span>
                <input type="tel" value={draft.phone} onChange={e => set('phone')(e.target.value)} placeholder="+1 234 567 8900"
                  className="w-full px-3 py-2 text-sm focus:outline-none focus:ring-0 text-gray-800" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1 mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{profile.name}</h1>
              <Verified size={20} className="text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-gray-400">@{profile.username}</p>
          </div>
        )}

        {/* Bio */}
        {editing ? (
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-xs font-semibold text-gray-500">Bio</label>
            <textarea value={draft.bio} onChange={e => set('bio')(e.target.value)} rows={3} placeholder="Write something about yourself..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-800 resize-y" />
          </div>
        ) : (
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5 max-w-xl">{profile.bio}</p>
        )}

        {/* Location, Website, Joined */}
        {editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Location</label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <span className="px-3 py-2 bg-gray-50 border-r border-gray-200"><MapPin size={14} className="text-gray-400" /></span>
                <input value={draft.location} onChange={e => set('location')(e.target.value)} placeholder="City, Country"
                  className="w-full px-3 py-2 text-sm focus:outline-none focus:ring-0 text-gray-800" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Website</label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <span className="px-3 py-2 bg-gray-50 border-r border-gray-200"><LinkIcon size={14} className="text-gray-400" /></span>
                <input type="url" value={draft.website} onChange={e => set('website')(e.target.value)} placeholder="https://yoursite.com"
                  className="w-full px-3 py-2 text-sm focus:outline-none focus:ring-0 text-gray-800" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-1.5">
              <Mail size={16} className="text-gray-400" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone size={16} className="text-gray-400" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={16} className="text-gray-400" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <LinkIcon size={16} className="text-gray-400" />
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {profile.website.replace('https://', '')}
              </a>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={16} className="text-gray-400" />
              <span>{profile.joinedDate}</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {profile.stats.map((stat, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-3">
              {getStatIcon(stat.icon)}
              <div>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3">
          <button type="button" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <Mail size={18} />
          </button>
          <button type="button" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <User size={18} />
          </button>
          <button type="button" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <Globe size={18} />
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProfileContent;