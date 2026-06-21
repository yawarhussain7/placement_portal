import User from '../model/auth.model.js'
import bcrypt from 'bcrypt'

export const SignUp = async({username,email,password})=>{
    try{
        const exist_user = await User.findOne({email})
        if(exist_user){
            throw new Error('User alreay exist')
        }

        const hashedPassword  = await bcrypt.hash(password,10)

        const user = await User.create({
            username,
            email,
            password:hashedPassword 
        })
        console.log('User created successfully')

        return {
            _id:user._id,
            username:user.username,
            email:user.email
        }

    }catch(error){
        console.error('User not created ....')
        throw error
    }
}