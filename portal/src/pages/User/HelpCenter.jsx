import { useMemo, useState } from 'react'
import Template from '../../components/common/Template'
import { BookOpen, FileQuestion, Headphones, LifeBuoy, Mail, Search, Clock, Users, Shield, GraduationCap, FileText, Users2, ChevronRight, Zap } from 'lucide-react'
import { usePortalData } from '../../context/PortalDataContext'

const articles = [
  { title: 'How to submit a new placement request', category: 'Placement Guide', readTime: '5 min read', featured: true },
  { title: 'Document checklist for Australian placements', category: 'Documents', readTime: '3 min read', popular: true },
  { title: 'How the interview process works', category: 'Interviews', readTime: '6 min read' },
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
      <div className="space-y-4 sm:space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <LifeBuoy size={24} className="text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Help Center</h1>
              <p className="text-sm text-gray-500 mt-0.5">Find answers and contact WebMantis support</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-medium text-emerald-700">Support team is online</span>
            <ChevronRight size={16} className="text-emerald-600" />
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 sm:p-8">
          <div className="max-w-3xl">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                value={query} 
                onChange={(event) => setQuery(event.target.value)} 
                className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" 
                placeholder="Search help articles, placement steps, or documents..." 
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-md text-sm font-semibold transition-colors">
                Search
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-xs font-medium text-gray-600">Popular topics:</span>
              {['Placement process', 'Required documents', 'Interview preparation', 'Profile verification', 'Application status'].map((topic) => (
                <button key={topic} className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              title: 'Placement Guide', 
              desc: 'Understand each step from profile to employer submission.',
              icon: BookOpen,
              color: 'emerald',
              stats: { label: 'Articles', value: '12' },
              stat2: { label: 'Students helped', value: '5.2k' }
            },
            { 
              title: 'Document Support', 
              desc: 'Learn which files are required and how review works.',
              icon: FileQuestion,
              color: 'blue',
              stats: { label: 'Articles', value: '8' },
              stat2: { label: 'Issues resolved', value: '98%' }
            },
            { 
              title: 'Contact Advisor', 
              desc: 'Get help from the WebMantis placement support team.',
              icon: Headphones,
              color: 'purple',
              stats: { label: 'Support', value: 'Live' },
              stat2: { label: 'Hours', value: 'Mon-Fri, 9AM-6PM' }
            },
          ].map(({ title, desc, icon: Icon, color, stats, stat2 }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-lg bg-${color}-50 flex items-center justify-center`}>
                  <Icon size={24} className={`text-${color}-600`} />
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{desc}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className={`w-4 h-4 rounded bg-${color}-50 flex items-center justify-center`}>
                    {color === 'emerald' && <BookOpen size={12} className={`text-${color}-600`} />}
                    {color === 'blue' && <FileText size={12} className={`text-${color}-600`} />}
                    {color === 'purple' && <Headphones size={12} className={`text-${color}-600`} />}
                  </div>
                  <span>{stats.value} {stats.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {color === 'emerald' && <Users2 size={12} className="text-gray-400" />}
                  {color === 'blue' && <Shield size={12} className="text-gray-400" />}
                  {color === 'purple' && <Clock size={12} className="text-gray-400" />}
                  <span>{stat2.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 sm:gap-5">
          {/* Help Articles */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">Help Articles</h2>
                <p className="text-xs text-gray-500 mt-1">Step-by-step guides to help you succeed</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                View All
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredArticles.map((article) => (
                <button key={article.title} className="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <GraduationCap size={20} className="text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">{article.title}</h3>
                        {article.featured && (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">Featured</span>
                        )}
                        {article.popular && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">Popular</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Learn how to apply for placements and track your progress.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={14} />
                      <span>{article.readTime}</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                </button>
              ))}
              {filteredArticles.length === 0 && <p className="text-sm text-gray-500 py-8 text-center">No articles match your search.</p>}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 sm:space-y-5">
            {/* Need Human Help */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Headphones size={24} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Need Human Help?</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Create a support ticket and WebMantis advisors will get back to you.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <Zap size={14} className="text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-700">Fast Response</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                  <Users size={14} className="text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">Expert Team</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
                  <Shield size={14} className="text-purple-600" />
                  <span className="text-xs font-medium text-purple-700">Secure</span>
                </div>
              </div>

              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2">
                <Mail size={16} />
                Create Support Ticket
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  <Mail size={16} />
                  Email Us
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  <LifeBuoy size={16} />
                  Live Chat
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Template>
  )
}
