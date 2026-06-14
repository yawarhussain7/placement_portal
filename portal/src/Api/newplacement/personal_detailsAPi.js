import api from '../axios.js'

export const UploadPerosnal_Details = async(formdata)=>{
    return api.post('/new-placement/personal-details',formdata)
}