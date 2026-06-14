import api from '../axios.js'

export const PlacementDocApi = async(file_data)=>{
    return api.post(
        '/new-placement/documents'
        ,file_data,
        {
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }
    )
}
