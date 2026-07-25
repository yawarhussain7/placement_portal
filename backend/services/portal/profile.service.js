import studentModel from '../../Model/portal/auth.model.js'
import bcrypt from 'bcrypt'

export const getProfileService = async({id})=>{
    const user = await studentModel.findById(id).select('-password')
    if(!user){
        throw new Error('User not found')
    }
    return user
}


export const updateProfileService = async({id, data})=>{
    const user = await studentModel.findById(id)
    if (!user) {
        throw new Error('User not found')
    }

    // Check and update email
    if(data.email && data.email !== user.email){
        const existEmail = await studentModel.findOne({email: data.email})
        if(existEmail){
            throw new Error('Email already exists')
        }
        user.email = data.email
    }

    // Check and update fullName
    if(data.fullName && data.fullName !== user.fullName){
        user.fullName = data.fullName
    }

    // Check and update username
    if(data.username && data.username !== user.username){
        const existUsername = await studentModel.findOne({username: data.username})
        if(existUsername){
            throw new Error('Username already exists')
        }
        user.username = data.username
    }

    // Update avatar
    if(data.avatar !== undefined){
        user.avatar = data.avatar
    }

    // Update bio
    if(data.bio !== undefined){
        user.bio = data.bio
    }

    // Update website
    if(data.website !== undefined){
        user.website = data.website
    }

    // Update phone
    if(data.phone !== undefined){
        user.phone = data.phone
    }

    // Update gender
    if(data.gender !== undefined){
        user.gender = data.gender
    }

    // Update dateOfBirth
    if(data.dateOfBirth !== undefined){
        user.dateOfBirth = data.dateOfBirth
    }

    // Update password if provided
    if(data.password){
        user.password = await bcrypt.hash(data.password, 10)
    }

    await user.save()

    // Return user without password
    const userResponse = await studentModel.findById(id).select('-password')
    
    return userResponse
}
