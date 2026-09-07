import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Genera un token JWT cuando un usuario inicia sesion
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

// permite comprobar si el token es válido
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

export { generateToken, verifyToken };