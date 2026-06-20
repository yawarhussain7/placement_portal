import { useMemo, useState } from 'react'
import Template from '../../components/common/Template'
import { CalendarDays, FileText, Plus, Search, UserRoundCheck } from 'lucide-react'
import { usePortalData } from '../../context/PortalDataContext'

const statusTone = {
  'Interview Scheduled': 'bg-accent-subtle text-accent',
  'Documents Under Review': 'bg-amber-50 text-amber-700',
  Submitted: 'bg-blue-50 text-blue-700',
  Draft: 'bg-subtle text-secondary',
}

const emptyDraft = { role: '', company: '', advisor: 'Sarah Mitchell', notes: '' }

export default function Applications() {
  const { data, addApplication, updateApplication } = usePortalData()
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(data.applications[0]?.id)
  const [draft, setDraft] = useState(emptyDraft)

  const filtered = useMemo(() => {
    const term = query.toLowerCase()
    return data.applications.filter((app) => [app.role, app.company, app.status, app.advisor].join(' ').toLowerCase().includes(term))
  }, [data.applications, query])

  const selected = data.applications.find((app) => app.id === selectedId) || filtered[0] || data.applications[0]
  const interviews = data.applications.filter((app) => app.status === 'Interview Scheduled').length
  const averageProgress = Math.round(data.applications.reduce((sum, app) => sum + app.progress, 0) / Math.max(data.applications.length, 1))

  const createApplication = (event) => {
    event.preventDefault()
    if (!draft.role.trim() || !draft.company.trim()) return
    addApplication(draft)
    setDraft(emptyDraft)
  }

  return (
    <Template title="My Applications" description="Track and manage your active placement applications">
      <div className="space-y-4 sm:space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: 'Active applications', value: data.applications.length, icon: FileText },
            { label: 'Interviews booked', value: interviews, icon: CalendarDays },
            { label: 'Average progress', value: `${averageProgress}%`, icon: UserRoundCheck },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card border rounded-lg p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] sm:text-xs font-semibold text-muted">{label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary mt-1">{value}</p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-accent-subtle text-accent flex items-center justify-center">
                  <Icon size={18} className="sm:size-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 sm:gap-5">
          {/* Pipeline list */}
          <div className="card border rounded-lg overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-base flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-primary">Application Pipeline</h2>
                <p className="text-xs text-muted mt-1">Select any application to edit details.</p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search size={15} className="sm:size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="input-base w-full border rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm" placeholder="Search applications" />
              </div>
            </div>

            <div className="divide-y divide-base">
              {filtered.map((app) => (
                <button key={app.id} onClick={() => setSelectedId(app.id)} className={`w-full text-left p-4 sm:p-5 hover:bg-subtle transition-colors ${selected?.id === app.id ? 'bg-accent-subtle' : ''}`}>
                  <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-primary">{app.role}</h3>
                        <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:py-1 rounded-full ${statusTone[app.status] || 'bg-subtle text-secondary'}`}>{app.status}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-secondary mt-1">{app.company}</p>
                      <div className="flex flex-wrap gap-3 sm:gap-4 mt-2 sm:mt-3 text-[11px] sm:text-xs text-muted">
                        <span>{app.id}</span>
                        <span>Advisor: {app.advisor}</span>
                        <span>Updated: {app.date}</span>
                      </div>
                    </div>

                    <div className="w-full lg:w-64">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-secondary">{app.stage}</span>
                        <span className="text-muted">{app.progress}%</span>
                      </div>
                      <div className="h-2 bg-subtle rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${app.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 sm:space-y-5">
            {selected && (
              <form className="card border rounded-lg p-4 sm:p-5 space-y-3 sm:space-y-4" onSubmit={(event) => event.preventDefault()}>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-primary">Edit Application</h2>
                  <p className="text-xs text-muted mt-1">{selected.id}</p>
                </div>
                <label className="space-y-1.5 block">
                  <span className="text-xs font-bold text-primary">Role</span>
                  <input className="input-base w-full border rounded-lg px-3 py-2 text-xs sm:text-sm" value={selected.role} onChange={(event) => updateApplication(selected.id, { role: event.target.value })} />
                </label>
                <label className="space-y-1.5 block">
                  <span className="text-xs font-bold text-primary">Status</span>
                  <select className="input-base w-full border rounded-lg px-3 py-2 text-xs sm:text-sm" value={selected.status} onChange={(event) => updateApplication(selected.id, { status: event.target.value })}>
                    <option>Draft</option>
                    <option>Submitted</option>
                    <option>Documents Under Review</option>
                    <option>Interview Scheduled</option>
                    <option>Offer Received</option>
                  </select>
                </label>
                <label className="space-y-1.5 block">
                  <span className="text-xs font-bold text-primary">Progress: {selected.progress}%</span>
                  <input type="range" min="0" max="100" value={selected.progress} onChange={(event) => updateApplication(selected.id, { progress: Number(event.target.value) })} className="w-full accent-green-600" />
                </label>
                <label className="space-y-1.5 block">
                  <span className="text-xs font-bold text-primary">Advisor Notes</span>
                  <textarea className="input-base w-full border rounded-lg px-3 py-2 text-xs sm:text-sm resize-none" rows={4} value={selected.notes} onChange={(event) => updateApplication(selected.id, { notes: event.target.value })} />
                </label>
              </form>
            )}

            <form onSubmit={createApplication} className="card border rounded-lg p-4 sm:p-5 space-y-3 sm:space-y-4">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-primary">Create Draft</h2>
                <p className="text-xs text-muted mt-1">Add a placement target to the pipeline.</p>
              </div>
              <input className="input-base w-full border rounded-lg px-3 py-2 text-xs sm:text-sm" placeholder="Role title" value={draft.role} onChange={(event) => setDraft((current) => ({ ...current, role: event.target.value }))} />
              <input className="input-base w-full border rounded-lg px-3 py-2 text-xs sm:text-sm" placeholder="Company name" value={draft.company} onChange={(event) => setDraft((current) => ({ ...current, company: event.target.value }))} />
              <button className="w-full inline-flex items-center justify-center gap-2 bg-accent hover-accent text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors">
                <Plus size={15} className="sm:size-4" />
                Add Draft
              </button>
            </form>
          </aside>
        </div>
      </div>
    </Template>
  )
}