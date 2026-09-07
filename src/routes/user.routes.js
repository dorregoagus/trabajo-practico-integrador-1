import { Router } from "express";
import { body } from "express-validator";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = Router();
// Validaciones para la creación y actualización de usuarios
const userValidation = [
    body("username")
        .optional()
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage("El username debe tener entre 3 y 20 caracteres")
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("El username solo puede contener letras y números"),

    body("email")
        .optional()
        .isEmail()
        .withMessage("El email no es válido"),

    body("password")
        .optional()
        .isLength({ min: 8 })
        .withMessage("La contraseña debe tener al menos 8 caracteres")
        .matches(/[a-z]/)
        .withMessage("La contraseña debe tener una letra minúscula")
        .matches(/[A-Z]/)
        .withMessage("La contraseña debe tener una letra mayúscula")
        .matches(/[0-9]/)
        .withMessage("La contraseña debe tener un número"),

    body("role")
        .optional()
        .isIn(["user", "admin"])
        .withMessage("El rol debe ser user o admin")
];

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getUsers
);

router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    getUserById
);

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    userValidation,
    createUser
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    userValidation,
    updateUser
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteUser
);

export default router;