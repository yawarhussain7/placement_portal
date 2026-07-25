import api from './api.js'

// Get all students
export const getStudents = async () => {
  try {
    const response = await api.get('/admin/students');  
    return response.data;
  } catch(error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}

// Add new student
export const addStudent = async (studentData) => {
  try {
    const response = await api.post('/admin/students/add', studentData);
    return response.data;
  } catch(error) {
    console.error('Error adding student:', error);
    throw error;
  }
}

// Update student
export const updateStudent = async (id, studentData) => {
  try {
    const response = await api.put(`/admin/students/update-student/${id}`, studentData);
    return response.data;
  } catch(error) {
    console.error('Error updating student:', error);
    throw error;
  }
}

// Delete student
export const deleteStudent = async (id) => {
  try {
    const response = await api.delete(`/admin/students/delete-student/${id}`);
    return response.data;
  } catch(error) {
    console.error('Error deleting student:', error);
    throw error;
  }
}

// Bulk delete students
export const bulkDeleteStudents = async (ids) => {
  try {
    const response = await api.post('/admin/students/bulk-delete', { ids });
    return response.data;
  } catch(error) {
    console.error('Error bulk deleting students:', error);
    throw error;
  }
}

// Search students by name
export const searchStudentsByName = async (name) => {
  try {
    const response = await api.post('/admin/students/search/name', { name });
    return response.data;
  } catch(error) {
    console.error('Error searching students by name:', error);
    throw error;
  }
}

// Search students by email
export const searchStudentsByEmail = async (email) => {
  try {
    const response = await api.post('/admin/students/search/email', { email });
    return response.data;
  } catch(error) {
    console.error('Error searching students by email:', error);
    throw error;
  }
}

// Search students by active status
export const searchStudentsByActive = async (status) => {
  try {
    const response = await api.post('/admin/students/search/active', { status });
    return response.data;
  } catch(error) {
    console.error('Error searching students by active status:', error);
    throw error;
  }
}

// Export students to CSV
export const exportStudents = async (ids) => {
  try {
    const response = await api.post('/admin/students/export', { ids }, {
      responseType: 'blob'
    });
    return response.data;
  } catch(error) {
    console.error('Error exporting students:', error);
    throw error;
  }
}
