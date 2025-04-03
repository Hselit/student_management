'use strict';
const {  Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class student extends Model {
  
    static associate(models) {
      student.belongsTo(models.staff,{
        foreignKey:'staff_id'
      });
    }
  }
  student.init({
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false,
      autoIncrement:true,
    },
    studentName: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    marks: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    age:{
      type:DataTypes.INTEGER,
      defaultValue:18
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false
    },
    staff_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'staff',
        key:'id'
      }
    }

  }, {
    sequelize,
    modelName: 'student',
    tableName:"students",
    timestamps:false

  });
  return student;
};