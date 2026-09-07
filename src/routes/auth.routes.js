import { Router } from "express";
import { body } from "express-validator";
import { register, login } from "../controllers/auth.controller.js";

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

export default router;