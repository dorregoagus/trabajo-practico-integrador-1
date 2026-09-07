import { verifyToken } from "../helpers/jwt.js";

const authMiddleware = (req, res, next) => {
    try {
        // Obtiene el token de las cookies
        const token = req.cookies.authToken;
// Si no hay token, devuelve un error de autenticación
        if (!token) {
            return res.status(401).json({
                message: "No estás autenticado"
            });
        }

        const decoded = verifyToken(token);
// Si hay cookie, verifica el jwt y agrega la información del usuario al objeto de solicitud
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token inválido o expirado"
        });
    }
};

export default authMiddleware;