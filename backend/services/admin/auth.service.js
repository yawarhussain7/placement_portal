import AdminModel from '../../Model/admin/admin.model.js'
import { generateToken } from '../../utils/TokenManger.js'
import bcrypt from 'bcrypt'

export const RegisterAdminService = async({fullName,email,password})=>{
   
    const user = await AdminModel.findOne({email})

    if(user){
        throw new Error('Admin alread exist')
    }

    const hashedPassword = await bcrypt.hash(password,10)
    const admin = await AdminModel.create({
        fullName,
        email,
        password:hashedPassword
    })
    
    const token = generateToken(admin._id) 
    return {
    admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
    },
    token,
};

}

export const loginAdminService = async({email,password})=>{
     console.log(`Email: ${email} Password: ${password}`)
    const admin = await AdminModel.findOne({email}).select('+password')
    if(!admin){
        throw new Error('Admin not found')
    }
    const matchpass = await bcrypt.compare(password,admin.password)
    if(!matchpass){
        throw new Error('Invalid password or email')
    }
    const token = generateToken(admin._id)
   return {
    admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
    },
    token,
};
}