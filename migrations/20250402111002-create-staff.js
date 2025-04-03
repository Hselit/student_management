'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('staffs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      staffName: {
        type: Sequelize.STRING,
        allowNull:false
      },
      role: {
        type: Sequelize.STRING,
      },
      experience: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      password:{
        type:Sequelize.STRING,
        allowNull:false
      }
    },{
      timestamps:false
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('staffs');
  }
};