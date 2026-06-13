import React from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const ToastNotification = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} />;
      case 'error':
        return <AlertTriangle size={18} />;
      case 'info':
        return <Info size={18} />;
      default:
        return <CheckCircle size={18} />;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500 border-emerald-600';
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'info':
        return 'bg-blue-500 border-blue-600';
      default:
        return 'bg-emerald-500 border-emerald-600';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getColors(notification.type)} border flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white animate-in fade-in slide-in-from-right-5 duration-200`}
        >
          {getIcon(notification.type)}
          <span className="text-sm font-medium flex-1">{notification.message}</span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;
