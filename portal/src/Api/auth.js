import api from './axios.js'

export const loginUser = async (data) => {
    return api.post('/auth/login', data)
}

export const registerUser = async (data) => {
    return api.post('/auth/register', data)
}

export const logoutUser = async () => {
    return api.post('/auth/logout')
}

// Aliases for backward compatibility with existing components
export const Login = loginUser
export const register = registerUser