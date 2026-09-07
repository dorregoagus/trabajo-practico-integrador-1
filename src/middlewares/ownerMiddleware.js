import User from "../models/User.js";

const ownerMiddleware = async (req, res, next) => {
    try {
        // Verifica si el usuario está autenticado
        if (!req.user) {
            return res.status(401).json({
                message: "No estás autenticado"
            });
        }
// Verifica si el usuario es el propietario o un administrador
        const userId = parseInt(req.params.id);

        if (req.user.id !== userId && req.user.role !== "admin") {
            return res.status(403).json({
                message: "No tenés permisos para realizar esta acción"
            });
        }
// Verifica si el usuario existe en la base de datos
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

export default ownerMiddleware;