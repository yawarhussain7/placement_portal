import { useState, useRef } from 'react';
import { Camera, MapPin, Link as LinkIcon, Calendar, Mail, User, Globe, Check, X, Loader2 } from 'lucide-react';
import { usePortalData } from '../../context/PortalDataContext';
import { updateProfile } from '../../Api/profileApi.js';

const ProfileContent = () => {
  const { data, updateAccount } = usePortalData();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: data.account.fullName,
    username: 'alexmorgan',
    bio: data.account.bio || 'Senior Full Stack Developer & UI Designer. Building open-source tools and exploring the future of modular web applications. 🚀',
    location: 'San Francisco, CA',
    website: 'https://alexmorgan.dev',
    joinedDate: 'Joined March 2022',
    avatar: data.account.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200&h=400',
    stats: [
      { label: 'Projects', value: '42' },
      { label: 'Followers', value: '12.5k' },
      { label: 'Following', value: '842' },
    ],
  });
  const [draft, setDraft] = useState(profile);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const avatarRef = useRef(null);
  const coverRef = useRef(null);

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
      // Get userId from the token or localStorage
      const token = localStorage.getItem('auth_token');
      let userId = null;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.id;
        } catch {}
      }

      let savedAvatar = profile.avatar; // keep the old avatar by default

      if (userId) {
        const formData = new FormData();
        if (avatarFile) formData.append('avatar', avatarFile);
        if (draft.name !== profile.name) formData.append('username', draft.name);
        if (draft.bio !== profile.bio) formData.append('bio', draft.bio);

        const response = await updateProfile(userId, formData);
        if (response?.data?.success && response?.data?.data?.avatar) {
          // Use the real URL returned from the server for persistence
          savedAvatar = response.data.data.avatar;
        }
      }

      // If no new avatar was uploaded, keep the old one
      const finalAvatar = avatarFile ? savedAvatar : draft.avatar;

      setProfile(prev => ({ ...prev, avatar: finalAvatar }));
      updateAccount({ ...data.account, fullName: draft.name, avatar: finalAvatar, bio: draft.bio });
      setEditing(false);
      setAvatarFile(null);
    } catch (error) {
      console.error('Failed to save profile:', error);
      // Still update locally even if API fails — use the blob URL as fallback
      setProfile(draft);
      updateAccount({ ...data.account, fullName: draft.name, avatar: draft.avatar, bio: draft.bio });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  return (
    <form onSubmit={handleSave} className="w-full bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

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
      <div className="px-6 pb-6 relative">

        {/* Avatar + Edit/Save buttons */}
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
                className="flex items-center gap-1.5 px-4 py-2 bg-[#12692e] hover:bg-emerald-800 text-white font-medium text-sm rounded-xl transition-all shadow-sm">
                <Check size={14} /> Save
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => { setDraft(profile); setEditing(true); }}
              className="px-5 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium text-sm rounded-xl transition-all shadow-sm active:scale-95">
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
                className="w-full max-w-sm px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 text-gray-800" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Username <span className="text-red-500">*</span></label>
              <div className="flex items-center w-full max-w-sm border border-gray-200 rounded-lg overflow-hidden focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600">
                <span className="px-3 py-2 text-sm text-gray-400 bg-gray-50 border-r border-gray-200">@</span>
                <input required value={draft.username} onChange={e => set('username')(e.target.value)} placeholder="username"
                  className="w-full px-3 py-2 text-sm focus:outline-none focus:ring-0 text-gray-800" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{profile.name}</h1>
            <p className="text-sm font-medium text-gray-400">@{profile.username}</p>
          </div>
        )}

        {/* Bio */}
        {editing ? (
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-xs font-semibold text-gray-500">Bio</label>
            <textarea value={draft.bio} onChange={e => set('bio')(e.target.value)} rows={3} placeholder="Write something about yourself..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 text-gray-800 resize-y" />
          </div>
        ) : (
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5 max-w-xl">{profile.bio}</p>
        )}

        {/* Location, Website, Joined */}
        {editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Location</label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600">
                <span className="px-3 py-2 bg-gray-50 border-r border-gray-200"><MapPin size={14} className="text-gray-400" /></span>
                <input value={draft.location} onChange={e => set('location')(e.target.value)} placeholder="City, Country"
                  className="w-full px-3 py-2 text-sm focus:outline-none focus:ring-0 text-gray-800" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Website</label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600">
                <span className="px-3 py-2 bg-gray-50 border-r border-gray-200"><LinkIcon size={14} className="text-gray-400" /></span>
                <input type="url" value={draft.website} onChange={e => set('website')(e.target.value)} placeholder="https://yoursite.com"
                  className="w-full px-3 py-2 text-sm focus:outline-none focus:ring-0 text-gray-800" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500 mb-6">
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

        {/* Stats + Social */}
        <div className="pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex gap-6">
            {profile.stats.map((stat, i) => (
              <div key={i} className="flex gap-1.5 items-baseline text-sm">
                <span className="font-bold text-gray-900 text-base">{stat.value}</span>
                <span className="text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <button type="button" className="p-2 hover:bg-gray-50 hover:text-gray-700 rounded-lg transition-colors"><Mail size={18} /></button>
            <button type="button" className="p-2 hover:bg-gray-50 hover:text-gray-700 rounded-lg transition-colors"><User size={18} /></button>
            <button type="button" className="p-2 hover:bg-gray-50 hover:text-gray-700 rounded-lg transition-colors"><Globe size={18} /></button>
          </div>
        </div>

      </div>
    </form>
  );
};

export default ProfileContent;
