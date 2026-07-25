import studentModel from '../../Model/portal/auth.model.js'
import bcrypt from 'bcrypt'
import {generateToken} from '../../utils/TokenManger.js'

export const registerService = async({fullName,email,password})=>{

    const existUser = await studentModel.findOne({email})
    if(existUser){
        throw new Error('User already exist')
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const user = await studentModel.create({
        fullName,
        email,
        password:hashedPassword
    })

    const token = generateToken(user._id)

    return {
        user:{
            fullName: user.fullName,
            email: user.email
        },
        token
    }

}

export const loginService = async({email,password})=>{

    const user = await studentModel.findOne({email}).select('+password')
    if(!user){
        throw new Error('Email or Password is Invalid')
    }

    const Matchpassword = await bcrypt.compare(password,user.password)
    if(!Matchpassword){
        throw new Error('Email or Password is Invalid')
    }

    const token = generateToken(user._id)

    return {
        user:{
            fullName: user.fullName,
            email: user.email,
        },
        token
    }

}

export const logoutService = async()=>{
    return {
        success:true,
        message: "Logged out successfully"
    }
}
