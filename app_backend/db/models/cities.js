module.exports = (sequelize, DataTypes) => {
    const cities = sequelize.define(
        "cities",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            state_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            state_code: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            country_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            country_code: {
                type: DataTypes.CHAR(2),
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING(191),
                allowNull: true,
            },
            level: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            parent_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            latitude: {
                type: DataTypes.DECIMAL(10, 8),
                allowNull: false,
            },
            longitude: {
                type: DataTypes.DECIMAL(11, 8),
                allowNull: false,
            },
            native: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            population: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            timezone: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            translations: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            flag: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            },
            wikiDataId: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
        },
        {
            tableName: "cities",
            timestamps: true,
            underscored: true,
        }
    );

    cities.associate = (models) => {
        // City belongs to a country
        cities.belongsTo(models.countries, {
            foreignKey: "country_id",
            as: "country",
        });
    };

    return cities;
};
