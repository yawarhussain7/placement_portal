import jwt from "jsonwebtoken";

export const GenerateToken = (id, username) => {
    return jwt.sign(
        { id, username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};