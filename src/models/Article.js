import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Article = sequelize.define("Article", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    excerpt: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM("published", "archived"),
        allowNull: false,
        defaultValue: "published"
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "articles",
    timestamps: true,
    // Se agrega la opción paranoid para habilitar el borrado lógico
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at"
});

export default Article;