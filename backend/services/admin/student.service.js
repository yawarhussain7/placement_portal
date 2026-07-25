import studentModel from '../../Model/portal/auth.model.js'
import bcrypt from 'bcrypt'

export const getStudentService = async()=>{
    return await studentModel.find().select('-password')
}


// FIlters
export const getStudentByNameService = async({name})=>{
    const student = await studentModel.findOne({fullName:name}).select('-password')
    if(!student){
        throw new Error('Student not found')
    }
    return student
}

export const getStudentByEmailService = async(email)=>{
     const student = await studentModel.findOne({email}).select('-password')
    if(!student){
        throw new Error('Student not found')
    }
    return student
}

export const getStudentActiveService = async(status)=>{
     const student = await studentModel.findOne({status:status}).select('-password')
    if(!student){
        throw new Error('Student not found')
    }
    return student
}

// Add new student
export const AdminAddStudentService = async(student_data)=>{
    try {
        console.log('Received student data:', student_data)
        
        const { fullName, email, username, phone, dateOfBirth, password } = student_data
        
        // Validate required fields
        if (!fullName || !email || !password) {
            throw new Error('Full name, email, and password are required')
        }

        const existStudent = await studentModel.findOne({ email })
        if (existStudent) {
            throw new Error('Student with this email already exists')
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        console.log('Password hashed successfully')

        const student = await studentModel.create({
            fullName,
            email,
            username: username || 'New User',
            phone,
            dateOfBirth,
            password: hashedPassword,
            isActive: true,
            isVerified: false
        })
        console.log('Student created:', student._id)

        // Return student without password
        return await studentModel.findById(student._id).select('-password')
    } catch (error) {
        console.error('Error in AdminAddStudentService:', error)
        throw error
    }
}

// Update student
export const AdminUpdateStudentService = async(student_id, student_data)=>{
    try {
        console.log('Updating student:', student_id, student_data)
        
        const { fullName, email, username, phone, dateOfBirth, password, isActive, isVerified } = student_data
        
        // Check if student exists
        const existStudent = await studentModel.findById(student_id)
        if (!existStudent) {
            throw new Error('Student not found')
        }

        // Check if email is being changed and if it already exists
        if (email && email !== existStudent.email) {
            const emailExists = await studentModel.findOne({ email })
            if (emailExists) {
                throw new Error('Email already exists')
            }
        }

        // Prepare update data
        const updateData = {
            fullName: fullName || existStudent.fullName,
            email: email || existStudent.email,
            username: username || existStudent.username,
            phone: phone || existStudent.phone,
            dateOfBirth: dateOfBirth || existStudent.dateOfBirth,
            isActive: isActive ?? existStudent.isActive,
            isVerified: isVerified ?? existStudent.isVerified
        }

        // Only update password if provided
        if (password) {
            const salt = await bcrypt.genSalt(10)
            updateData.password = await bcrypt.hash(password, salt)
        }

        const updatedStudent = await studentModel.findByIdAndUpdate(
            student_id,
            updateData,
            { new: true }
        ).select('-password')

        console.log('Student updated successfully:', updatedStudent._id)
        return updatedStudent
    } catch (error) {
        console.error('Error in AdminUpdateStudentService:', error)
        throw error
    }
}

export const AdminDeleteStudentService = async(student_id)=>{
    try {
        const student = await studentModel.findByIdAndDelete(student_id)
        if (!student) {
            throw new Error('Student not found')
        }
        return student
    } catch (error) {
        console.error('Error in AdminDeleteStudentService:', error)
        throw error
    }
}

// Export students to CSV
export const exportStudentsService = async(ids) => {
    try {
        let students
        if (ids && ids.length > 0) {
            students = await studentModel.find({ '_id': { $in: ids } }).select('-password')
        } else {
            students = await studentModel.find().select('-password')
        }

        // Create CSV header
        let csv = 'Full Name,Username,Email,Phone,Gender,Date of Birth,Active,Verified,Created At\n'

        // Add student data
        students.forEach(student => {
            const row = [
                student.fullName,
                student.username,
                student.email,
                student.phone || '',
                student.gender || '',
                student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '',
                student.isActive ? 'Yes' : 'No',
                student.isVerified ? 'Yes' : 'No',
                student.createdAt ? new Date(student.createdAt).toLocaleDateString() : ''
            ]
            csv += row.map(field => `"${field}"`).join(',') + '\n'
        })

        return csv
    } catch (error) {
        console.error('Error in exportStudentsService:', error)
        throw error
    }
}
