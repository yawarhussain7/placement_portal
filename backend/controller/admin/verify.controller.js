export const verifyAdminController = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: 'Admin verified successfully',
            data: {
                admin: req.admin,
                role: 'admin'
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Verification failed'
        })
    }
}