import React, { useState, useEffect } from 'react';
import SettingsCardLayout from '../../layout/SettingsCardLayout';
import SwitchControl from './SwitchControl';
import { getProfile, updateNotifications } from '../../api/settings.js';

const NotificationsSection = () => {
  const [notifications, setNotifications] = useState({
    newApplication: true,
    documentUpload: true,
    placementDrive: false,
    weeklySummary: true,
    profileUpdates: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        
        if (response.success && response.data) {
          const data = response.data;
          if (data.notifications) {
            setNotifications(data.notifications);
          }
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const toggleAlert = async (key, val) => {
    const newNotifications = { ...notifications, [key]: val };
    setNotifications(newNotifications);
    
    try {
      setSaving(true);
      await updateNotifications(newNotifications);
    } catch (err) {
      console.error('Failed to update notifications:', err.message);
      // Revert on error
      setNotifications(notifications);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsCardLayout
      title="Notification Preferences" 
      description="Choose how and when you receive alerts"
    >
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-sm text-gray-400">Loading preferences...</div>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 -my-2">
          <SwitchControl
            title="New Application Alert"
            description="Notify when a student submits a new application"
            checked={notifications.newApplication}
            onChange={(val) => toggleAlert('newApplication', val)}
          />
          <SwitchControl
            title="Document Upload Alert"
            description="Notify when a student uploads a document"
            checked={notifications.documentUpload}
            onChange={(val) => toggleAlert('documentUpload', val)}
          />
          <SwitchControl
            title="Placement Drive Reminder"
            description="Remind 24 hours before an upcoming drive"
            checked={notifications.placementDrive}
            onChange={(val) => toggleAlert('placementDrive', val)}
          />
          <SwitchControl
            title="Weekly Summary Email"
            description="Receive a weekly digest of placement activity"
            checked={notifications.weeklySummary}
            onChange={(val) => toggleAlert('weeklySummary', val)}
          />
          <SwitchControl
            title="Student Profile Updates"
            description="Notify when a student edits their profile"
            checked={notifications.profileUpdates}
            onChange={(val) => toggleAlert('profileUpdates', val)}
          />
        </div>
      )}
    </SettingsCardLayout>
  );
};

export default NotificationsSection;