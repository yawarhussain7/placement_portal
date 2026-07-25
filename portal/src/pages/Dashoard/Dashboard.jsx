import { useMemo } from "react";
import DashboardLayout from '../../layout/DashboardLayout'
import StatCard from "../../components/Dashboard/StatCard"
import ApplicationProgressCard from "../../components/Dashboard/ApplicationProgressCard"
import TaskCard from "../../components/Dashboard/TaskCard"
import ActivityCard from "../../components/Dashboard/ActivityCard"
import TicketCard from "../../components/Dashboard/TicketCard"

import {
  BriefcaseBusiness,
  FileText,
  MessageSquare,
  CalendarCheck,
} from "lucide-react";

import { usePortalData } from '../../context/PortalDataContext'

const Dashboard = () => {
  const { data } = usePortalData();

  // stats
  const stats = useMemo(() => ({
    activeApps: data.applications.length,
    verifiedDocs: data.documents.filter(d => d.status === "Verified").length,
    unreadMessages: data.threads.filter(t => t.unread).length,
    interview: data.applications.find(a => a.status === "Interview Scheduled")?.date || "—"
  }), [data]);

  return (
    <DashboardLayout>

      {/* HEADER SECTION */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-primary">
          Welcome, {data.account.fullName}
        </h1>
        <p className="text-xs sm:text-sm text-secondary">
          Your placement dashboard overview
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">

        <StatCard
          label="Active Applications"
          value={stats.activeApps}
          icon={BriefcaseBusiness}
          trend={12}
        />

        <StatCard
          label="Documents Verified"
          value={`${stats.verifiedDocs}/${data.documents.length}`}
          icon={FileText}
          trend={8}
        />

        <StatCard
          label="Unread Messages"
          value={stats.unreadMessages}
          icon={MessageSquare}
          trend={-4}
        />

        <StatCard
          label="Next Interview"
          value={stats.interview}
          icon={CalendarCheck}
        />

      </div>

      {/* APPLICATIONS */}
      <div className="bg-surface rounded-2xl p-4 sm:p-5 mb-6 shadow-pro-lg">

        <h2 className="text-sm sm:text-base font-semibold text-primary mb-3 sm:mb-4">
          Applications
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {data.applications.map(app => (
            <ApplicationProgressCard key={app.id} app={app} />
          ))}
        </div>

      </div>

      {/* TASKS & ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <TaskCard tasks={data.tasks} />
        <ActivityCard activities={data.activity} />
      </div>

      {/* SUPPORT TICKETS */}
      <div className="mb-6">
        <TicketCard tickets={data.tickets} />
      </div>

    </DashboardLayout>
  );
};

export default Dashboard;