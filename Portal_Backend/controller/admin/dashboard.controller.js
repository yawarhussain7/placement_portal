import { getAdminStatsService } from '../../service/dashboard/dashboard.service.js'

export const dashboardStats = async (req, res) => {
  try {
    const data = await getAdminStatsService();

    res.json({
      success: true,
      data: {
        totalStudents: data.totalStudents,
        totalApplications: data.totalApplications,
        placedStudents: data.placedStudents,
        partnerCompanies: data.partnerCompanies,
        recentApplications: data.recentApplications,
        pipelineData: data.pipelineData
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Dashboard service not available",
    });
  }
};
