import { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import Template from '../../components/common/Template'
import ContactListModal from '../../components/common/ContactListModal'
import {
  Paperclip, Search, Send, ChevronLeft, CheckCheck, Circle,
  Clock, MoreVertical, Info, Trash2, Archive, Edit3,
  Smile, Reply, Star, MessageSquare
} from 'lucide-react'
import { usePortalData } from '../../context/PortalDataContext'
import { useSocket } from '../../context/SocketContext'
import { getUsers } from '../../Api/userApi'

// ─── Color & Style Constants ───────────────────────────────────────────────────
const COLORS = [
  '#12692e', '#2563eb', '#f59e0b', '#7c3aed', '#0d9488', '#e11d48',
  '#0891b2', '#be123c', '#4f46e5', '#ca8a04'
]

const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getColor = (name) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

// ─── Thread List Item ───────────────────────────────────────────────────────────
const ThreadItem = ({ thread, active, onClick }) => {
  const lastMsg = thread.messages?.[thread.messages.length - 1]
  const timeAgo = (time) => {
    if (!time) return ''
    if (time === 'Just now') return 'now'
    if (time === 'Yesterday') return 'yest'
    return time
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 sm:px-4 py-3 sm:py-3.5 flex items-start gap-2.5 sm:gap-3 transition-all duration-200 border-l-[3px] active:scale-[0.98] ${
        active
          ? 'bg-green-50/80 border-l-green-600 shadow-sm'
          : 'border-l-transparent hover:bg-gray-50/80'
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white shadow-sm"
          style={{ backgroundColor: getColor(thread.name) }}
        >
          {getInitials(thread.name)}
        </div>
        {thread.unread && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-600 border-2 border-white rounded-full flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-xs sm:text-sm truncate ${thread.unread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
            {thread.name}
          </span>
          <span className="text-[10px] text-gray-400 flex-shrink-0 font-medium">{timeAgo(thread.time)}</span>
        </div>
        <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5 truncate">{thread.role}</p>
        <p className={`text-[11px] sm:text-xs mt-1 truncate leading-relaxed ${thread.unread ? 'font-semibold text-gray-700' : 'text-gray-500'}`}>
          {lastMsg ? (lastMsg.own ? 'You: ' : '') + lastMsg.body : thread.subject}
        </p>
      </div>
    </button>
  )
}

// ─── Message Bubble ─────────────────────────────────────────────────────────────
const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex items-end gap-1.5 sm:gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {/* Sender avatar (only for others) */}
      {!isOwn && (
        <div className="flex-shrink-0 mb-0.5 hidden sm:block">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-white" style={{ backgroundColor: getColor(message.from) }}>
            {getInitials(message.from)}
          </div>
        </div>
      )}

      {/* Message */}
      <div className={`max-w-[85%] sm:max-w-[75%] group relative ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender name + time */}
        <div className={`flex items-center gap-2 mb-0.5 sm:mb-1 ${isOwn ? 'justify-end' : ''}`}>
          {!isOwn && <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500">{message.from}</span>}
          <span className="text-[9px] sm:text-[10px] text-gray-300">{message.time}</span>
        </div>

        {/* Bubble */}
        <div
          className={`relative px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
            isOwn
              ? 'bg-green-600 text-white rounded-2xl rounded-br-md'
              : 'bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-bl-md'
          }`}
        >
          <p className="break-words">{message.body}</p>

          {/* Hover actions */}
          <div className={`absolute top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg shadow-lg px-1 py-0.5 sm:px-1.5 sm:py-1 ${isOwn ? '-left-10 sm:-left-12' : '-right-10 sm:-right-12'}`}>
            <button className="p-0.5 sm:p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600" title="Reply">
              <Reply size={11} className="sm:size-[13px]" />
            </button>
            <button className="p-0.5 sm:p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600" title="Star">
              <Star size={11} className="sm:size-[13px]" />
            </button>
          </div>
        </div>

        {/* Read receipt (own messages) */}
        {isOwn && (
          <div className="flex items-center justify-end mt-0.5">
            <CheckCheck size={10} className="sm:size-3 text-green-400" />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Date Separator ─────────────────────────────────────────────────────────────
const DateSeparator = ({ label }) => (
  <div className="flex items-center gap-2 sm:gap-3 my-3 sm:my-5">
    <div className="flex-1 h-px bg-gray-100" />
    <span className="text-[10px] sm:text-[11px] font-semibold text-gray-300 uppercase tracking-wider">{label}</span>
    <div className="flex-1 h-px bg-gray-100" />
  </div>
)

// ─── Empty State ────────────────────────────────────────────────────────────────
const EmptyState = ({ hasQuery, onNewMessage }) => (
  <div className="flex flex-col items-center justify-center h-full py-12 sm:py-20 px-4 sm:px-6">
    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
      <MessageSquare size={24} className="sm:size-7 text-green-600" />
    </div>
    <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-1 text-center">
      {hasQuery ? 'No conversations found' : 'No messages yet'}
    </h3>
    <p className="text-xs sm:text-sm text-gray-400 text-center max-w-xs">
      {hasQuery
        ? 'Try adjusting your search terms.'
        : 'Start a new conversation with a team member.'}
    </p>
    {!hasQuery && (
      <button
        onClick={onNewMessage}
        className="mt-4 sm:mt-5 px-4 sm:px-5 py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-sm"
      >
        <span className="flex items-center gap-2">
          <Edit3 size={14} className="sm:size-4" />
          New Message
        </span>
      </button>
    )}
  </div>
)

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function Messages() {
  const { data, markThreadRead, sendMessage, createThread } = usePortalData()
  const socket = useSocket()
  const [activeId, setActiveId] = useState(data.threads[0]?.id || null)
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [socketNotif, setSocketNotif] = useState(null) // toast-like notification
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Filter threads
  const threads = useMemo(() => {
    const term = query.toLowerCase()
    return data.threads.filter((thread) =>
      [thread.name, thread.role, thread.subject].join(' ').toLowerCase().includes(term)
    )
  }, [data.threads, query])

  const active = data.threads.find((thread) => thread.id === activeId) || threads[0] || null

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [active?.messages])

  // Focus input when switching threads
  useEffect(() => {
    if (active && !sidebarOpen) {
      inputRef.current?.focus()
    }
  }, [active, sidebarOpen])

  const openThread = (thread) => {
    setActiveId(thread.id)
    markThreadRead(thread.id)
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }

  const submit = (event) => {
    event.preventDefault()
    if (!active || !message.trim()) return
    sendMessage(active.id, message.trim())
    setMessage('')
  }

  // ── Socket.IO: Real-time message reception ──
  useEffect(() => {
    if (!socket) return

    const cleanupMessage = socket.onNewMessage((payload) => {
      const { conversationId, message: msg } = payload
      if (!conversationId || !msg) return

      // Show a brief notification
      setSocketNotif(`${msg.from}: ${msg.body.slice(0, 40)}${msg.body.length > 40 ? '...' : ''}`)
      setTimeout(() => setSocketNotif(null), 4000)

      markThreadRead(conversationId)
    })

    const cleanupConversation = socket.onNewConversation((payload) => {
      const { conversation } = payload
      if (!conversation) return
      console.log('[Socket] New conversation created:', conversation)
    })

    return () => {
      cleanupMessage()
      cleanupConversation()
    }
  }, [socket, markThreadRead])

  // Fetch registered users when modal opens
  useEffect(() => {
    if (contactModalOpen && users.length === 0 && !usersLoading) {
      const fetchUsers = async () => {
        setUsersLoading(true)
        try {
          const response = await getUsers()
          if (response?.data?.success && Array.isArray(response.data.data)) {
            setUsers(response.data.data)
          }
        } catch {
          console.warn('Failed to fetch users, API may be unavailable')
        } finally {
          setUsersLoading(false)
        }
      }
      fetchUsers()
    }
  }, [contactModalOpen, users.length, usersLoading])

  const handleSelectContact = useCallback(async (contact) => {
    // Check if a thread with this contact already exists
    const existing = data.threads.find(
      (t) => t.name.toLowerCase() === contact.name.toLowerCase()
    )
    if (existing) {
      setActiveId(existing.id)
      markThreadRead(existing.id)
    } else {
      const newId = await createThread(
        contact.name,
        contact.role,
        `Chat with ${contact.name}`,
        '',
        contact.id
      )
      setActiveId(newId)
    }
    setContactModalOpen(false)
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }, [data.threads, createThread, markThreadRead])

  const unreadCount = data.threads.filter((t) => t.unread).length

  // Group messages by date
  const groupedMessages = useMemo(() => {
    if (!active?.messages) return []
    const groups = []
    let currentDate = null
    active.messages.forEach((msg, idx) => {
      const dateLabel = msg.time === 'Just now' ? 'Today' : msg.time === 'Yesterday' ? 'Yesterday' : msg.time
      if (dateLabel !== currentDate) {
        currentDate = dateLabel
        groups.push({ type: 'date', label: dateLabel })
      }
      groups.push({ type: 'message', data: msg, index: idx })
    })
    return groups
  }, [active?.messages])

  return (
    <Template title="Messages" description="Communicate with advisors, employers, and document reviewers">
      {/* Toast-like socket notification */}
      {socketNotif && (
        <div className="fixed top-4 right-4 z-[60] animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="bg-green-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 max-w-xs">
            <MessageSquare size={16} className="flex-shrink-0" />
            <p className="text-xs font-medium leading-relaxed">{socketNotif}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-[calc(100vh-13rem)] min-h-[480px] sm:min-h-[540px] flex flex-col lg:flex-row relative">
        {/* ── Sidebar ── */}
        <aside
          className={`${
            sidebarOpen ? 'flex' : 'hidden'
          } lg:flex w-full lg:w-[320px] xl:w-[360px] border-r border-gray-100 flex-shrink-0 flex-col bg-gray-50/30 absolute lg:relative inset-0 z-10 lg:z-auto`}
        >
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-2.5 sm:mb-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900">Inbox</h2>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                  {unreadCount > 0
                    ? `${unreadCount} unread`
                    : 'All caught up'}
                </p>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1">
                <button
                  onClick={() => setContactModalOpen(true)}
                  className="p-1.5 sm:p-2 hover:bg-green-50 rounded-lg text-green-600 hover:text-green-700 transition-colors"
                  title="New message"
                >
                  <Edit3 size={15} className="sm:size-4" />
                </button>
                <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors hidden sm:block" title="Archive">
                  <Archive size={15} className="sm:size-4" />
                </button>
              </div>
            </div>
            <div className="relative">
              <Search size={14} className="sm:size-[15px] absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20 transition-all"
                placeholder="Search messages..."
              />
            </div>
          </div>

          {/* Thread List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {threads.length > 0 ? (
              threads.map((thread) => (
                <ThreadItem
                  key={thread.id}
                  thread={thread}
                  active={active?.id === thread.id}
                  onClick={() => openThread(thread)}
                />
              ))
            ) : (
              <div className="p-6 sm:p-8 text-center">
                <MessageSquare size={20} className="sm:size-6 mx-auto text-gray-200 mb-2" />
                <p className="text-xs sm:text-sm text-gray-400">No conversations</p>
              </div>
            )}
          </div>
        </aside>

        {/* ── Main Chat Area ── */}
        {active ? (
          <section className="flex-1 flex flex-col min-w-0 bg-white">
            {/* Chat Header */}
            <div className="px-3 sm:px-5 py-2.5 sm:py-3.5 border-b border-gray-100 bg-white flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {/* Mobile back button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 flex-shrink-0"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Avatar */}
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: getColor(active.name) }}
                >
                  {getInitials(active.name)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">{active.name}</h3>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 flex-shrink-0" title="Online" />
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">{active.role} — {active.subject}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-0.5 sm:gap-1">
                <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors" title="Details">
                  <Info size={15} className="sm:size-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-3 sm:py-4 space-y-1 bg-gradient-to-b from-white to-gray-50/30">
              {groupedMessages.map((item, idx) => {
                if (item.type === 'date') {
                  return <DateSeparator key={`d-${idx}`} label={item.label} />
                }
                return (
                  <MessageBubble
                    key={`m-${item.index}`}
                    message={item.data}
                    isOwn={item.data.own}
                  />
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={submit} className="px-2 sm:px-4 py-2 sm:py-3 border-t border-gray-100 bg-white">
              <div className="flex items-end gap-1.5 sm:gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600/20 transition-all">
                <button
                  type="button"
                  className="p-1 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 self-end mb-0.5"
                  title="Attach file"
                >
                  <Paperclip size={15} className="sm:size-[17px]" />
                </button>
                <textarea
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      submit(e)
                    }
                  }}
                  className="flex-1 bg-transparent border-none outline-none resize-none text-xs sm:text-sm text-gray-800 placeholder-gray-400 py-0.5 max-h-20 sm:max-h-28"
                  placeholder="Type a message..."
                  rows={1}
                />
                <button
                  type="button"
                  className="p-1 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 self-end mb-0.5 hidden sm:block"
                  title="Emoji"
                >
                  <Smile size={15} className="sm:size-[17px]" />
                </button>
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="p-1.5 sm:p-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 rounded-xl text-white disabled:text-gray-400 transition-all flex-shrink-0 self-end shadow-sm"
                  title="Send message"
                >
                  <Send size={14} className="sm:size-4" />
                </button>
              </div>
            </form>
          </section>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <EmptyState
              hasQuery={query.length > 0 && threads.length === 0}
              onNewMessage={() => setContactModalOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Contact List Modal */}
      <ContactListModal
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        onSelectContact={handleSelectContact}
        users={users}
        loading={usersLoading}
      />
    </Template>
  )
}