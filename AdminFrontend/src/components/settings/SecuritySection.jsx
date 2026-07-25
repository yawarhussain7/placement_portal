import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiLock, FiMail } from 'react-icons/fi';
import SettingsCardLayout from '../../layout/SettingsCardLayout';
import InputField from './InputField';
import { getProfile, updateSecurity } from '../../api/settings.js';

const SecuritySection = () => {
  const [emailForm, setEmailForm] = useState({
    currentEmail: 'admin@university.edu',
    newEmail: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        
        if (response.success && response.data) {
          const data = response.data;
          setEmailForm({
            currentEmail: data.email || 'admin@university.edu',
            newEmail: ''
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateCredentials = async () => {
    try {
      setSaving(true);
      
      // Update email if changed
      if (emailForm.newEmail && emailForm.newEmail !== emailForm.currentEmail) {
        await updateSecurity({ email: emailForm.newEmail });
      }
      
      // Update password if provided
      if (passwordForm.newPassword) {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          alert('Passwords do not match');
          return;
        }
        await updateSecurity({ password: passwordForm.newPassword });
      }
      
      console.log('Credentials updated successfully');
      // Reset forms
      setEmailForm({ ...emailForm, newEmail: '' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Failed to update credentials:', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsCardLayout
      title="Security Settings"
      description="Update your account login credentials, contact email, and security passphrase"
    >
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-sm text-gray-400">Loading security settings...</div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Email Credentials Block */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
              <FiMail className="w-3.5 h-3.5 text-gray-400" />
              <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                Email Address Alignment
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/50 border border-gray-100 rounded-xl p-4">
              <InputField 
                label="Current Email Address" 
                value={emailForm.currentEmail} 
                disabled 
              />
              <InputField 
                label="New Email Address" 
                type="email" 
                placeholder="Enter new system email"
                value={emailForm.newEmail}
                onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
              />
            </div>
          </div>

          {/* Password Management Block */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
              <FiLock className="w-3.5 h-3.5 text-gray-400" />
              <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                Passphrase Updates
              </h4>
            </div>
            <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 space-y-4">
              <div className="max-w-sm">
                <InputField 
                  label="Current Password" 
                  type="password" 
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField 
                  label="New Password" 
                  type="password" 
                  placeholder="Minimum 8 characters"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
                <InputField 
                  label="Confirm New Password" 
                  type="password" 
                  placeholder="Re-enter new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Action Footer */}
      <div className="flex justify-end pt-3 border-t border-gray-50">
        <button 
          onClick={handleUpdateCredentials} 
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiCheckCircle className="w-3.5 h-3.5" />
          {saving ? 'Updating...' : 'Update Credentials'}
        </button>
      </div>
    </SettingsCardLayout>
  );
};

export default SecuritySection;