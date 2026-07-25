import api from './api.js'

export const getReportsData = async (filters = {}) => {
    try {
        const params = new URLSearchParams()
        
        if (filters.academicYear) params.append('academicYear', filters.academicYear)
        
        const response = await api.get(`/admin/reports?${params.toString()}`)
        return response.data
    } catch (error) {
        console.error('Error fetching reports:', error)
        throw error
    }
}

export const exportReport = async (type) => {
    try {
        const response = await api.get(`/admin/reports/export/${type}`)
        return response.data
    } catch (error) {
        console.error('Error exporting report:', error)
        throw error
    }
}