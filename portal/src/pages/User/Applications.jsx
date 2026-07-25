import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Template from '../../components/common/Template'
import { CalendarDays, FileText, Plus, Search, UserRoundCheck, TrendingUp, ExternalLink, ChevronRight, Save, Loader2 } from 'lucide-react'
import { usePortalData } from '../../context/PortalDataContext'
import { updateApplicationStatus as updateApplicationStatusApi } from '../../Api/application.js'

const statusTone = {
  'Draft': 'bg-slate-50 text-slate-600 border border-slate-200',
  'Submitted': 'bg-blue-50 text-blue-700 border border-blue-200',
  'Documents Under Review': 'bg-amber-50 text-amber-700 border border-amber-200',
  'Shortlisted': 'bg-purple-50 text-purple-700 border border-purple-200',
  'Interview Scheduled': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Offer Received': 'bg-green-50 text-green-700 border border-green-200',
  'Not Selected': 'bg-red-50 text-red-700 border border-red-200',
  'Withdrawn': 'bg-gray-50 text-gray-700 border border-gray-200',
}

export default function Applications() {
  const { data, updateApplication, submitApplication, profileLoaded } = usePortalData()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(data.applications[0]?.id)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [localNotes, setLocalNotes] = useState('')

  const filtered = useMemo(() => {
    const term = query.toLowerCase()
    return data.applications.filter((app) => [app.role, app.company, app.status, app.advisor].join(' ').toLowerCase().includes(term))
  }, [data.applications, query])

  const selected = data.applications.find((app) => app.id === selectedId) || filtered[0] || data.applications[0]
  
  // Update local notes when selected application changes
  if (selected && selected.notes !== localNotes && localNotes === '') {
    setLocalNotes(selected.notes || '')
  }
  const interviews = data.applications.filter((app) => app.status === 'Interview Scheduled').length
  const averageProgress = Math.round(data.applications.reduce((sum, app) => sum + app.progress, 0) / Math.max(data.applications.length, 1))

  // Show loading state while profile is being fetched
  if (!profileLoaded) {
    return (
      <Template title="My Applications" description="Track and manage your active placement applications">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 size={48} className="animate-spin text-emerald-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your applications...</p>
          </div>
        </div>
      </Template>
    )
  }

  return (
    <Template title="My Applications" description="Track and manage your active placement applications">
      <div className="space-y-4 sm:space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { 
              label: 'Active applications', 
              value: data.applications.length, 
              subtext: 'Applications in progress',
              icon: FileText,
              color: 'emerald',
              borderColor: 'border-l-emerald-500'
            },
            { 
              label: 'Interviews booked', 
              value: interviews, 
              subtext: 'Upcoming interviews',
              icon: CalendarDays,
              color: 'blue',
              borderColor: 'border-l-blue-500'
            },
            { 
              label: 'Average progress', 
              value: `${averageProgress}%`, 
              subtext: 'Across all applications',
              icon: TrendingUp,
              color: 'purple',
              borderColor: 'border-l-purple-500'
            },
          ].map(({ label, value, subtext, icon: Icon, color, borderColor }) => (
            <div key={label} className={`bg-white border border-gray-200 rounded-lg p-5 ${borderColor} border-l-4 shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-600">{label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                  <p className="text-xs text-gray-500 mt-1">{subtext}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-${color}-50 flex items-center justify-center`}>
                  <Icon size={24} className={`text-${color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4 sm:gap-5">
          {/* Pipeline list */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">Application Pipeline</h2>
                <p className="text-xs text-gray-500 mt-1">Select any application to edit details.</p>
              </div>
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  value={query} 
                  onChange={(event) => setQuery(event.target.value)} 
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                  placeholder="Search applications" 
                />
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((app) => (
                  <button 
                    key={app.id} 
                    onClick={() => setSelectedId(app.id)} 
                    className={`w-full text-left p-5 hover:bg-gray-50 transition-colors ${selected?.id === app.id ? 'bg-emerald-50' : ''}`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Company Logo Placeholder */}
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center flex-shrink-0 border border-emerald-200">
                          <span className="text-lg font-bold text-emerald-700">
                            {app.company.charAt(0)}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-bold text-gray-900">{app.role}</h3>
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusTone[app.status] || 'bg-slate-50 text-slate-600 border border-slate-200'}`}>
                              {app.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{app.company}</p>
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2.5 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <span className="font-medium">{app.id}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="text-gray-400">•</span>
                              Advisor: {app.advisor}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="text-gray-400">•</span>
                              Updated: {app.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 lg:w-64">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-semibold text-gray-700">{app.stage}</span>
                            <span className="text-gray-600 font-medium">{app.progress}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${app.progress}%` }} />
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-12 text-center">
                  <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-sm text-gray-500 mb-4">You haven't submitted any placement applications.</p>
                  <button 
                    onClick={() => navigate('/new-placement')}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Plus size={16} />
                    Start New Application
                  </button>
                </div>
              )}
            </div>
            
            {/* View all applications link */}
            {data.applications.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <button 
                  onClick={() => navigate('/applications/all')}
                  className="w-full text-center text-sm text-emerald-700 hover:text-emerald-800 font-medium py-2 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  View all applications →
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 sm:space-y-5">
            {selected && (
              <form className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 space-y-4" onSubmit={(event) => event.preventDefault()}>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Edit Application</h2>
                    <p className="text-xs text-gray-500 mt-1">{selected.id}</p>
                  </div>
                  <button type="button" className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <ExternalLink size={14} className="text-gray-600" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">Role</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                      value={selected.role}
                      onChange={(event) => updateApplication(selected.id, { role: event.target.value })}
                    >
                      <option>{selected.role}</option>
                      <option>Frontend Developer Internship</option>
                      <option>Junior QA Analyst</option>
                      <option>UI/UX Design Assistant</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">Status</label>
                    <div className="relative">
                      <select 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white appearance-none"
                        value={selected.status}
                        onChange={(event) => {
                          const newStatus = event.target.value
                          if (newStatus === 'Submitted' && selected.status === 'Draft') {
                            // Submit application through proper flow
                            setIsSubmitting(true)
                            submitApplication(selected.id)
                              .then(() => setIsSubmitting(false))
                              .catch(() => setIsSubmitting(false))
                          } else {
                            // Convert frontend status to backend status
                            const backendStatus = newStatus.toLowerCase().replace(/\s+/g, '_')
                            updateApplication(selected.id, { status: backendStatus })
                          }
                        }}
                        disabled={isSubmitting}
                      >
                        <option>Draft</option>
                        <option>Submitted</option>
                        <option>Documents Under Review</option>
                        <option>Interview Scheduled</option>
                        <option>Offer Received</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Progress: {selected.progress}%
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={selected.progress} 
                      onChange={(event) => updateApplication(selected.id, { progress: Number(event.target.value) })} 
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">Advisor Notes</label>
                    <textarea 
                      rows="4"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none" 
                      value={localNotes}
                      onChange={(event) => setLocalNotes(event.target.value)}
                      placeholder="Enter advisor notes here..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {selected.status === 'Draft' && (
                    <button 
                      type="button"
                      onClick={() => submitApplication(selected.id)}
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={async () => {
                      try {
                        // Save notes to backend as coverLetter
                        await updateApplication(selected.id, { coverLetter: localNotes })
                        setSaveMessage('Changes saved successfully!')
                        setTimeout(() => setSaveMessage(''), 3000)
                      } catch (error) {
                        console.error('Failed to save:', error)
                        setSaveMessage('Failed to save changes')
                        setTimeout(() => setSaveMessage(''), 3000)
                      }
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                  {saveMessage && (
                    <div className="text-xs text-emerald-600 text-center py-2 bg-emerald-50 rounded-lg">
                      {saveMessage}
                    </div>
                  )}
                </div>
              </form>
            )}
          </aside>
        </div>
      </div>
    </Template>
  )
}