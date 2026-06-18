import { useMemo } from "react";
import DashboardLayout from '../../layout/DashboardLayout'
import StatCard from "../../components/Dashboard/StatCard"
import ApplicationProgressCard from "../../components/Dashboard/ApplicationProgressCard"

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {data.account.fullName}
        </h1>
        <p className="text-sm text-gray-500">
          Your placement dashboard overview
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

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
      <div className="bg-white border rounded-xl p-5 mb-6">

        <h2 className="font-semibold text-gray-800 mb-4">
          Applications
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.applications.map(app => (
            <ApplicationProgressCard key={app.id} app={app} />
          ))}
        </div>

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;