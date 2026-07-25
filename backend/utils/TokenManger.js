import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
}

export const generateToken = (id) => {
    try {
        return jwt.sign(
            { id },
            secret,
            { expiresIn: '1d' }
        );
    } catch (error) {
        console.error('Token generation failed:', error.message);
        throw new Error('Failed to generate authentication token.');
    }
};