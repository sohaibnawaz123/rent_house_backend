module.exports = (sequelize, DataTypes) => {
    const Favorites = sequelize.define(
        "favorites",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },

            property_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "properties",
                    key: "id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
        },
        {
            tableName: "favorites",
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    unique: true,
                    fields: ["user_id", "property_id"],
                    name: "favorites_user_property_unique",
                },
            ],
        }
    );

    Favorites.associate = (models) => {
        Favorites.belongsTo(models.users, {
            foreignKey: "user_id",
            as: "user",
        });

        Favorites.belongsTo(models.properties, {
            foreignKey: "property_id",
            as: "property",
        });
    };

    return Favorites;
};
