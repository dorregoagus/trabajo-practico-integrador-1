import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ArticleTag = sequelize.define("ArticleTag", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    article_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "article_tags",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

export default ArticleTag;