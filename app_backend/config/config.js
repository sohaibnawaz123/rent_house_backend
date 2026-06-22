const dotenv = require('dotenv');
const env = process.env.NODE_ENV || 'local';
dotenv.config({ path: `.env.${env}` });
module.exports = {
  local: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    pool: {
      max: 20, // Increase max connections
      min: 5,  // Maintain a minimum number of connections
      acquire: 30000, // Time (ms) Sequelize tries to acquire a connection before throwing an error
      idle: 10000,  // Time (ms) a connection must be idle before being released
    },
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    pool: {
      max: 20, // Increase max connections
      min: 5,  // Maintain a minimum number of connections
      acquire: 30000, // Time (ms) Sequelize tries to acquire a connection before throwing an error
      idle: 10000,  // Time (ms) a connection must be idle before being released
    },
  },
  staging: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    pool: {
      max: 20, // Increase max connections
      min: 5,  // Maintain a minimum number of connections
      acquire: 30000, // Time (ms) Sequelize tries to acquire a connection before throwing an error
      idle: 10000,  // Time (ms) a connection must be idle before being released
    },
  },
};