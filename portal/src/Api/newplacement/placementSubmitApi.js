import api from '../axios.js'
import { createPlacement } from '../placement.js'

export const submitPlacementApplication = async (formData) => {
    try {
        console.log('Creating placement application with files...')
        
        // Step 1: Create placement as draft
        const createResponse = await createPlacement(formData)
        
        if (!createResponse.data?.success) {
            throw new Error(createResponse.data?.message || 'Failed to create placement')
        }
        
        const placementId = createResponse.data.data._id
        console.log('Placement created as draft with ID:', placementId)
        
        // Step 2: Submit the placement
        console.log('Submitting placement for review...')
        const submitResponse = await api.post(`/placement/${placementId}/submit`)
        
        if (!submitResponse.data?.success) {
            throw new Error(submitResponse.data?.message || 'Failed to submit placement')
        }
        
        console.log('Placement submitted successfully:', submitResponse.data)
        return submitResponse
    } catch (error) {
        console.error('Error submitting placement:', error.response?.data || error.message)
        throw error
    }
}
