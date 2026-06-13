import { useMemo, useState } from 'react'
import Template from '../../components/common/Template'
import { Paperclip, Search, Send } from 'lucide-react'
import { usePortalData } from '../../context/PortalDataContext'

export default function Messages() {
  const { data, markThreadRead, sendMessage } = usePortalData()
  const [activeId, setActiveId] = useState(data.threads[0]?.id)
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')

  const threads = useMemo(() => {
    const term = query.toLowerCase()
    return data.threads.filter((thread) => [thread.name, thread.role, thread.subject].join(' ').toLowerCase().includes(term))
  }, [data.threads, query])

  const active = data.threads.find((thread) => thread.id === activeId) || threads[0] || data.threads[0]

  const openThread = (thread) => {
    setActiveId(thread.id)
    markThreadRead(thread.id)
  }

  const submit = (event) => {
    event.preventDefault()
    if (!active) return
    sendMessage(active.id, message)
    setMessage('')
  }

  return (
    <Template title="Messages" description="Communicate with advisors, employers, and document reviewers">
      <div className="card border rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-[320px_1fr] min-h-[620px]">
        <aside className="border-b lg:border-b-0 lg:border-r border-base">
          <div className="p-4 border-b border-base">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="input-base w-full border rounded-lg pl-9 pr-3 py-2 text-sm" placeholder="Search messages" />
            </div>
          </div>
          <div className="divide-y divide-base">
            {threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => openThread(thread)}
                className={`w-full text-left p-4 hover:bg-subtle transition-colors ${active?.id === thread.id ? 'bg-accent-subtle' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-primary truncate">{thread.name}</p>
                    <p className="text-xs text-muted mt-0.5">{thread.role}</p>
                    <p className="text-sm text-secondary mt-2 truncate">{thread.subject}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[11px] text-muted">{thread.time}</span>
                    {thread.unread && <span className="w-2 h-2 rounded-full bg-accent" />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {active && (
          <section className="flex flex-col min-h-0">
            <div className="p-5 border-b border-base">
              <h2 className="font-bold text-primary">{active.name}</h2>
              <p className="text-xs text-muted mt-1">{active.role} - {active.subject}</p>
            </div>

            <div className="flex-1 p-5 space-y-4 bg-base overflow-y-auto">
              {active.messages.map((item, index) => (
                <div key={`${item.time}-${index}`} className={`flex ${item.own ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[78%] rounded-lg px-4 py-3 text-sm shadow-sm ${
                    item.own ? 'bg-accent text-white' : 'bg-surface border border-base text-secondary'
                  }`}>
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <p className="text-xs font-bold opacity-80">{item.from}</p>
                      <p className="text-[10px] opacity-70">{item.time}</p>
                    </div>
                    <p className="leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={submit} className="p-4 border-t border-base bg-surface">
              <div className="flex items-center gap-2">
                <button type="button" className="p-2 border border-base rounded-lg text-secondary hover:bg-subtle" title="Attach file">
                  <Paperclip size={18} />
                </button>
                <input value={message} onChange={(event) => setMessage(event.target.value)} className="input-base flex-1 border rounded-lg px-3 py-2 text-sm" placeholder="Write a message" />
                <button className="p-2 bg-accent hover-accent rounded-lg text-white" title="Send">
                  <Send size={18} />
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </Template>
  )
}
