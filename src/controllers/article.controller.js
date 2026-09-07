import { validationResult } from "express-validator";
import Article from "../models/Article.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";

const createArticle = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Error de validación",
                errors: errors.array()
            });
        }

        const { title, content, excerpt, status } = req.body;

        const article = await Article.create({
            title,
            content,
            excerpt,
            status: status || "published",
            user_id: req.user.id
        });

        return res.status(201).json({
            message: "Artículo creado correctamente",
            article
        });

    } catch (error) {
        console.error("Error al crear artículo:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

const getArticles = async (req, res) => {
    try {
        const articles = await Article.findAll({
            where: {
                status: "published"
            },
            include: {
                model: User,
                as: "author",
                attributes: ["id", "username"]
            }
        });

        return res.status(200).json(articles);

    } catch (error) {
        console.error("Error al obtener artículos:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

const getArticleById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "El ID debe ser un número entero"
            });
        }

        const article = await Article.findByPk(id, {
            include: {
                model: User,
                as: "author",
                attributes: ["id", "username"]
            }
        });

        if (!article) {
            return res.status(404).json({
                message: "Artículo no encontrado"
            });
        }

        return res.status(200).json(article);

    } catch (error) {
        console.error("Error al obtener artículo:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

const getMyArticles = async (req, res) => {
    try {
        const articles = await Article.findAll({
            where: {
                user_id: req.user.id
            },
            include: {
                model: User,
                as: "author",
                attributes: ["id", "username"]
            }
        });

        return res.status(200).json(articles);

    } catch (error) {
        console.error("Error al obtener tus artículos:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

const getArticlesByUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "El ID debe ser un número entero"
            });
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        const articles = await Article.findAll({
            where: {
                user_id: id,
                status: "published"
            }
        });

        return res.status(200).json(articles);

    } catch (error) {
        console.error("Error al obtener artículos del usuario:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

const updateArticle = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Error de validación",
                errors: errors.array()
            });
        }

        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "El ID debe ser un número entero"
            });
        }

        const article = await Article.findByPk(id);

        if (!article) {
            return res.status(404).json({
                message: "Artículo no encontrado"
            });
        }

        if (article.user_id !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                message: "No tenés permisos para modificar este artículo"
            });
        }

        const { title, content, excerpt, status } = req.body;

        if (title !== undefined) {
            article.title = title;
        }

        if (content !== undefined) {
            article.content = content;
        }

        if (excerpt !== undefined) {
            article.excerpt = excerpt;
        }

        if (status !== undefined) {
            article.status = status;
        }

        await article.save();

        return res.status(200).json({
            message: "Artículo actualizado correctamente",
            article
        });

    } catch (error) {
        console.error("Error al actualizar artículo:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

const deleteArticle = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "El ID debe ser un número entero"
            });
        }

        const article = await Article.findByPk(id);

        if (!article) {
            return res.status(404).json({
                message: "Artículo no encontrado"
            });
        }

        if (article.user_id !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                message: "No tenés permisos para eliminar este artículo"
            });
        }

        await article.destroy();

        return res.status(200).json({
            message: "Artículo eliminado correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar artículo:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

export {
    createArticle,
    getArticles,
    getArticleById,
    getMyArticles,
    getArticlesByUser,
    updateArticle,
    deleteArticle
};