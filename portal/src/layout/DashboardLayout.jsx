import EmpHeader from "../components/Dashboard/EmpHeader"
import Sidebar from '../components/common/Slidebar'

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Your HEADER component */}
        <EmpHeader />

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;