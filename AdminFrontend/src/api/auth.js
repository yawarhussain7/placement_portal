import api from './api.js'

export const signInUser = async(userData)=>{

    return api.post('/auth/admin-login',userData)
}
export const verifyAdmin = async()=> {
    return api.get('/admin/auth/verify')
}
