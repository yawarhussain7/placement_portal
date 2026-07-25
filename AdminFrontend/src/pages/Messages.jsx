import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import ChatList from '../components/message/ChatList';
import ChatWindow from '../components/message/ChatWindow';
import ContactInfo from '../components/message/ContactInfo';
import { getStudents } from '../api/students';

const Messages = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [students, setStudents] = useState([]);
  const [chats, setChats] = useState([
    {
      id: 1,
      name: 'Placement Team',
      avatar: 'PT',
      lastMessage: 'TCS drive documents have been verified',
      time: '2 min ago',
      unread: 3,
      online: true,
      messages: [
        { id: 1, text: 'Hi team, new placement drive posted', time: '10:30 AM', sent: false },
        { id: 2, text: 'TCS is conducting a campus drive on 28th May', time: '10:31 AM', sent: false },
        { id: 3, text: '210 students are eligible to apply', time: '10:32 AM', sent: false },
        { id: 4, text: 'I will verify the documents today', time: '10:35 AM', sent: true, status: 'read' },
        { id: 5, text: 'TCS drive documents have been verified', time: '11:45 AM', sent: false }
      ]
    },
    {
      id: 2,
      name: 'Student Support',
      avatar: 'SS',
      lastMessage: '15 documents verified successfully',
      time: '1 hour ago',
      unread: 0,
      online: false,
      messages: [
        { id: 1, text: 'Document verification completed', time: '9:00 AM', sent: false },
        { id: 2, text: '15 documents verified successfully', time: '9:05 AM', sent: false }
      ]
    },
    {
      id: 3,
      name: 'Admin Notifications',
      avatar: 'AN',
      lastMessage: '23 documents pending review',
      time: '3 hours ago',
      unread: 1,
      online: true,
      messages: [
        { id: 1, text: 'Pending review alert', time: '8:00 AM', sent: false },
        { id: 2, text: '23 documents pending review', time: '8:05 AM', sent: false }
      ]
    },
    {
      id: 4,
      name: 'System Alerts',
      avatar: 'SA',
      lastMessage: 'Amazon deadline tomorrow',
      time: '1 day ago',
      unread: 0,
      online: false,
      messages: [
        { id: 1, text: 'Application deadline reminder', time: 'Yesterday', sent: false },
        { id: 2, text: 'Amazon deadline tomorrow', time: 'Yesterday', sent: false }
      ]
    }
  ]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      sent: true,
      status: 'sent'
    };

    setChats(chats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, message],
          lastMessage: newMessage,
          time: 'Just now'
        };
      }
      return chat;
    }));

    setNewMessage('');
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getStudents();
        if (response.success && Array.isArray(response.data)) {
          setStudents(response.data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const startChatWithStudent = (student) => {
    const studentName = student.fullName || 'Student';
    const existingChat = chats.find(chat => chat.name === studentName);
    
    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      const newChat = {
        id: Date.now(),
        name: studentName,
        avatar: studentName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        lastMessage: 'Start a conversation',
        time: 'Just now',
        unread: 0,
        online: false,
        messages: []
      };
      setChats([newChat, ...chats]);
      setSelectedChat(newChat);
    }
    
    setShowAllStudents(false);
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans antialiased">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 flex overflow-hidden p-4 md:p-6 gap-4 relative">
          <ChatList 
            chats={chats}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
            onShowAllStudents={() => setShowAllStudents(!showAllStudents)}
          />
          
          {showAllStudents && (
            <div className="absolute top-20 left-80 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[500px]">
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">All Students</h3>
                    <p className="text-xs text-gray-600 mt-0.5">{students.length} students available</p>
                  </div>
                  <button
                    onClick={() => setShowAllStudents(false)}
                    className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {students.map((student) => (
                  <div
                    key={student._id}
                    onClick={() => startChatWithStudent(student)}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-emerald-50 mb-1 border border-transparent hover:border-emerald-200 hover:shadow-sm group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0 group-hover:scale-110 transition-transform">
                      {(student.fullName || 'S').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{student.fullName || 'Unknown'}</h4>
                      <p className="text-xs text-gray-500 truncate">{student.email || 'No email'}</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <ChatWindow 
              chat={selectedChat}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSendMessage={sendMessage}
            />
          </div>
          
          {selectedChat && (
            <div className="hidden lg:block">
              <ContactInfo chat={selectedChat} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Messages;