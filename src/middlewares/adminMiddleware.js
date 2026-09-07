const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "No estás autenticado"
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "No tenés permisos para realizar esta acción"
        });
    }

    next();
};

export default adminMiddleware;