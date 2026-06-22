

module.exports = (sequelize, DataTypes) => {
    const locations = sequelize.define("locations", {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        country_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        tableName: "locations",
        timestamps: true 
    }
);

locations.associate = (models) => {
    locations.hasMany(models.transfers, {
        foreignKey: "from_location_id",
        as: "fromTransfers",
    });

    locations.hasMany(models.transfers, {
        foreignKey: "to_location_id",
        as: "toTransfers",
    });

    locations.belongsTo(models.countries, {
        foreignKey: "country_id",
        as: "country",
    });

    locations.belongsTo(models.cities, {
        foreignKey: "city_id",
        as: "city",
    });
};

return locations;
}