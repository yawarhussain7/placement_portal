import {getTotalStudentsService} from '../../services/admin/dashboard.service.js'

export const AdminDashboardController = async (req, res) => {
    try {
        const totalUser = await getTotalStudentsService()
        console.log(`Total Students: ${totalUser}`)
        return res.status(200).json({
            success: true,
            message: 'Admin dashboard access granted',
            data: {
                admin: req.admin,
                students:totalUser
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data'
        })
    }
}