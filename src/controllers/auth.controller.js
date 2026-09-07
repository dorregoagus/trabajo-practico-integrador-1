import { validationResult } from "express-validator";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import { hashPassword, comparePassword } from "../helpers/password.js";
import { generateToken } from "../helpers/jwt.js";

const register = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Error de validación",
                errors: errors.array()
            });
        }

        const { username, email, password } = req.body;

        const existingUsername = await User.findOne({
            where: { username }
        });

        if (existingUsername) {
            return res.status(400).json({
                message: "El nombre de usuario ya está registrado"
            });
        }

        const existingEmail = await User.findOne({
            where: { email }
        });

        if (existingEmail) {
            return res.status(400).json({
                message: "El email ya está registrado"
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: "user"
        });

        await Profile.create({
            user_id: user.id,
            first_name: "Sin especificar",
            last_name: "Sin especificar"
        });

        return res.status(201).json({
            message: "Usuario registrado correctamente",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error al registrar usuario:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

const login = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Error de validación",
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                message: "Email o contraseña incorrectos"
            });
        }

        const passwordCorrect = await comparePassword(
            password,
            user.password
        );

        if (!passwordCorrect) {
            return res.status(401).json({
                message: "Email o contraseña incorrectos"
            });
        }

        const token = generateToken(user);

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};
const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: {
                model: Profile,
                as: "profile"
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                profile: user.profile
            }
        });

    } catch (error) {
        console.error("Error al obtener el perfil:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Error de validación",
                errors: errors.array()
            });
        }

        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        const profile = await Profile.findOne({
            where: {
                user_id: req.user.id
            }
        });

        if (!profile) {
            return res.status(404).json({
                message: "Perfil no encontrado"
            });
        }

        const {
            first_name,
            last_name,
            biography,
            avatar_url,
            birth_date
        } = req.body;

        await profile.update({
            first_name,
            last_name,
            biography,
            avatar_url,
            birth_date
        });

        return res.status(200).json({
            message: "Perfil actualizado correctamente",
            profile
        });

    } catch (error) {
        console.error("Error al actualizar el perfil:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("authToken");

        return res.status(200).json({
            message: "Sesión cerrada correctamente"
        });

    } catch (error) {
        console.error("Error al cerrar sesión:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};
export {
    register,
    login,
    getProfile,
    updateProfile,
    logout
};