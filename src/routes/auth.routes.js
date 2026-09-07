import { Router } from "express";
import { body } from "express-validator";
import {
    register,
    login,
    getProfile,
    updateProfile,
    logout
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = Router();

router.post(
    "/register",
    [
        body("username")
            .trim()
            .isLength({ min: 3, max: 20 })
            .withMessage("El username debe tener entre 3 y 20 caracteres")
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage("El username solo puede contener letras y números"),

        body("email")
            .isEmail()
            .withMessage("El email no es válido"),

        body("password")
            .isLength({ min: 8 })
            .withMessage("La contraseña debe tener al menos 8 caracteres")
            .matches(/[a-z]/)
            .withMessage("La contraseña debe tener una letra minúscula")
            .matches(/[A-Z]/)
            .withMessage("La contraseña debe tener una letra mayúscula")
            .matches(/[0-9]/)
            .withMessage("La contraseña debe tener un número")
    ],
    register
);

router.post(
    "/login",
    [
        body("email")
            .isEmail()
            .withMessage("El email no es válido"),

        body("password")
            .notEmpty()
            .withMessage("La contraseña es obligatoria")
    ],
    login
);
router.get(
    "/profile",
    authMiddleware,
    getProfile
);

router.put(
    "/profile",
    authMiddleware,
    [
        body("first_name")
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage("El nombre debe tener entre 2 y 50 caracteres")
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
            .withMessage("El nombre solo puede contener letras"),

        body("last_name")
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage("El apellido debe tener entre 2 y 50 caracteres")
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
            .withMessage("El apellido solo puede contener letras"),

        body("biography")
            .optional()
            .isLength({ max: 500 })
            .withMessage("La biografía no puede superar los 500 caracteres"),

        body("avatar_url")
            .optional()
            .isURL()
            .withMessage("El avatar debe ser una URL válida")
    ],
    updateProfile
);

router.post(
    "/logout",
    authMiddleware,
    logout
);
export default router;