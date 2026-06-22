const path = require("path");
const fs = require("fs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const filePath = path.join(__dirname, "../countries.json");

    const rawData = fs.readFileSync(filePath, "utf8");
    const countries = JSON.parse(rawData);

    const cleaned = countries.map((c) => ({
      id: c.id,
      name: c.name,
      iso3: c.iso3,
      iso2: c.iso2,
      phonecode: c.phonecode,
      capital: c.capital,
      currency: c.currency,
      population: c.population,
      nationality: c.nationality,
      currency_name: c.currency_name,
      currency_symbol: c.currency_symbol,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert("countries", cleaned, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("countries", null, {});
  },
};
