'use strict';
const { Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class staff extends Model {
    
    static associate(models) {
      
    }
  }
  staff.init({
    id: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    staffName: {
      type:DataTypes.STRING,
      allowNull:true
    },
    role: {
      type:DataTypes.STRING,
      allowNull:true
    },
    experience: {
      type:DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'staff',
    tableName:'staffs',
    timestamps:false
  });
  return staff;
};