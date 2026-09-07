import bcrypt from "bcrypt";
// No guarda las contraseñas directamente en la base de datos
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export { hashPassword, comparePassword };