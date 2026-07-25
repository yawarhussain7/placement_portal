import studentModel from '../../Model/portal/auth.model.js'

export const getTotalStudentsService = async()=>{
    return await studentModel.countDocuments()
}