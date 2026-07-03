import api from './api.js'

export const signUpUser = async(userData)=>{
    return api.post('/admin/auth/register',userData)
}
export const signInUser = async(userData)=>{

    return api.post('/admin/auth/login',userData)
}
