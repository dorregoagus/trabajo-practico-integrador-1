import User from "./User.js";
import Profile from "./Profile.js";
import Article from "./Article.js";
import Tag from "./Tag.js";
import ArticleTag from "./ArticleTag.js";

// Relación 1:1 entre User y Profile
User.hasOne(Profile, {
    foreignKey: "user_id",
    as: "profile",
    onDelete: "CASCADE"
});

Profile.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});

// Relación 1:N entre User y Article
User.hasMany(Article, {
    foreignKey: "user_id",
    as: "articles",
    onDelete: "CASCADE"
});

Article.belongsTo(User, {
    foreignKey: "user_id",
    as: "author"
});

// Relación N:M entre Article y Tag
Article.belongsToMany(Tag, {
    through: ArticleTag,
    foreignKey: "article_id",
    otherKey: "tag_id",
    as: "tags",
    onDelete: "CASCADE"
});

Tag.belongsToMany(Article, {
    through: ArticleTag,
    foreignKey: "tag_id",
    otherKey: "article_id",
    as: "articles",
    onDelete: "CASCADE"
});

export {
    User,
    Profile,
    Article,
    Tag,
    ArticleTag
};
Article.hasMany(ArticleTag, {
    foreignKey: "article_id",
    as: "articleTags",
    onDelete: "CASCADE"
});

ArticleTag.belongsTo(Article, {
    foreignKey: "article_id",
    as: "article"
});

Tag.hasMany(ArticleTag, {
    foreignKey: "tag_id",
    as: "articleTags",
    onDelete: "CASCADE"
});

ArticleTag.belongsTo(Tag, {
    foreignKey: "tag_id",
    as: "tag"
});