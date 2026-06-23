import React, { useState } from 'react';
import SettingsCardLayout from '../../layout/SettingsCardLayout'
import SwitchControl from './SwitchControl';

const NotificationsSection = () => {
  const [notifications, setNotifications] = useState({
    newApplication: true,
    documentUpload: true,
    placementDrive: false,
    weeklySummary: true,
    profileUpdates: false,
  });

  const toggleAlert = (key, val) => {
    setNotifications(prev => ({ ...prev, [key]: val }));
  };

  return (
    <SettingsCardLayout
      title="Notification Preferences" 
      description="Choose how and when you receive alerts"
    >
      <div className="divide-y divide-gray-100 -my-2">
        <SwitchControl title="New Application Alert" description="Notify when a student submits a new application" checked={notifications.newApplication} onChange={(val) => toggleAlert('newApplication', val)} />
        <SwitchControl title="Document Upload Alert" description="Notify when a student uploads a document" checked={notifications.documentUpload} onChange={(val) => toggleAlert('documentUpload', val)} />
        <SwitchControl title="Placement Drive Reminder" description="Remind 24 hours before an upcoming drive" checked={notifications.placementDrive} onChange={(val) => toggleAlert('placementDrive', val)} />
        <SwitchControl title="Weekly Summary Email" description="Receive a weekly digest of placement activity" checked={notifications.weeklySummary} onChange={(val) => toggleAlert('weeklySummary', val)} />
        <SwitchControl title="Student Profile Updates" description="Notify when a student edits their profile" checked={notifications.profileUpdates} onChange={(val) => toggleAlert('profileUpdates', val)} />
      </div>
    </SettingsCardLayout>
  );
};

export default NotificationsSection;