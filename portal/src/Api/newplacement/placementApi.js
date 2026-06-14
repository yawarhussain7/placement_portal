import api from '../axios.js'

export const Placement_API = async (placement_data)=>{
    return api.post('/new-placement/placement-preference',placement_data)
}

