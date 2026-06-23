import jwt from 'jsonwebtoken'

const SECRET = process.env.SECRET_KEY

if (!SECRET) {
    console.log('Secret key is missing ');
   
}
export const GenerateToken = ({ id }) => {
    try {
        if(!id){
            throw new Error("User ID is required to generate token");
        }
        const token = jwt.sign({ id }, SECRET, { expiresIn: '1d' })
        return token
    } catch (error) {
        console.error('Failed to generate token : ' + error.message)
    }
}

