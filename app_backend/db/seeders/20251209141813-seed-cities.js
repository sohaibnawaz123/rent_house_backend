const path = require("path");
const fs = require("fs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const filePath = path.join(__dirname, "../cities.json");

    const rawData = fs.readFileSync(filePath, "utf8");
    const cities = JSON.parse(rawData);

    const cleaned = cities.map((c) => ({
      id: c.id,
      name: c.name,
      state_id: c.state_id,
      state_code: c.state_code,
      country_id: c.country_id,
      country_code: c.country_code,
      type: c.type,
      level: c.level,
      parent_id: c.parent_id,
      latitude: c.latitude,
      longitude: c.longitude,
      native: c.native,
      population: c.population,
      timezone: c.timezone,
      // translations: c.translations,
      flag: c.flag,
      wiki_data_id: c.wikiDataId,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    const BATCH_SIZE = 500; // adjust based on memory

    for (let i = 0; i < cleaned.length; i += BATCH_SIZE) {
      const batch = cleaned.slice(i, i + BATCH_SIZE);
      await queryInterface.bulkInsert("cities", batch, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("cities", null, {});
  },
};
