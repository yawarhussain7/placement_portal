import React, { useState } from 'react';
import { FiCheckCircle, FiLock, FiMail } from 'react-icons/fi';
import SettingsCardLayout from '../../layout/SettingsCardLayout';
import InputField from './InputField';

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

  return (
    <SettingsCardLayout
      title="Security Settings"
      description="Update your account login credentials, contact email, and security passphrase"
    >
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

      {/* Action Footer */}
      <div className="flex justify-end pt-3 border-t border-gray-50">
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold rounded-lg transition-colors shadow-sm focus:outline-none cursor-pointer">
          <FiCheckCircle className="w-3.5 h-3.5" />
          Update Credentials
        </button>
      </div>
    </SettingsCardLayout>
  );
};

export default SecuritySection;