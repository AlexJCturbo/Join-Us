const { Model, DataTypes } = require("sequelize")
const sequelize = require("../config/connection.js")

class Post extends Model { }

Post.init({
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contents: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date_created: {
        type: DataTypes.TIME,
        allowNull: false
    },
    creator: {
        type: DataTypes.INTEGER,
        references: {
            model: "user",
            key: "user_id"
        }
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    meetup_date: {
        type: DataTypes.TIME,
        allowNull: false,
    }
}, {
    sequelize,
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    modelName: "post"
})

module.exports = Post