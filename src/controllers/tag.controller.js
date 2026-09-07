import { validationResult } from "express-validator";
import Tag from "../models/Tag.js";
// controlador para crear una nueva etiqueta
const createTag = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Error de validación",
                errors: errors.array()
            });
        }

        const { name } = req.body;

        const existingTag = await Tag.findOne({
            where: { name }
        });

        if (existingTag) {
            return res.status(400).json({
                message: "La etiqueta ya existe"
            });
        }

        const tag = await Tag.create({
            name
        });

        return res.status(201).json({
            message: "Etiqueta creada correctamente",
            tag
        });

    } catch (error) {
        console.error("Error al crear etiqueta:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};
// controlador para obtener todas las etiquetas
const getTags = async (req, res) => {
    try {
        const tags = await Tag.findAll();

        return res.status(200).json(tags);

    } catch (error) {
        console.error("Error al obtener etiquetas:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

const getTagById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "El ID debe ser un número entero"
            });
        }

        const tag = await Tag.findByPk(id);

        if (!tag) {
            return res.status(404).json({
                message: "Etiqueta no encontrada"
            });
        }

        return res.status(200).json(tag);

    } catch (error) {
        console.error("Error al obtener etiqueta:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

const updateTag = async (req, res) => {
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

        const tag = await Tag.findByPk(id);

        if (!tag) {
            return res.status(404).json({
                message: "Etiqueta no encontrada"
            });
        }

        const { name } = req.body;

        if (name !== tag.name) {
            const existingTag = await Tag.findOne({
                where: { name }
            });

            if (existingTag) {
                return res.status(400).json({
                    message: "La etiqueta ya existe"
                });
            }
        }

        tag.name = name;

        await tag.save();

        return res.status(200).json({
            message: "Etiqueta actualizada correctamente",
            tag
        });

    } catch (error) {
        console.error("Error al actualizar etiqueta:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

const deleteTag = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "El ID debe ser un número entero"
            });
        }

        const tag = await Tag.findByPk(id);

        if (!tag) {
            return res.status(404).json({
                message: "Etiqueta no encontrada"
            });
        }

        await tag.destroy();

        return res.status(200).json({
            message: "Etiqueta eliminada correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar etiqueta:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

export {
    createTag,
    getTags,
    getTagById,
    updateTag,
    deleteTag
};