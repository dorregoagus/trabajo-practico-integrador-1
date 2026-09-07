import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Profile = sequelize.define("Profile", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // un usuario no debe tener más de un perfil, así que se establece la relación como única
        unique: true
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    biography: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    avatar_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
}, {
    tableName: "profiles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

export default Profile;