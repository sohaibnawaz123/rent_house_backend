module.exports = (sequelize, DataTypes) => {
    const PropertyDetails = sequelize.define(
        "propertydetails",
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

            bedrooms: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },

            bathrooms: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },

            area_sqft: {
                type: DataTypes.FLOAT,
            },

            parking: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },

            furnished: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },

            public_facilities: {
                type: DataTypes.TEXT,
                allowNull: true,
                get() {
                    const rawValue = this.getDataValue(
                        "public_facilities"
                    );

                    if (!rawValue) return [];

                    try {
                        const parsed = JSON.parse(rawValue);
                        return Array.isArray(parsed) ? parsed : [];
                    } catch (_error) {
                        return [];
                    }
                },
                set(value) {
                    if (value == null) {
                        this.setDataValue("public_facilities", null);
                        return;
                    }

                    const facilities = Array.isArray(value)
                        ? value
                        : [value];
                    this.setDataValue(
                        "public_facilities",
                        JSON.stringify(facilities)
                    );
                },
            },
        },
        {
            tableName: "property_details",
            timestamps: true,
            underscored: true,
        }
    );

    PropertyDetails.associate = (models) => {
        PropertyDetails.belongsTo(models.properties, {
            foreignKey: "property_id",
            as: "property",
        });
    };

    return PropertyDetails;
};
