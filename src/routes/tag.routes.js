import { Router } from "express";
import { body } from "express-validator";
import {
    createTag,
    getTags,
    getTagById,
    updateTag,
    deleteTag
} from "../controllers/tag.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
// Rutas para el manejo de etiquetas
const router = Router();
// Validaciones para la creación y actualización de etiquetas
const tagValidation = [
    body("name")
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage("El nombre debe tener entre 2 y 30 caracteres")
        .matches(/^\S+$/)
        .withMessage("El nombre no puede contener espacios")
];

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    tagValidation,
    createTag
);

router.get(
    "/",
    authMiddleware,
    getTags
);

router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    getTagById
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    tagValidation,
    updateTag
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteTag
);

export default router;