'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "roles",
      [
        { name: "superadmin", createdAt: new Date(), updatedAt: new Date() },
        { name: "admin", createdAt: new Date(), updatedAt: new Date() },
        { name: "agent", createdAt: new Date(), updatedAt: new Date() },
        { name: "user", createdAt: new Date(), updatedAt: new Date() }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", null, {});
  }
};
