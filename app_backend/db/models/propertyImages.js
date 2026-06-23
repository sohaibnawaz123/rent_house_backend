module.exports = (sequelize, DataTypes) => {
    const PropertyImages = sequelize.define(
        "propertyimages",
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
                onDelete: "CASCADE",
            },

            image_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: "property_images",
            timestamps: true,
            underscored: true,
        }
    );

    PropertyImages.associate = (models) => {
        PropertyImages.belongsTo(models.properties, {
            foreignKey: "property_id",
            as: "property",
        });
    };

    return PropertyImages;
};