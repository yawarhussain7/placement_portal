import React, { useState, useEffect, useRef } from 'react';
import { FiCamera, FiCheckCircle, FiInfo } from 'react-icons/fi';
import SettingsCardLayout from '../../layout/SettingsCardLayout';
import InputField from './InputField';
import { getProfile, updateProfile } from '../../api/settings.js';

const ProfileSection = () => {
  const [profileForm, setProfileForm] = useState({
    fullName: 'Admin User',
    email: 'admin@university.edu',
    phone: '+91 98200 00001',
    role: 'Super Admin',
    department: 'Academic Affairs',
    employeeId: 'EMP-2026-8891'
  });

  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        
        if (response.success && response.data) {
          const data = response.data;
          setProfileForm({
            fullName: data.fullName || data.username || 'Admin User',
            email: data.email || 'admin@university.edu',
            phone: data.phone || '+91 98200 00001',
            role: data.role || 'Super Admin',
            department: data.department || 'Academic Affairs',
            employeeId: data.employeeId || 'EMP-2026-8891'
          });
          if (data.avatar) {
            setAvatar(data.avatar);
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await updateProfile({
        fullName: profileForm.fullName,
        email: profileForm.email,
        phone: profileForm.phone
      });
      console.log('Profile saved successfully');
    } catch (err) {
      console.error('Failed to save profile:', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsCardLayout
      title="Administrative Profile"
      description="Manage your system identity credentials, contact channels, and system permissions"
    >
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-sm text-gray-400">Loading profile...</div>
          </div>
        ) : (
          <>
            {/* Profile Avatar Upload Block */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
              <div className="relative group shrink-0">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt="Profile Avatar" 
                    className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-sm ring-1 ring-gray-100"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-600 shadow-inner">
                    {profileForm.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                )}
                
                {/* Interactive Overlay Button */}
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="absolute inset-0 bg-black/40 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                  <FiCamera className="w-5 h-5" />
                </button>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <div className="text-center sm:text-left space-y-1">
                <h3 className="text-xs font-bold text-gray-800">Profile Picture</h3>
                <p className="text-[11px] text-gray-400 font-medium max-w-sm leading-relaxed">
                  Upload a clear square portrait picture. Supported formats are PNG or JPEG up to a maximum file limit of 2MB.
                </p>
                <div className="flex justify-center sm:justify-start gap-3 pt-1">
                  <button 
                    type="button" 
                    onClick={triggerFileInput}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors focus:outline-none"
                  >
                    Upload Photo
                  </button>
                  {avatar && (
                    <button 
                      type="button" 
                      onClick={() => setAvatar(null)}
                      className="text-[11px] font-bold text-red-500 hover:text-red-600 transition-colors focus:outline-none"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Section 1: Personal Credentials Grid */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-50 pb-1">
                Identity & Communication
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Full Name" name="fullName" value={profileForm.fullName} onChange={handleProfileChange} />
                <InputField label="Email Address" type="email" name="email" value={profileForm.email} onChange={handleProfileChange} />
                <InputField label="Phone Number" name="phone" value={profileForm.phone} onChange={handleProfileChange} />
                <InputField label="Department" name="department" value={profileForm.department} onChange={handleProfileChange} />
              </div>
            </div>

            {/* Section 2: Administrative Guarded System Parameters */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-1.5 border-b border-gray-50 pb-1">
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                  System Authorization
                </h4>
                <span className="flex items-center gap-0.5 text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded-full">
                  <FiInfo className="w-2.5 h-2.5" /> Read-Only
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/30 p-3 rounded-xl border border-gray-100/50">
                <InputField label="System Role Profile" name="role" value={profileForm.role} disabled />
                <InputField label="Institutional Employee ID" name="employeeId" value={profileForm.employeeId} disabled />
              </div>
              <p className="text-[10px] text-gray-400 font-medium pl-1">
                System authorization parameters are governed by IT operations and cannot be modified locally.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Action Footer Bar */}
      <div className="flex justify-end pt-3 border-t border-gray-50">
        <button 
          onClick={handleSaveProfile} 
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm shadow-emerald-600/10 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiCheckCircle className="w-3.5 h-3.5" />
          {saving ? 'Saving...' : 'Save Configurations'}
        </button>
      </div>
    </SettingsCardLayout>
  );
};

export default ProfileSection;