'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('abc123', 10);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     *}], {});
    */

     await queryInterface.bulkInsert('users',[
      {
        first_name: 'Muhammad',
        last_name: 'Hassaan',
        email: 'hassaan@mmcgbl.com',
        password: hashedPassword,
        role_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
     ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', { email: 'hassaan@mmcgbl.com'});
  }
};
 