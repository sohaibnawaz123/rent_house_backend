module.exports = (sequelize, DataTypes) => {
    const countries = sequelize.define("countries", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        iso3: DataTypes.STRING,
        numeric_code: DataTypes.STRING,
        iso2: DataTypes.STRING,
        phonecode: DataTypes.STRING,
        capital: DataTypes.STRING,
        currency: DataTypes.STRING,
        currency_name: DataTypes.STRING,
        currency_symbol: DataTypes.STRING,
        tld: DataTypes.STRING,
        native: DataTypes.STRING,
        population: DataTypes.BIGINT,
        gdp: DataTypes.BIGINT,
        region: DataTypes.STRING,
        region_id: DataTypes.INTEGER,
        subregion: DataTypes.STRING,
        subregion_id: DataTypes.INTEGER,
        nationality: DataTypes.STRING,
        latitude: DataTypes.DECIMAL,
        longitude: DataTypes.DECIMAL,
        emoji: DataTypes.STRING,
        emojiU: DataTypes.STRING,
        flag: DataTypes.BOOLEAN,
        wikiDataId: DataTypes.STRING,
    }, 
    {
        tableName: "countries",
        timestamps: true,
    });

    countries.associate = (models) => {
        countries.hasMany(models.cities, {
            foreignKey: "country_id"
        });
    }

    return countries;
};
