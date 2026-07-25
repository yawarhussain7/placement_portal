import React from 'react';

const Message = ({ type = 'info', title, message, onClose }) => {
  const typeStyles = {
    success: {
      bg: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50',
      border: 'border-emerald-300/50',
      icon: 'text-emerald-600',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
      title: 'text-emerald-900',
      text: 'text-emerald-700',
      shadow: 'shadow-emerald-500/20',
      accent: 'bg-emerald-500'
    },
    error: {
      bg: 'bg-gradient-to-br from-red-50 via-rose-50 to-pink-50',
      border: 'border-red-300/50',
      icon: 'text-white',
      iconBg: 'bg-gradient-to-br from-red-500 to-rose-500',
      title: 'text-red-900',
      text: 'text-red-700',
      shadow: 'shadow-red-500/20',
      accent: 'bg-red-500'
    },
    warning: {
      bg: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
      border: 'border-amber-300/50',
      icon: 'text-white',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
      title: 'text-amber-900',
      text: 'text-amber-700',
      shadow: 'shadow-amber-500/20',
      accent: 'bg-amber-500'
    },
    info: {
      bg: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50',
      border: 'border-blue-300/50',
      icon: 'text-white',
      iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-500',
      title: 'text-blue-900',
      text: 'text-blue-700',
      shadow: 'shadow-blue-500/20',
      accent: 'bg-blue-500'
    }
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  const styles = typeStyles[type];

  return (
    <div className={`relative flex items-start gap-4 p-5 rounded-2xl border ${styles.bg} ${styles.border} shadow-xl ${styles.shadow} backdrop-blur-md overflow-hidden group`}>
      {/* Animated accent line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${styles.accent} opacity-80`}></div>
      
      {/* Icon with gradient background */}
      <div className={`flex-shrink-0 ${styles.iconBg} p-2.5 rounded-xl shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <div className="text-white">
          {icons[type]}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        {title && (
          <h3 className={`text-base font-bold mb-1 ${styles.title} tracking-tight`}>
            {title}
          </h3>
        )}
        {message && (
          <p className={`text-sm leading-relaxed ${styles.text}`}>
            {message}
          </p>
        )}
      </div>
      
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${styles.icon} hover:bg-white/60 p-2 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90 active:scale-95`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </div>
  );
};

export default Message;