import api from './axios.js'

export const getUsers = async () => {
    return api.get('/users')
}