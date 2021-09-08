const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:Rylen2019!@localhost:5432/gamer-genus");

module.exports = sequelize;