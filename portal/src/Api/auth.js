import api from './axios.js'

export const loginUser = async (data) => {
     try {
  const response = await api.post('/auth/login', data);
  return response
} catch (error) {
  console.error("Login failed:", error.response?.data || error.message);
}
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