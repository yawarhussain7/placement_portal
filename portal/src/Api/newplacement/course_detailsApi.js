import api from '../axios.js'

export const NewCourse = async(course_data)=>{
    return api.post('/new-placement/course-details',course_data)
}