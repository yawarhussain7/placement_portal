import api from './axios.js'

export const Login = async (data) => {
    // console.log(`Login data from frontend ${JSON.stringify(data)}`)
    return api.post('/auth/login', data)
  }
  
  export const register = (data) => {
  console.log(`register data from frontend ${JSON.stringify(data)}`)
  return api.post('/auth/register', data)
};