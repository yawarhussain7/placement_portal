import React from 'react';
import { FiStar, FiImage, FiFileText, FiVideo, FiInfo } from 'react-icons/fi';

const ContactInfo = ({ chat }) => {
  if (!chat) return null;

  const menuItems = [
    { icon: FiStar, label: 'Starred Messages', count: null },
    { icon: FiImage, label: 'Media', count: '43' },
    { icon: FiFileText, label: 'Files & Docs', count: '5' },
    { icon: FiVideo, label: 'Video Clips', count: null },
    { icon: FiInfo, label: 'Information', count: null },
  ];

  return (
    <div className="w-80 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
      {/* Contact Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {chat.avatar}
            </div>
            {chat.online && (
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-3 border-white rounded-full"></div>
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900">{chat.name}</h3>
          <p className="text-xs text-gray-500 mt-1">{chat.online ? 'Online' : 'Offline'}</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-200 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="flex-1 text-left text-sm font-medium text-gray-700">{item.label}</span>
                {item.count && (
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
