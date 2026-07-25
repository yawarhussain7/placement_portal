import React from 'react';
import { FiCheck } from 'react-icons/fi';

const MessageBubble = ({ message }) => {
  return (
    <div
      className={`flex ${message.sent ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
          message.sent
            ? 'bg-white text-gray-800 rounded-br-none shadow-sm'
            : 'bg-gradient-to-br from-green-400 to-green-400 text-white rounded-bl-none'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        <div className={`flex items-center gap-1.5 mt-1 ${message.sent ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-[10px] ${message.sent ? 'text-gray-400' : 'text-white/80'}`}>
            {message.time}
          </span>
          {message.sent && (
            <span className="text-gray-400">
              <FiCheck className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;