import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Template from '../../components/common/Template'
import { Search, CalendarDays, TrendingUp, ExternalLink, ChevronRight, FileText, Loader2 } from 'lucide-react'
import { usePortalData } from '../../context/PortalDataContext'

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

export default function AllApplications() {
  const { data, profileLoaded } = usePortalData()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    let result = data.applications
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(app => app.status === statusFilter)
    }
    
    // Apply search filter
    const term = query.toLowerCase()
    if (term) {
      result = result.filter((app) => 
        [app.role, app.company, app.status, app.advisor].join(' ').toLowerCase().includes(term)
      )
    }
    
    return result
  }, [data.applications, query, statusFilter])

  // Get unique statuses for filter
  const statuses = useMemo(() => {
    const uniqueStatuses = [...new Set(data.applications.map(app => app.status))]
    return uniqueStatuses.sort()
  }, [data.applications])

  // Calculate stats
  const stats = useMemo(() => {
    const total = data.applications.length
    const interviews = data.applications.filter(app => app.status === 'Interview Scheduled').length
    const averageProgress = Math.round(data.applications.reduce((sum, app) => sum + app.progress, 0) / Math.max(total, 1))
    const offers = data.applications.filter(app => app.status === 'Offer Received').length
    
    return { total, interviews, averageProgress, offers }
  }, [data.applications])

  // Show loading state while profile is being fetched
  if (!profileLoaded) {
    return (
      <Template title="All Applications" description="View and manage all your placement applications">
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
    <Template title="All Applications" description="View and manage all your placement applications">
      <div className="space-y-4 sm:space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { 
              label: 'Total Applications', 
              value: stats.total, 
              subtext: 'All time',
              icon: FileText,
              color: 'emerald',
              borderColor: 'border-l-emerald-500'
            },
            { 
              label: 'Interviews', 
              value: stats.interviews, 
              subtext: 'Scheduled',
              icon: CalendarDays,
              color: 'blue',
              borderColor: 'border-l-blue-500'
            },
            { 
              label: 'Offers Received', 
              value: stats.offers, 
              subtext: 'Congratulations!',
              icon: TrendingUp,
              color: 'green',
              borderColor: 'border-l-green-500'
            },
            { 
              label: 'Average Progress', 
              value: `${stats.averageProgress}%`, 
              subtext: 'Overall',
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

        {/* Filters and Search */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                value={query} 
                onChange={(event) => setQuery(event.target.value)} 
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                placeholder="Search applications..." 
              />
            </div>

            {/* Status Filter */}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
            >
              <option value="all">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {filtered.length > 0 ? (
            <>
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-base font-bold text-gray-900">
                  {filtered.length} {filtered.length === 1 ? 'Application' : 'Applications'}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {statusFilter !== 'all' ? `Filtered by: ${statusFilter}` : 'Showing all applications'}
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {filtered.map((app) => (
                  <div 
                    key={app.id} 
                    className="p-5 hover:bg-gray-50 transition-colors"
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
                        <button 
                          onClick={() => navigate('/applications')}
                          className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 text-sm font-medium"
                        >
                          Edit
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
              <p className="text-sm text-gray-500 mb-4">
                {query || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : "You haven't submitted any placement applications yet."}
              </p>
              {!query && statusFilter === 'all' && (
                <button 
                  onClick={() => navigate('/new-placement')}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <ChevronRight size={16} />
                  Start New Application
                </button>
              )}
            </div>
          )}
        </div>

        {/* Back button */}
        <div className="flex justify-start">
          <button 
            onClick={() => navigate('/applications')}
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 text-sm font-medium px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={16} className="rotate-180" />
            Back to Applications
          </button>
        </div>
      </div>
    </Template>
  )
}