import React, { useState } from 'react';
import { FiMoreVertical, FiPaperclip, FiSmile, FiSend } from 'react-icons/fi';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ chat, newMessage, setNewMessage, onSendMessage }) => {
  const [showEmoji, setShowEmoji] = useState(false);

  if (!chat) {
    return (
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Select a conversation</h3>
          <p className="text-sm text-gray-500">Choose a chat from the left to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {chat.avatar}
            </div>
            {chat.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">{chat.name}</h3>
            <p className="text-xs text-gray-500">
              {chat.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <FiMoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
        {chat.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
      
      {/* Date Separator */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-center">
          <span className="text-[10px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Today</span>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <FiPaperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <FiSmile className="w-5 h-5" />
          </button>
          <button
            onClick={onSendMessage}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-sm hover:shadow-md"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;