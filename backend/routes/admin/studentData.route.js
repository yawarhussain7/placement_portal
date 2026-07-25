import express from 'express'
import{getAllStudentsController,getStudentByNameController,getStudentByEmailController,getStudentByActiveController,AdminAddStudentController,AdminUpdateStudentController,AdminDeleteStudentController,exportStudentsController} from '../../controller/admin/studentData.controller.js'
import {AdminAuthMiddleware}from '../../middleware/admin.middleware.js'
const route = express.Router()

// Get all students
route.get('/',AdminAuthMiddleware,getAllStudentsController)

// Add new student
route.post('/add',AdminAuthMiddleware,AdminAddStudentController)

// Update student
route.put('/update-student/:id',AdminAuthMiddleware,AdminUpdateStudentController)

// Delete student
route.delete('/delete-student/:id',AdminAuthMiddleware,AdminDeleteStudentController)

// Export students to CSV
route.post('/export',AdminAuthMiddleware,exportStudentsController)

// Get student by name
route.post('/search/name',AdminAuthMiddleware,getStudentByNameController)

// Get student by email
route.post('/search/email',AdminAuthMiddleware,getStudentByEmailController)

// Get student by active status
route.post('/search/active',AdminAuthMiddleware,getStudentByActiveController)


export default route
