import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiUser, FiBookOpen, FiBriefcase } from 'react-icons/fi';
import { updatePlacementField } from '../../api/placements.js';

const UpdatePlacementModal = ({ isOpen, onClose, placement, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    personal: {},
    course: {},
    preference: {}
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (placement) {
      setFormData({
        personal: placement.personal || {},
        course: placement.course || {},
        preference: placement.preference || {}
      });
    }
  }, [placement]);

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!placement) return;
    
    setSaving(true);
    try {
      // Update each section
      const updatePromises = [];
      for (const [section, fields] of Object.entries(formData)) {
        for (const [field, value] of Object.entries(fields)) {
          updatePromises.push(updatePlacementField(placement._id, section, field, value));
        }
      }
      
      await Promise.all(updatePromises);
      
      onUpdate && onUpdate(placement._id, formData);
      onClose();
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Failed to update placement:', error);
      alert('Failed to save changes: ' + (error.message || 'Please try again.'));
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !placement) return null;

  const tabs = [
    { id: 'personal', label: 'Personal Details', icon: FiUser },
    { id: 'course', label: 'Course Info', icon: FiBookOpen },
    { id: 'preference', label: 'Placement Preference', icon: FiBriefcase }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Update Placement</h2>
            <p className="text-xs text-gray-500 mt-0.5">{placement.personal?.fullName}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50 px-6 pt-2 gap-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3.5 px-3 text-xs font-bold transition-all relative -bottom-[1px] flex items-center gap-2 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Personal Details Tab */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(formData.personal).map(([key, value]) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-semibold block capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => handleChange('personal', key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Course Info Tab */}
          {activeTab === 'course' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(formData.course).map(([key, value]) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-semibold block capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => handleChange('course', key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Placement Preference Tab */}
          {activeTab === 'preference' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(formData.preference).map(([key, value]) => (
                <div key={key} className={`space-y-1.5 ${['roles', 'skills'].includes(key) ? 'sm:col-span-2' : ''}`}>
                  <label className="text-xs text-gray-500 font-semibold block capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  {['roles', 'skills'].includes(key) ? (
                    <textarea
                      value={value || ''}
                      onChange={(e) => handleChange('preference', key, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={value || ''}
                      onChange={(e) => handleChange('preference', key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePlacementModal;