import axios from 'axios'

const api = axios.create({
    baseURL:'http://localhost:8000/',
    headers:{
        'Content-Type':'application/json'
    },
    withCredentials:true
})

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - redirect to login
            window.location.href = '/signIn'
        }
        return Promise.reject(error)
    }
)

export default api;