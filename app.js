import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import sequelize from "./src/config/database.js";
import User from "./src/models/User.js";
import Profile from "./src/models/Profile.js";
import Article from "./src/models/Article.js";
import Tag from "./src/models/Tag.js";
import ArticleTag from "./src/models/ArticleTag.js";
import "./src/models/associations.js";
import authRoutes from "./src/routes/auth.routes.js";
import authMiddleware from "./src/middlewares/authMiddleware.js";
import adminMiddleware from "./src/middlewares/adminMiddleware.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.get("/api/test-auth", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "Autenticación correcta",
        user: req.user
    });
});

app.get("/api/test-admin", authMiddleware, adminMiddleware, (req, res) => {
    res.status(200).json({
        message: "Autorización de administrador correcta",
        user: req.user
    });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();

        console.log("Conexión a la base de datos establecida");

        await sequelize.sync();

        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en el puerto ${PORT}`);
        });

    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
    }
};

startServer();