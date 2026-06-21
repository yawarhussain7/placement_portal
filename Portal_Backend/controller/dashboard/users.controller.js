import User from '../../model/auth/authUser.model.js'

export const getUsers = async (req, res) => {
    try {
        const currentUserId = req.user?.id || req.user?._id || null

        // Fetch all users except the current one
        const filter = currentUserId ? { _id: { $ne: currentUserId } } : {}
        const users = await User.find(filter)
            .select('username email avatar bio phone createdAt')
            .sort({ createdAt: -1 })
            .lean()

        const formatted = users.map((u) => ({
            id: u._id.toString(),
            name: u.username,
            email: u.email,
            role: 'Registered User',
            avatar: u.avatar || '',
            bio: u.bio || '',
            online: false, // Could be enhanced with socket.io presence
            createdAt: u.createdAt,
        }))

        res.status(200).json({ success: true, data: formatted })
    } catch (error) {
        console.error('GET USERS ERROR:', error)
        res.status(500).json({ message: error.message || 'Failed to fetch users', success: false })
    }
}