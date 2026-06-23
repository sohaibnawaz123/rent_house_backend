module.exports = (sequelize, DataTypes) => {
    const addresses = sequelize.define(
        "addresses",
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

            lat: {
                type: DataTypes.DECIMAL(10, 8),
                allowNull: true,
            },

            lon: {
                type: DataTypes.DECIMAL(11, 8),
                allowNull: true,
            },

            city: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            state: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            country: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            zipcode: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            addressline: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            countrycode: {
                type: DataTypes.STRING(10),
                allowNull: true,
            },

            provincecode: {
                type: DataTypes.STRING(10),
                allowNull: true,
            },
            property_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "properties",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
        },
        {
            tableName: "addresses",
            timestamps: true,
            underscored: true,
        }
    );

    // Associations
    addresses.associate = (models) => {
        addresses.belongsTo(models.users, {
            foreignKey: "user_id",
            as: "user",
        });
        addresses.belongsTo(models.properties, {
            foreignKey: "property_id",
            as: "property",
        });
    };

    return addresses;
};