module.exports = (sequelize, DataTypes) => {
    const Reviews = sequelize.define(
        "reviews",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            property_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "properties",
                    key: "id",
                },
            },

            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },

            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            comment: {
                type: DataTypes.TEXT,
            },
        },
        {
            tableName: "reviews",
            timestamps: true,
            underscored: true,
        }
    );

    Reviews.associate = (models) => {
        Reviews.belongsTo(models.properties, {
            foreignKey: "property_id",
            as: "property",
        });

        Reviews.belongsTo(models.users, {
            foreignKey: "user_id",
            as: "user",
        });
    };

    return Reviews;
};