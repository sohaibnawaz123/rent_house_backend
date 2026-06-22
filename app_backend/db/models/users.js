const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(25),

        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 2,
            references: {
                model: 'roles',
                key: 'id'
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            default: false
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        email_verification_token: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email_verification_expires: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
        {
            defaultScope: {
                attributes: {
                    exclude: [
                        "password"
                    ],
                },
            },
        }
    );

    users.beforeCreate(async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
    });

    users.beforeUpdate(async (user) => {
        if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 10);
        }
    });

    return users;
}