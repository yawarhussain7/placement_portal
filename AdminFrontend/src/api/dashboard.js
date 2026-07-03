import api from './api.js'

export const getTotalStudents = async()=>{
    return api.get("/admin/dashboard/stats", { timeout: 3000 })
}