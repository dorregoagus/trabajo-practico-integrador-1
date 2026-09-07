import { validationResult } from "express-validator";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import { hashPassword } from "../helpers/password.js";
// Controlador para obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: {
                model: Profile,
                as: "profile"
            }
        });

        return res.status(200).json(users);

    } catch (error) {
        console.error("Error al obtener usuarios:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};
// Controlador para obtener un usuario por su ID
const getUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "El ID debe ser un número entero"
            });
        }

        const user = await User.findByPk(id, {
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

        return res.status(200).json(user);

    } catch (error) {
        console.error("Error al obtener usuario:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};
// Controlador para crear un nuevo usuario
const createUser = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Error de validación",
                errors: errors.array()
            });
        }

        const { username, email, password, role } = req.body;

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
            role: role || "user"
        });

        await Profile.create({
            user_id: user.id,
            first_name: "Sin especificar",
            last_name: "Sin especificar"
        });

        return res.status(201).json({
            message: "Usuario creado correctamente",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error al crear usuario:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};
// controlador para actualizar un usuario existente
const updateUser = async (req, res) => {
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

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        const { username, email, password, role } = req.body;

        if (username && username !== user.username) {
            const existingUsername = await User.findOne({
                where: { username }
            });

            if (existingUsername) {
                return res.status(400).json({
                    message: "El nombre de usuario ya está registrado"
                });
            }

            user.username = username;
        }

        if (email && email !== user.email) {
            const existingEmail = await User.findOne({
                where: { email }
            });

            if (existingEmail) {
                return res.status(400).json({
                    message: "El email ya está registrado"
                });
            }

            user.email = email;
        }

        if (password) {
            user.password = await hashPassword(password);
        }

        if (role) {
            user.role = role;
        }

        await user.save();

        return res.status(200).json({
            message: "Usuario actualizado correctamente"
        });

    } catch (error) {
        console.error("Error al actualizar usuario:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};
// controlador para eliminar un usuario existente
const deleteUser = async (req, res) => {
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

        await user.destroy();

        return res.status(200).json({
            message: "Usuario eliminado correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar usuario:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

export {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};