import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar'; 
import Header from '../components/common/Header';    
import SettingsNavigation from '../components/settings/SettingsNavigation';

// Reusable Atomic Layout Primitives
import MetricCard from '../components/settings/MetricCard';
import InputField from '../components/settings/InputField';
import SelectField from '../components/settings/SelectField';
import SwitchControl from '../components/settings/SwitchControl';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [activeSection, setActiveSection] = useState('profile');

  // Input States matching form fields in SettingsPage.jpg
  const [profileForm, setProfileForm] = useState({
    fullName: 'Admin User',
    email: 'admin@university.edu',
    phone: '+91 98200 00001',
    role: 'Super Admin'
  });

  // Toggle states matching UI switch configs
  const [notifications, setNotifications] = useState({
    newApplication: true,
    documentUpload: true,
    placementDrive: false,
    weeklySummary: true,
    profileUpdates: false,
  });

  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30 minutes');

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleNotificationToggle = (key, val) => {
    setNotifications(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Platform Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Structural Context Header */}
        <Header />

        <main className="flex-1 p-8 space-y-6 overflow-y-auto max-w-[1600px] w-full mx-auto custom-scrollbar">
          
          {/* Main Top Header Line Row */}
          <div className="border-b border-gray-100 pb-2">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Settings</h1>
            <p className="text-xs font-medium text-gray-400 mt-0.5">Configure admin panel preferences and system options</p>
          </div>

          {/* Master 2-Column Responsive Split Content Grid Layout */}
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Left Hand Navigation Card Component Link Menu */}
            <SettingsNavigation activeSection={activeSection} setActiveSection={setActiveSection} />

            {/* Right Hand Settings Workspaces Section Wrapper */}
            <div className="flex-1 space-y-6 max-w-4xl">
              
              {/* SECTION 1: Admin Profile Configuration Form */}
              <MetricCard
                title="Admin Profile" 
                description="Update your personal information and contact details"
              >
                <div className="flex flex-col sm:flex-row items-start gap-6 pt-1">
                  {/* Photo Workspace Segment */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl font-bold text-[#22C55E]">
                      A
                    </div>
                    <button type="button" className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 mt-2 transition-colors">
                      Change Photo
                    </button>
                  </div>

                  {/* Form Grid Structure Data Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
                    <InputField 
                      label="Full Name" 
                      name="fullName" 
                      value={profileForm.fullName} 
                      onChange={handleProfileChange} 
                    />
                    <InputField 
                      label="Email Address" 
                      type="email" 
                      name="email" 
                      value={profileForm.email} 
                      onChange={handleProfileChange} 
                    />
                    <InputField 
                      label="Phone Number" 
                      name="phone" 
                      value={profileForm.phone} 
                      onChange={handleProfileChange} 
                    />
                    <InputField 
                      label="Role" 
                      name="role" 
                      value={profileForm.role} 
                      disabled 
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button className="px-4 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold rounded-lg transition-colors shadow-sm shadow-emerald-500/10">
                    Save Changes
                  </button>
                </div>
              </MetricCard>


              {/* SECTION 2: Notification Preferences Layout */}
              <MetricCard
                title="Notification Preferences" 
                description="Choose how and when you receive alerts"
              >
                <div className="divide-y divide-gray-50 -mt-2">
                  <SwitchControl 
                    title="New Application Alert" 
                    description="Notify when a student submits a new application" 
                    checked={notifications.newApplication}
                    onChange={(val) => handleNotificationToggle('newApplication', val)}
                  />
                  <SwitchControl 
                    title="Document Upload Alert" 
                    description="Notify when a student uploads a document" 
                    checked={notifications.documentUpload}
                    onChange={(val) => handleNotificationToggle('documentUpload', val)}
                  />
                  <SwitchControl 
                    title="Placement Drive Reminder" 
                    description="Remind 24 hours before an upcoming drive" 
                    checked={notifications.placementDrive}
                    onChange={(val) => handleNotificationToggle('placementDrive', val)}
                  />
                  <SwitchControl 
                    title="Weekly Summary Email" 
                    description="Receive a weekly digest of placement activity" 
                    checked={notifications.weeklySummary}
                    onChange={(val) => handleNotificationToggle('weeklySummary', val)}
                  />
                  <SwitchControl 
                    title="Student Profile Updates" 
                    description="Notify when a student edits their profile" 
                    checked={notifications.profileUpdates}
                    onChange={(val) => handleNotificationToggle('profileUpdates', val)}
                  />
                </div>
              </MetricCard>


              {/* SECTION 3: Global System Security Configuration Panel */}
              <MetricCard
                title="Security" 
                description="Manage password and access controls"
              >
                <div className="divide-y divide-gray-50 -mt-2">
                  <SwitchControl 
                    title="Two-Factor Authentication" 
                    description="Add an extra layer of security to your account" 
                    checked={twoFactor}
                    onChange={setTwoFactor}
                  />

                  <SelectField 
                    title="Session Timeout"
                    description="Auto-logout after inactivity"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    options={[
                      { value: "15 minutes", label: "15 minutes" },
                      { value: "30 minutes", label: "30 minutes" },
                      { value: "1 hour", label: "1 hour" },
                      { value: "4 hours", label: "4 hours" }
                    ]}
                  />

                  <div className="flex items-center justify-between py-4 text-xs font-medium text-gray-600 gap-4">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-gray-800 tracking-tight">Change Password</h4>
                      <p className="text-[11px] text-gray-400 font-medium">Last changed 3 months ago</p>
                    </div>
                    <button type="button" className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-lg transition-colors shadow-sm">
                      Update Password
                    </button>
                  </div>
                </div>
              </MetricCard>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Settings;