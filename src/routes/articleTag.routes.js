import { Router } from "express";
import { body } from "express-validator";
import {
    addTagToArticle,
    removeTagFromArticle
} from "../controllers/articleTag.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

const articleTagValidation = [
    body("article_id")
        .isInt()
        .withMessage("El article_id debe ser un número entero"),

    body("tag_id")
        .isInt()
        .withMessage("El tag_id debe ser un número entero")
];

router.post(
    "/",
    authMiddleware,
    articleTagValidation,
    addTagToArticle
);

router.delete(
    "/:articleTagId",
    authMiddleware,
    removeTagFromArticle
);

export default router;