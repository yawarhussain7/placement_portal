import { useState, useMemo } from 'react'
import { Search, X, MessageSquare, Users, Loader2 } from 'lucide-react'

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

// ─── Contact Card ────────────────────────────────────────────────────────────────
const ContactCard = ({ contact, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(contact)}
      className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-green-50/50 transition-colors border-b border-gray-50 group"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
          style={{ backgroundColor: getColor(contact.name) }}
        >
          {getInitials(contact.name)}
        </div>
        {contact.online && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">{contact.name}</span>
          {contact.online && (
            <span className="text-[10px] text-green-600 font-medium">Online</span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{contact.role}</p>
        <p className="text-[11px] text-gray-300 mt-0.5 truncate">{contact.email}</p>
      </div>

      {/* Action */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
          Message
        </span>
      </div>
    </button>
  )
}

// ─── Group Header ────────────────────────────────────────────────────────────────
const GroupHeader = ({ label }) => (
  <div className="px-4 py-2 bg-gray-50/80">
    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
  </div>
)

// ─── Main Modal ──────────────────────────────────────────────────────────────────
export default function ContactListModal({ open, onClose, onSelectContact, users = [], loading = false }) {
  const [query, setQuery] = useState('')

  // Group contacts by category — all registered users shown as one list
  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim()
    if (!term) return users
    return users.filter((c) =>
      [c.name, c.role, c.email].join(' ').toLowerCase().includes(term)
    )
  }, [users, query])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg sm:mx-4 max-h-[85vh] sm:max-h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-gray-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-50 rounded-xl flex items-center justify-center">
              <Users size={16} className="sm:size-[18px] text-green-600" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">New Conversation</h2>
              <p className="text-[11px] sm:text-xs text-gray-400 mt-0.25">Select a contact to message</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} className="sm:size-[18px]" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-100">
          <div className="relative">
            <Search size={14} className="sm:size-[15px] absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20 transition-all"
              placeholder="Search contacts..."
              autoFocus
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6">
              <Loader2 size={24} className="sm:size-7 text-green-600 animate-spin mb-3" />
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-1">Loading contacts...</h3>
              <p className="text-[11px] sm:text-xs text-gray-400 text-center">
                Fetching registered users from the system.
              </p>
            </div>
          ) : filtered.length > 0 ? (
            <div>
              <GroupHeader label={`All Users (${filtered.length})`} />
              {filtered.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onSelect={onSelectContact}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
                <MessageSquare size={18} className="sm:size-[22px] text-gray-300" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-1">
                {query ? 'No contacts found' : 'No registered users yet'}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-400 text-center">
                {query
                  ? 'Try adjusting your search terms.'
                  : 'Users who register on the platform will appear here.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-gray-100 bg-gray-50/50">
          <p className="text-[10px] sm:text-[11px] text-gray-400 text-center">
            {users.length > 0
              ? `Select a person to start a new conversation`
              : 'No other users registered yet'}
          </p>
        </div>
      </div>
    </div>
  )
}