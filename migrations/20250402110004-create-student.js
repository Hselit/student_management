'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('students', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      studentName: {
        type: Sequelize.STRING,
        allowNull:false
      },
      marks: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      age: {
        type: Sequelize.INTEGER,
        defaultValue:18,
        allowNull:false
      },
      password:{
        type:Sequelize.STRING,
        allowNull:false
      },
      staff_id:{
        type:DataTypes.INTEGER,
        references:{
          model:'staffs',
          key:'id'
        }
      }
    },{
      timestamps:false
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('students');
  }
};