import api from './axios.js'

export const Login = async (data) => {
    // console.log(`Login data from frontend ${JSON.stringify(data)}`)
    return api.post('/auth/login', data)
  }

export const register = async (data) => {
  try {
    const res = await api.post('/auth/register', data);
    console.log("REGISTER RESPONSE:", res.data);
    return res.data;
  } catch (error) {
    console.log("REGISTER ERROR:", error.response?.data);
    throw error;
  }
};