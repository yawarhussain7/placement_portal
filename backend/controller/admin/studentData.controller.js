import {
    getStudentService, getStudentByNameService,
    getStudentByEmailService, getStudentActiveService,
    AdminAddStudentService, AdminUpdateStudentService, AdminDeleteStudentService, exportStudentsService
} from '../../services/admin/student.service.js'

export const getAllStudentsController = async (req, res) => {
    try {
        const students = await getStudentService()
        if (!students) {
            return res.status(404).json({
                message: 'students not found',
                success: false
            })
        }

        return res.status(200).json({
            message: 'Students found successfully',
            success: true,
            data: students
        })
    } catch (error) {
        return res.status(500).json({
            message: 'StudentData eroror',
            success: false
        })
    }
}

export const getStudentByNameController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            throw new Error('Student name must be entered')
        }
        const student = await getStudentByNameService({ name })
        if (!student) {
            return res.status(404).json({
                message: 'student not found',
                success: false
            })
        }

        return res.status(200).json({
            message: 'Student found successfully',
            success: true,
            data: student
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Student by name not found ',
            success: false
        })
    }
}

export const getStudentByEmailController = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            throw new Error('Email must be entered')
        }

        const student = await getStudentByEmailService(email)
        if (!student) {
            return res.status(404).json({
                message: 'student not found',
                success: false
            })
        }

        return res.status(200).json({
            message: 'Student found successfully',
            success: true,
            data: student
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Student by email not found ',
            success: false
        })
    }
}

export const getStudentByActiveController = async (req, res) => {
    try {
        const { status } = req.body
        if (!status) {
            throw new Error('Status must be entered')
        }

        const student = await getStudentActiveService(status)
        if (!student) {
            return res.status(404).json({
                message: 'student not found',
                success: false
            })
        }

        return res.status(200).json({
            message: 'Student found successfully',
            success: true,
            data: student
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Student by active not found ',
            success: false
        })
    }
}

export const AdminAddStudentController = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                message: 'All fields must be valid',
                success: false
            })
        }

        const student = await AdminAddStudentService(req.body)
        if (!student) {
            return res.status(400).json({
                message: 'Student not created',
                success: false
            })
        }

        return res.status(201).json({
            message: 'Student Added successfully',
            success: true,
            data: student
        })

    } catch (error) {
        console.error('Error adding student:', error)
        return res.status(400).json({
            message: error.message || 'Student not Added',
            success: false
        })
    }
}

export const AdminUpdateStudentController = async (req, res) => {
    try {
        const { id } = req.params
        const studentData = req.body

        if (!id) {
            return res.status(400).json({
                message: 'Student ID is required',
                success: false
            })
        }

        const student = await AdminUpdateStudentService(id, studentData)
        if (!student) {
            return res.status(404).json({
                message: 'Student not found',
                success: false
            })
        }
        return res.status(200).json({
            message: 'Student updated successfully',
            success: true,
            data: student
        })
    } catch (error) {
        console.error('Error updating student:', error)
        return res.status(400).json({
            message: error.message || 'Student not updated',
            success: false
        })
    }
}

// Delete student
export const AdminDeleteStudentController = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                message: 'Student ID is required',
                success: false
            })
        }

        const student = await AdminDeleteStudentService(id)
        if (!student) {
            return res.status(404).json({
                message: 'Student not found',
                success: false
            })
        }

        return res.status(200).json({
            message: 'Student deleted successfully',
            success: true,
            data: student
        })

    } catch (error) {
        console.error('Error deleting student:', error)
        return res.status(400).json({
            message: error.message || 'Student not deleted',
            success: false
        })
    }
}

// Export students to CSV
export const exportStudentsController = async (req, res) => {
    try {
        const { ids } = req.body
        
        const csv = await exportStudentsService(ids)
        
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename=students.csv')
        res.send(csv)
    } catch (error) {
        console.error('Error exporting students:', error)
        return res.status(400).json({
            message: error.message || 'Failed to export students',
            success: false
        })
    }
}
