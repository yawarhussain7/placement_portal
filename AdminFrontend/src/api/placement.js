import api from './api.js'

// Get all placements
export const getPlacements = async () => {
  try {
    const response = await api.get('/admin/placements');  
    return response.data;
  } catch(error) {
    console.error('Error fetching placements:', error);
    throw error;
  }
}

// Get placement by ID
export const getPlacementById = async (id) => {
  try {
    const response = await api.get(`/admin/placements/${id}`);  
    return response.data;
  } catch(error) {
    console.error('Error fetching placement:', error);
    throw error;
  }
}

// Update placement field
export const updatePlacementField = async (id, section, field, value) => {
  try {
    const response = await api.put(`/admin/placements/${id}`, {
      section,
      field,
      value
    });
    return response.data;
  } catch(error) {
    console.error('Error updating placement:', error);
    throw error;
  }
}

// Verify document
export const verifyDocument = async (id, docId) => {
  try {
    const response = await api.post(`/admin/placements/${id}/verify/${docId}`);
    return response.data;
  } catch(error) {
    console.error('Error verifying document:', error);
    throw error;
  }
}

// Reject document
export const rejectDocument = async (id, docId) => {
  try {
    const response = await api.post(`/admin/placements/${id}/reject/${docId}`);
    return response.data;
  } catch(error) {
    console.error('Error rejecting document:', error);
    throw error;
  }
}
