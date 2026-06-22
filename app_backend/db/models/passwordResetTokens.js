const { DataTypes } = require("sequelize");
const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const passwordResetTokens = sequelize.define('password_reset_tokens',{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type:DataTypes.INTEGER,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        used_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: "password_reset_tokens",
        timestamp: true,
        underscored: true
    }
);

passwordResetTokens.associate = (models) => {
    passwordResetTokens.belongsTo(models.users, {
      foreignKey: "user_id",
      as: "user",
    });
};

    return passwordResetTokens;
}