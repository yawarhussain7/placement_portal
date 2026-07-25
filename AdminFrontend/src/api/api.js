import axios from 'axios'

const api = axios.create({
    baseURL:'http://localhost:8000',
    headers:{
        'Content-Type':'application/json'
    },
    withCredentials:true
})

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if this is a file upload request
        const isUploadRequest = error.config?.data instanceof FormData
        
        if (error.response?.status === 401) {
            // For file uploads, don't redirect - let the component handle the error
            if (isUploadRequest) {
                console.log('Upload failed due to auth error - letting component handle it')
                return Promise.reject(error)
            }
            
            // Only redirect if not already on admin login page to prevent infinite loops
            const currentPath = window.location.pathname;
            if (!currentPath.includes('/auth/admin-login')) {
                window.location.href = '/auth/admin-login';
            }
        }
        return Promise.reject(error)
    }
)

export default api;