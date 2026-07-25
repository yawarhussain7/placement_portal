import React, { useState, useEffect } from 'react';
import { FiFileText, FiUpload, FiCheckCircle, FiClock } from 'react-icons/fi';

const RecentStudentUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentUploads = async () => {
      try {
        const response = await fetch('http://localhost:4000/admin/dashboard/documents', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Get first 5 students with their document status
            const recentUploads = result.data.slice(0, 5).map(student => ({
              name: student.name,
              enrollmentNo: student.enrollmentNo,
              uploadedCount: student.uploadedCount,
              progress: student.progress,
              avatar: student.avatar
            }));
            setUploads(recentUploads);
          }
        }
      } catch (error) {
        console.error('Error fetching recent uploads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentUploads();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <h3 className="text-base font-bold text-gray-900 mb-3">Recent Student Uploads</h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-xs text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (uploads.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <h3 className="text-base font-bold text-gray-900 mb-3">Recent Student Uploads</h3>
        <div className="text-center py-8">
          <FiUpload className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-500">No recent uploads</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (progress) => {
    if (progress === 100) return 'bg-green-100 text-green-700';
    if (progress >= 50) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getStatusText = (progress) => {
    if (progress === 100) return 'Complete';
    if (progress >= 50) return 'In Progress';
    return 'Pending';
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-gray-900">Recent Student Uploads</h3>
          <p className="text-xs text-gray-500 mt-0.5">Document submission status</p>
        </div>
        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
          <FiUpload className="w-3.5 h-3.5" />
          <span className="text-[10px] font-semibold">{uploads.length} Students</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2 font-semibold text-gray-700 bg-gray-50">Student</th>
              <th className="text-left py-2 px-2 font-semibold text-gray-700 bg-gray-50">Enrollment</th>
              <th className="text-center py-2 px-2 font-semibold text-gray-700 bg-gray-50">Progress</th>
              <th className="text-center py-2 px-2 font-semibold text-gray-700 bg-gray-50">Status</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((student, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-2.5 px-2">
                  <div className="flex items-center gap-2">
                    <img 
                      src={student.avatar} 
                      alt={student.name}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                    <span className="font-medium text-gray-900 truncate max-w-[120px]">{student.name}</span>
                  </div>
                </td>
                <td className="py-2.5 px-2 text-gray-600 font-mono text-[10px]">
                  {student.enrollmentNo}
                </td>
                <td className="py-2.5 px-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden max-w-[60px]">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-700 min-w-[32px] text-center">
                      {student.uploadedCount}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-2 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusColor(student.progress)}`}>
                    {student.progress === 100 ? <FiCheckCircle className="w-3 h-3" /> : <FiClock className="w-3 h-3" />}
                    {getStatusText(student.progress)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentStudentUploads;