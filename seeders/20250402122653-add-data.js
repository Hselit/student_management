'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('staffs',[
    {
      staffName:"Arun Prakash",
      role:"Admin",
      experience:10,
      password:"123456"
    },
    {
      staffName:"Gayathri",
      role:"teacher",
      experience:5,
      password:"123456"
    }
   ],{});

   await queryInterface.bulkInsert('students',[
    {
      studentName:"Arjun",
      marks:99,
      age:20,
      staff_id:1,
      password:"123456"
    },
    {
      studentName:"Paul",
      marks:100,
      age:29,
      staff_id:2,
      password:"123456"
    }
   ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('staffs',null,{});
    await queryInterface.bulkDelete('students',null,{});
    
  }
};
