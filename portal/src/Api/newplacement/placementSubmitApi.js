import api from '../axios.js'

export const submitPlacementApplication = async (formData) => {
    return api.post('/new-placement/submit-application', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}