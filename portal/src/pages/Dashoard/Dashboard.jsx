import { useState, useMemo } from 'react'
import Template from '../../components/common/Template'
import {
  AlertCircle, BriefcaseBusiness, CalendarCheck, CheckCircle2,
  ClipboardList, FileText, MessageSquare, TrendingUp, TrendingDown,
  Clock, ArrowUpRight, ArrowDownRight, MoreHorizontal, RefreshCw,
  Activity, Award, Users, Target
} from 'lucide-react'
import { usePortalData } from '../../context/PortalDataContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts'

// ─── Color palette ──────────────────────────────────────────────────────────────
const colors = {
  primary: '#12692e',
  primaryLight: '#e8f5e9',
  accent: '#2563eb',
  amber: '#f59e0b',
  rose: '#e11d48',
  violet: '#7c3aed',
  teal: '#0d9488',
  gray: { 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827' },
  green: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' },
  blue: { 50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 600: '#2563eb' },
  amber2: { 50: '#fffbeb', 100: '#fef3c7', 500: '#f59e0b' },
  purple: { 50: '#faf5ff', 500: '#a855f7' },
}

const CHART_COLORS = ['#12692e', '#2563eb', '#f59e0b', '#7c3aed', '#0d9488', '#e11d48']

// ─── Stat Card ───────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, trend, trendLabel, color = 'green' }) => {
  const colorMap = {
    green: { bg: colors.green[50], text: colors.green[600], icon: colors.green[600] },
    blue: { bg: colors.blue[50], text: colors.blue[600], icon: colors.blue[500] },
    amber: { bg: colors.amber2[50], text: colors.amber, icon: colors.amber },
    purple: { bg: colors.purple[50], text: colors.violet, icon: colors.purple[500] },
  }
  const c = colorMap[color] || colorMap.green

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1.5">
              {trend > 0
                ? <TrendingUp size={14} className="text-green-500" />
                : <TrendingDown size={14} className="text-red-500" />
              }
              <span className={`text-xs font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
              {trendLabel && <span className="text-xs text-gray-400">{trendLabel}</span>}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${c.bg}`} style={{ color: c.icon }}>
          <Icon size={22} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  )
}

// ─── Progress Bar Card (for right sidebar) ───────────────────────────────────────
const ApplicationProgressCard = ({ app }) => {
  const statusColor = (s) => {
    if (s === 'Interview Scheduled' || s === 'Documents Under Review') return 'bg-blue-500'
    if (s === 'Submitted' || s === 'Verified') return 'bg-green-500'
    if (s === 'Draft') return 'bg-amber-500'
    return 'bg-gray-400'
  }

  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-800 truncate">{app.role}</p>
          <p className="text-xs text-gray-400 truncate">{app.company}</p>
        </div>
        <span className="text-xs font-bold text-gray-500 ml-3">{app.progress}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${statusColor(app.status)}`}
          style={{ width: `${app.progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          app.status === 'Draft' ? 'bg-amber-50 text-amber-700' :
          app.status === 'Interview Scheduled' ? 'bg-blue-50 text-blue-700' :
          app.status === 'Submitted' ? 'bg-green-50 text-green-700' :
          'bg-gray-100 text-gray-600'
        }`}>{app.status}</span>
        <span className="text-xs text-gray-400">{app.date}</span>
      </div>
    </div>
  )
}

// ─── Main Dashboard Component ────────────────────────────────────────────────────
const Dashboard = () => {
  const { data, completeTask, refreshDashboard } = usePortalData()
  const [refreshing, setRefreshing] = useState(false)

  // Derived stats
  const verifiedDocs = data.documents.filter((doc) => doc.status === 'Verified').length
  const unreadMessages = data.threads.filter((thread) => thread.unread).length
  const nextInterview = data.applications.find((app) => app.status === 'Interview Scheduled')?.date || 'None'
  const activeApplications = data.applications.filter((app) => app.status !== 'Archived').length
  const pendingTasks = data.tasks.filter((t) => !t.done).length
  const averageProgress = Math.round(data.applications.reduce((sum, app) => sum + app.progress, 0) / Math.max(data.applications.length, 1))

  // Chart data: application progress
  const barChartData = useMemo(() =>
    data.applications.map((app) => ({
      name: app.role.length > 18 ? app.role.slice(0, 16) + '…' : app.role,
      progress: app.progress,
      status: app.status,
    })),
  [data.applications])

  // Pie chart: document status
  const docStatusData = useMemo(() => {
    const counts = { Verified: 0, 'Needs Update': 0, Uploaded: 0, 'Not Uploaded': 0 }
    data.documents.forEach((d) => {
      if (d.status === 'Verified') counts.Verified++
      else if (d.status === 'Needs Update') counts['Needs Update']++
      else if (d.status === 'Uploaded' || d.status === 'Uploaded') counts.Uploaded++
      else counts['Not Uploaded']++
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [data.documents])

  // Activity timeline data (simulated monthly)
  const activityChartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map((month, i) => ({
      month,
      applications: Math.floor(Math.random() * 4 + 1 + i),
      messages: Math.floor(Math.random() * 6 + 2 + i),
      documents: Math.floor(Math.random() * 3 + i),
    }))
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await refreshDashboard()
    setTimeout(() => setRefreshing(false), 600)
  }

  // ── Activity icons ──
  const activityIcons = {
    document: CheckCircle2,
    message: MessageSquare,
    application: ClipboardList,
  }

  return (
    <Template
      title="Dashboard"
      description="Overview of your WebMantis placement progress"
    >
      {/* ── Header with refresh ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {data.account.fullName?.split(' ')[0] || 'User'} 👋</h1>
          <p className="text-sm text-gray-400 mt-1">Here's what's happening with your placements today.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Applications" value={activeApplications} icon={BriefcaseBusiness} trend={12} trendLabel="vs last month" color="green" />
        <StatCard label="Documents Verified" value={`${verifiedDocs}/${data.documents.length}`} icon={FileText} trend={8} trendLabel="vs last month" color="blue" />
        <StatCard label="Unread Messages" value={unreadMessages} icon={MessageSquare} trend={-5} trendLabel="vs last month" color="amber" />
        <StatCard label="Upcoming Interview" value={nextInterview === 'None' ? '—' : nextInterview} icon={CalendarCheck} color="purple" />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        {/* Bar Chart — Application Progress */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-gray-900">Application Progress</h2>
              <p className="text-xs text-gray-400 mt-0.5">Current completion status across all applications</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{averageProgress}% avg</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} barSize={36} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[100]} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: colors.gray[400] }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: colors.gray[400] }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: colors.gray[50] }}
                  contentStyle={{ borderRadius: 12, border: '1px solid ' + colors.gray[200], boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  labelStyle={{ fontWeight: 600, fontSize: 12, color: colors.gray[700] }}
                />
                <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
                  {barChartData.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart — Document Status */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-gray-900">Documents</h2>
              <p className="text-xs text-gray-400 mt-0.5">Verification status overview</p>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={docStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={76}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {docStatusData.map((entry, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid ' + colors.gray[200], boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {docStatusData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                <span className="text-xs font-medium text-gray-500">{entry.name}</span>
                <span className="text-xs font-bold text-gray-700">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Section: Activity Chart + Tasks + Progress ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.6fr] gap-5 mb-6">
        {/* Activity Line Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-gray-900">Activity Trends</h2>
              <p className="text-xs text-gray-400 mt-0.5">Monthly activity breakdown</p>
            </div>
            <Activity size={18} className="text-gray-300" />
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityChartData}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMsgs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.accent} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={colors.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[100]} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: colors.gray[400] }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: colors.gray[400] }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid ' + colors.gray[200], boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <Area type="monotone" dataKey="applications" stroke={colors.primary} strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" name="Applications" />
                <Area type="monotone" dataKey="messages" stroke={colors.accent} strokeWidth={2} fillOpacity={1} fill="url(#colorMsgs)" name="Messages" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-5 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#12692e]" />
              <span className="text-xs text-gray-500">Applications</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2563eb]" />
              <span className="text-xs text-gray-500">Messages</span>
            </div>
          </div>
        </div>

        {/* Priority Tasks */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Priority Tasks</h2>
              <p className="text-xs text-gray-400 mt-0.5">{pendingTasks} pending</p>
            </div>
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
            {data.tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => completeTask(task.id)}
                className="w-full text-left p-3.5 rounded-xl flex items-start gap-3 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group"
              >
                <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                  task.done
                    ? 'bg-green-100 text-green-600'
                    : task.urgent
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-gray-100 text-gray-400'
                }`}>
                  {task.done ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold transition-all ${task.done ? 'text-gray-300 line-through' : 'text-gray-800 group-hover:text-gray-900'}`}>
                    {task.title}
                  </p>
                  <p className={`text-xs mt-0.5 ${task.done ? 'text-gray-200' : 'text-gray-400'}`}>{task.due}</p>
                </div>
                {task.urgent && !task.done && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Urgent</span>
                )}
              </button>
            ))}
            {data.tasks.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-green-300" />
                <p className="text-sm font-medium">All tasks completed!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom: Application Progress Cards ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-gray-900">Placement Progress</h2>
            <p className="text-xs text-gray-400 mt-0.5">Live progress across all active applications</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">Average</span>
            <span className="text-sm font-bold text-gray-800">{averageProgress}%</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {data.applications.map((app) => (
            <ApplicationProgressCard key={app.id} app={app} />
          ))}
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
            <p className="text-xs text-gray-400 mt-0.5">Updates generated by your actions</p>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {data.activity.map((item) => {
            const Icon = activityIcons[item.type] || ClipboardList
            return (
              <div key={item.id} className="py-4 flex items-start gap-4 hover:bg-gray-50/50 -mx-2 px-2 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>
                </div>
              </div>
            )
          })}
          {data.activity.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Activity size={28} className="mx-auto mb-2 text-gray-200" />
              <p className="text-sm">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </Template>
  )
}

export default Dashboard