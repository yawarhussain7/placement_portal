import User from '../../model/auth/authUser.model.js'
import bcrypt from 'bcrypt'
import {GenerateToken} from '../../utils/generateJWT.js'
//** <<<<=================================== Register Page ================================>>>>>  */
export const registerUserService  = async({username,email,password})=>{
    const userExist = await User.findOne({email});
    
    if(userExist){
        throw new Error('User already exists')
    }
    
    const hashedPassword = await bcrypt.hash(password,10)

    const user = await User.create({
        username,
        email,
        password:hashedPassword
    });
    
    const token = GenerateToken(user._id,user.username)

    return {
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
        },
        token,
    };
}
//** <<<<=================================== Login Page ================================>>>>>  */

export const LoginUserService = async({email,password})=>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Invalid email or password')
    }

    const isMatch = await bcrypt.compare(password,user.password)
    
    if(!isMatch){
        throw new Error('Invalid email or password')
    }

    const token = GenerateToken(user._id, user.username)

    return{
        user:{
            id:user._id,
            username: user.username,
            email:user.email
        },
        token,
    };
}
