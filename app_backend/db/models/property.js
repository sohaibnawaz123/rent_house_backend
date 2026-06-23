module.exports = (sequelize, DataTypes) => {
    const Property = sequelize.define(
        "properties",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            description: {
                type: DataTypes.TEXT,
            },

            price_per_month: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },

            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onDelete: "CASCADE",
            },

            status: {
                type: DataTypes.ENUM("rent", "sale"),
                defaultValue: "rent",
            },

            is_featured: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },

            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },

            views_count: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
        },
        {
            tableName: "properties",
            timestamps: true,
            underscored: true,
        }
    );

    Property.associate = (models) => {

        // ✅ Agent (User)
        Property.belongsTo(models.users, {
            foreignKey: "user_id",
            as: "agent",
        });

        // 🖼 Images
        Property.hasMany(models.propertyimages, {
            foreignKey: "property_id",
            as: "images",
        });

        // 📊 Details
        Property.hasOne(models.propertydetails, {
            foreignKey: "property_id",
            as: "details",
        });

        // 📍 Address (IMPORTANT FIX)
        Property.hasOne(models.addresses, {
            foreignKey: "property_id",
            as: "address",
        });

        // ⭐ Reviews
        Property.hasMany(models.reviews, {
            foreignKey: "property_id",
            as: "reviews",
        });
    };

    return Property;
};