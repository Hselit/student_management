var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')

const {validateStaffId,validateStaffCreate,validateStaffUpdate,validateStaffLogin} = require('../middleware/staffValidator');
const { verifyToken, roleMiddleware } = require('../middleware/auth');

var db = require('../models/index');
var {staff,student} = db;

//staff login
router.post('/stafflogin',validateStaffLogin,async function(req,res){
  try{
    const {staffName,password,role} = req.body;
    const data = await staff.findOne({where:{staffName}});
    if(!data){
      return res.status(400).json({message:"No Staff found with the name"});
    }
    if(password != data.password){
      return res.status(400).json({message:"Invalid Password"});
    }
    const token = jwt.sign({staffName,password,role},process.env.JWT_SECRET,{expiresIn:'1h'});
    res.status(200).json({message:"Logged In Successfully",token});
  }
  catch(error){
    console.log(error);
    res.status(500).json({error:"Error Occured ",error});
  }
});


//get staff method
router.get('/',verifyToken,roleMiddleware(["Admin"]),async function(req, res, next) {
  try{
    const data = await staff.findAll();
    if(data.length == 0){
      return res.status(200).json({message:"No Staff Found.."});
    }
    res.status(200).json(data);
  }catch(error){
    console.log(error);
    res.status(500).json({error:"Error Occured ",error});
  }
});

//get single staff method
router.get('/:id',verifyToken,roleMiddleware(["Admin"]),validateStaffId,async(req,res)=>{
  try{
    const {id} = req.params;
    const data = await staff.findByPk(id);
    if(!data){
      return res.status(404).json({message:"No Staff found with the Id"});
    }
    res.status(200).json(data);
  }
  catch(error){
    console.log(error);
    res.status(500).json({error:"Error Occured ",error});
  }
});

//staff post method
router.post('/',verifyToken,roleMiddleware(["Admin"]),validateStaffCreate,async function(req,res){
  try{
    const {staffName,role,experience,password} = req.body;
    if(!staffName || !experience || !role||!password){
      return res.status(400).json({message:"All Fields Required"});
    }
    await staff.create({staffName,role,experience,password});
    res.status(201).json({message:"Staff Added Successfully"});
  }
  catch(error){
    console.log(error);
    res.status(500).json({error:"Error Occured ",error});
  }
});

//staff update method
router.put('/:id',verifyToken,roleMiddleware(["Admin"]),validateStaffUpdate,async(req,res) => {
  try{
    const {id} = req.params;
    const {staffName,role,experience,password} = req.body;

    // if(!staffName || !role || !experience){
    //   return res.status(400).json({message:"All fields are required"});
    // }

    const checkexistdata = await staff.findByPk(id);
    console.log(checkexistdata);
    if(!checkexistdata){
      return res.status(404).json({message:"Not Staff found with the id"});
    }
    const dt = await staff.update({staffName,role,experience,password},{where:{id}});
    if(dt[0] === 1){
      return res.status(200).json({ message: "Staff updated successfully" });
    }
    res.status(400).json({ message: "No changes made"});
    
  }catch(error){
    console.log(error);
    res.status(500).json({error:"Error Occured ",error});
  }
});

//staff delete method
router.delete('/:id',verifyToken,roleMiddleware(["Admin"]),validateStaffId,async(req,res)=>{
  try{
    const {id} = req.params;
    const result = await staff.findByPk(id);
    if(!result){
      return res.status(404).json({message:"No Staff found with the Id"});
    }
    await result.destroy();
    res.status(200).json({message:"Staff Deleted Successfully"});
  }
  catch(error){
    console.log(error);
    res.status(500).json({error:"Error Occured ",error});
  }
});

//get staffs with students
router.get('/getallstudent/:id',verifyToken,roleMiddleware(["Admin"]),validateStaffId,async(req,res)=>{
  try{
    const {id} = req.params;
    const result = await staff.findByPk(id,{
      include:{
        model:student,
        attributes:['studentName','age','marks']
      },
      attributes:{
        exclude:['password']
      }
    });
    if(!result){
      return res.status(404).json({message:"No Students Found for Staff"});
    }
    res.status(200).json(result);
  }
  catch(error){
    console.log(error);
    res.status(500).json({error:"Error Occured ",error});
  }
});

module.exports = router;