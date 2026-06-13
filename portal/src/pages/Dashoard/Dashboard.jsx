import Template from '../../components/common/Template'
import { AlertCircle, BriefcaseBusiness, CalendarCheck, CheckCircle2, ClipboardList, FileText, MessageSquare } from 'lucide-react'
import { usePortalData } from '../../context/PortalDataContext'

const activityIcons = {
  document: CheckCircle2,
  message: MessageSquare,
  application: ClipboardList,
}

const Dashboard = () => {
  const { data, completeTask } = usePortalData()
  const verifiedDocs = data.documents.filter((doc) => doc.status === 'Verified').length
  const unreadMessages = data.threads.filter((thread) => thread.unread).length
  const nextInterview = data.applications.find((app) => app.status === 'Interview Scheduled')?.date || 'None'
  const activeApplications = data.applications.filter((app) => app.status !== 'Archived').length
  const averageProgress = Math.round(data.applications.reduce((sum, app) => sum + app.progress, 0) / Math.max(data.applications.length, 1))

  const stats = [
    { label: 'Active applications', value: activeApplications, icon: BriefcaseBusiness },
    { label: 'Documents verified', value: `${verifiedDocs}/${data.documents.length}`, icon: FileText },
    { label: 'Unread messages', value: unreadMessages, icon: MessageSquare },
    { label: 'Upcoming interview', value: nextInterview, icon: CalendarCheck },
  ]

  return (
    <Template
      title="Dashboard"
      description="Overview of your WebMantis placement progress"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="card border rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted">{label}</p>
                  <p className="text-2xl font-bold text-primary mt-1">{value}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-accent-subtle text-accent flex items-center justify-center">
                  <Icon size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_0.65fr] gap-5">
          <section className="card border rounded-lg overflow-hidden">
            <div className="p-5 border-b border-base flex items-center justify-between gap-4">
              <div>
                <h2 className="font-bold text-primary">Placement Progress</h2>
                <p className="text-xs text-muted mt-1">Live progress from every active application.</p>
              </div>
              <span className="text-xs font-bold text-accent bg-accent-subtle px-3 py-1 rounded-full">{averageProgress}% average</span>
            </div>
            <div className="p-5 space-y-5">
              {data.applications.map((app) => (
                <div key={app.id}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-semibold text-secondary">{app.role}</span>
                    <span className="text-muted">{app.progress}%</span>
                  </div>
                  <div className="h-2 bg-subtle rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${app.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card border rounded-lg overflow-hidden">
            <div className="p-5 border-b border-base">
              <h2 className="font-bold text-primary">Priority Tasks</h2>
              <p className="text-xs text-muted mt-1">Click a task to mark it done.</p>
            </div>
            <div className="divide-y divide-base">
              {data.tasks.map((task) => (
                <button key={task.id} onClick={() => completeTask(task.id)} className="w-full text-left p-4 flex items-start gap-3 hover:bg-subtle">
                  <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center ${task.done ? 'bg-accent-subtle text-accent' : task.urgent ? 'bg-amber-50 text-amber-700' : 'bg-subtle text-secondary'}`}>
                    {task.done ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${task.done ? 'text-muted line-through' : 'text-primary'}`}>{task.title}</p>
                    <p className="text-xs text-muted mt-1">{task.due}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="card border rounded-lg overflow-hidden">
          <div className="p-5 border-b border-base">
            <h2 className="font-bold text-primary">Recent Activity</h2>
            <p className="text-xs text-muted mt-1">Updates generated by real actions in this portal.</p>
          </div>
          <div className="divide-y divide-base">
            {data.activity.map((item) => {
              const Icon = activityIcons[item.type] || ClipboardList
              return (
                <div key={item.id} className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent-subtle text-accent flex items-center justify-center flex-shrink-0">
                    <Icon size={19} />
                  </div>
                  <div>
                    <p className="font-bold text-primary">{item.title}</p>
                    <p className="text-sm text-secondary mt-1">{item.detail}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </Template>
  )
}

export default Dashboard
