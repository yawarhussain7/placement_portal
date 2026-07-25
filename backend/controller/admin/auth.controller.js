import {RegisterAdminService,loginAdminService} from '../../services/admin/auth.service.js'

const cookieOptions={
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
}

export const RegisterAdminController = async(req,res)=>{
    try{
        const {fullName,email,password}=req.body
 console.log(`Fullname: ${fullName} Email: ${email} Password: ${password}`)
        if(!fullName || !email || !password){
            return res.status(409).json({
                message:'All fields are required',
                success:false
            })
        }

        const user = await RegisterAdminService({fullName,email,password})
        if(!user){
            return res.status(500).json({
                message:'Failed to create admin account',
                success:false
            })
        }
        const token = user.token

        res.cookie('token',token,cookieOptions)

        return res.status(201).json({
            message:'Admin account created successfully',
            success:true,
            data:user
        })
    }catch(error){
        console.error('Registration error:', error)
 return res.status(500).json({
                message:'Registration Issue',
                success:false,
                error: error.message
            })
    }
}

export const LoginAdminController =async(req,res)=>{
    try{
        const {email,password} = req.body
        // console.log(`Email: ${email} Password: ${password}`)
        if(!email || !password){
            return res.status(401).json({
                message:'Email and password are required',
                success:false
            })
        }
        
        const user = await loginAdminService({email,password})
        const token = user.token

        res.cookie('token',token,cookieOptions)
        return res.status(200).json({
            message:'login successfull',
            success:true
        })

    }catch(error){
        console.error('Login error:', error)
 return res.status(500).json({
                message:'Login issue',
                success:false,
                error: error.message
            })
    }
}