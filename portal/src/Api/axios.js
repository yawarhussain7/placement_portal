import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true
})

// Request logging
api.interceptors.request.use(
    (config) => {
        console.log('API Request:', config.method.toUpperCase(), config.url)
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response handling and logging
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url)
        return response
    },
    (error) => {
        console.error('API Error:', error.response?.status, error.config?.url, error.message)
        console.error('API Error Response:', error.response?.data)
        
        // Check if this is a file upload request
        const isUploadRequest = error.config?.data instanceof FormData
        
        if (error.response?.status === 401) {
            // For file uploads, don't redirect - let the component handle the error
            if (isUploadRequest) {
                console.log('Upload failed due to auth error - letting component handle it')
                return Promise.reject(error)
            }
            
            // Only clear token and redirect if not already on auth page to prevent infinite loops
            const currentPath = window.location.pathname
            if (!currentPath.includes('/auth/login') && !currentPath.includes('/auth/register')) {
                // Clear auth data
                localStorage.removeItem('auth_token')
                localStorage.removeItem('webmantisPortalData')
                
                // Dispatch event to reset portal data context
                window.dispatchEvent(new Event('auth-token-changed'))
                // Redirect to login page
                window.location.href = '/auth/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api;