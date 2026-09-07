import { Router } from "express";
import { body } from "express-validator";
import {
    createArticle,
    getArticles,
    getArticleById,
    getMyArticles,
    getArticlesByUser,
    updateArticle,
    deleteArticle
} from "../controllers/article.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

const articleValidation = [
    body("title")
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage("El título debe tener entre 3 y 200 caracteres"),

    body("content")
        .isLength({ min: 50 })
        .withMessage("El contenido debe tener al menos 50 caracteres"),

    body("excerpt")
        .optional()
        .isLength({ max: 500 })
        .withMessage("El resumen no puede superar los 500 caracteres"),

    body("status")
        .optional()
        .isIn(["published", "archived"])
        .withMessage("El estado debe ser published o archived")
];

router.post(
    "/",
    authMiddleware,
    articleValidation,
    createArticle
);

router.get(
    "/",
    authMiddleware,
    getArticles
);

router.get(
    "/user",
    authMiddleware,
    getMyArticles
);

router.get(
    "/user/:id",
    authMiddleware,
    getArticlesByUser
);

router.get(
    "/:id",
    authMiddleware,
    getArticleById
);

router.put(
    "/:id",
    authMiddleware,
    articleValidation,
    updateArticle
);

router.delete(
    "/:id",
    authMiddleware,
    deleteArticle
);

export default router;