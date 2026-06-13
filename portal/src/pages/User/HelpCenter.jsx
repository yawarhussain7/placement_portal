import { useMemo, useState } from 'react'
import Template from '../../components/common/Template'
import { BookOpen, FileQuestion, Headphones, LifeBuoy, Mail, Search } from 'lucide-react'
import { usePortalData } from '../../context/PortalDataContext'

const articles = [
  { title: 'How to submit a new placement request', category: 'Placement Guide' },
  { title: 'Document checklist for Australian placements', category: 'Documents' },
  { title: 'What happens after an interview is scheduled', category: 'Interviews' },
  { title: 'Updating profile details after submission', category: 'Account' },
  { title: 'How advisor review works', category: 'Placement Guide' },
]

export default function HelpCenter() {
  const { data, createTicket } = usePortalData()
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('')

  const filteredArticles = useMemo(() => {
    const term = query.toLowerCase()
    return articles.filter((article) => [article.title, article.category].join(' ').toLowerCase().includes(term))
  }, [query])

  const submitTicket = (event) => {
    event.preventDefault()
    createTicket(subject)
    setSubject('')
  }

  return (
    <Template title="Help Center" description="Find answers and contact WebMantis support">
      <div className="space-y-5">
        <div className="card border rounded-lg p-5">
          <div className="relative max-w-2xl">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="input-base w-full border rounded-lg pl-10 pr-4 py-3 text-sm" placeholder="Search help articles, placement steps, or documents" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Placement Guide', desc: 'Understand each step from profile to employer submission.', icon: BookOpen },
            { title: 'Document Support', desc: 'Learn which files are required and how review works.', icon: FileQuestion },
            { title: 'Contact Advisor', desc: 'Get help from the WebMantis placement support team.', icon: Headphones },
          ].map(({ title, desc, icon: Icon }) => (
            <div key={title} className="card border rounded-lg p-5">
              <div className="w-10 h-10 rounded-lg bg-accent-subtle text-accent flex items-center justify-center mb-4">
                <Icon size={20} />
              </div>
              <h2 className="font-bold text-primary">{title}</h2>
              <p className="text-sm text-secondary mt-2 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
          <div className="card border rounded-lg p-5">
            <h2 className="font-bold text-primary">Help Articles</h2>
            <div className="divide-y divide-base mt-3">
              {filteredArticles.map((article) => (
                <button key={article.title} className="w-full py-4 flex items-center justify-between gap-3 text-left hover:text-accent">
                  <span>
                    <span className="block text-sm font-semibold text-secondary">{article.title}</span>
                    <span className="block text-xs text-muted mt-1">{article.category}</span>
                  </span>
                  <LifeBuoy size={16} className="text-muted flex-shrink-0" />
                </button>
              ))}
              {filteredArticles.length === 0 && <p className="text-sm text-muted py-4">No articles match your search.</p>}
            </div>
          </div>

          <div className="space-y-5">
            <form onSubmit={submitTicket} className="card border rounded-lg p-5">
              <div className="w-10 h-10 rounded-lg bg-accent-subtle text-accent flex items-center justify-center">
                <Mail size={20} />
              </div>
              <h2 className="font-bold text-primary mt-4">Need Human Help?</h2>
              <p className="text-sm text-secondary mt-2 leading-relaxed">Create a support ticket and WebMantis advisors will follow up.</p>
              <textarea value={subject} onChange={(event) => setSubject(event.target.value)} rows={4} className="input-base w-full border rounded-lg px-3 py-2 text-sm resize-none mt-4" placeholder="What do you need help with?" />
              <button className="w-full mt-3 px-4 py-2 bg-accent hover-accent rounded-lg text-white text-sm font-semibold">Create Ticket</button>
            </form>

            <div className="card border rounded-lg p-5">
              <h2 className="font-bold text-primary">Your Tickets</h2>
              <div className="space-y-3 mt-4">
                {data.tickets.map((ticket) => (
                  <div key={ticket.id} className="border border-base rounded-lg p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-primary">{ticket.id}</p>
                      <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-accent-subtle text-accent">{ticket.status}</span>
                    </div>
                    <p className="text-sm text-secondary mt-2">{ticket.subject}</p>
                    <p className="text-xs text-muted mt-2">{ticket.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Template>
  )
}
