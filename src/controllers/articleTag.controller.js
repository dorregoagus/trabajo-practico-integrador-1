import { validationResult } from "express-validator";
import Article from "../models/Article.js";
import Tag from "../models/Tag.js";
import ArticleTag from "../models/ArticleTag.js";

// Controlador para asociar una etiqueta a un artículo
const addTagToArticle = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Error de validación",
                errors: errors.array()
            });
        }

        const { article_id, tag_id } = req.body;

        const article = await Article.findByPk(article_id);

        if (!article) {
            return res.status(404).json({
                message: "Artículo no encontrado"
            });
        }

        if (article.user_id !== req.user.id) {
            return res.status(403).json({
                message: "Solo el autor puede agregar etiquetas"
            });
        }

        const tag = await Tag.findByPk(tag_id);

        if (!tag) {
            return res.status(404).json({
                message: "Etiqueta no encontrada"
            });
        }

        const existingRelation = await ArticleTag.findOne({
            where: {
                article_id,
                tag_id
            }
        });

        if (existingRelation) {
            return res.status(400).json({
                message: "La etiqueta ya está asociada al artículo"
            });
        }

        const articleTag = await ArticleTag.create({
            article_id,
            tag_id
        });

        return res.status(201).json({
            message: "Etiqueta asociada al artículo correctamente",
            articleTag
        });

    } catch (error) {
        console.error("Error al asociar etiqueta:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};
// Controlador para quitar una etiqueta de un artículo
const removeTagFromArticle = async (req, res) => {
    try {
        const articleTagId = parseInt(req.params.articleTagId);

        if (isNaN(articleTagId)) {
            return res.status(400).json({
                message: "El ID debe ser un número entero"
            });
        }

        const articleTag = await ArticleTag.findByPk(articleTagId);

        if (!articleTag) {
            return res.status(404).json({
                message: "Relación entre artículo y etiqueta no encontrada"
            });
        }

        const article = await Article.findByPk(articleTag.article_id);

        if (!article) {
            return res.status(404).json({
                message: "Artículo no encontrado"
            });
        }

        if (article.user_id !== req.user.id) {
            return res.status(403).json({
                message: "Solo el autor puede quitar etiquetas"
            });
        }

        await articleTag.destroy();

        return res.status(200).json({
            message: "Etiqueta eliminada del artículo correctamente"
        });

    } catch (error) {
        console.error("Error al quitar etiqueta:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

export {
    addTagToArticle,
    removeTagFromArticle
};