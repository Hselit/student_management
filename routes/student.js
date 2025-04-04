var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
require('dotenv').config();

const {validateStudentUpdate,validateStudentCreate,validateStudentId,validateStudentLogin} = require('../middleware/studentValidator');
const {verifyToken,roleMiddleware} = require('../middleware/auth');

var db = require('../models/index');
const upload = require('../middleware/imageUpload');
var {staff,student} = db;

router.post('/studentlogin',validateStudentLogin,async function(req,res){
  try{
    const {studentName,password} = req.body;
    const data = await student.findOne({where:{studentName}});
    if(!data){
      return res.status(400).json({message:"No Student found with the name"});
    }
    if(password != data.password){
      return res.status(400).json({message:"Invalid Password"});
    }
    const role = "student"
    const token = jwt.sign({studentName,password,role},process.env.JWT_SECRET,{expiresIn:'1h'});
    res.status(200).json({message:"Logged In Successfully",token});
  }
  catch(error){
    console.log(error);
    res.status(500).json({error:"Error Occured ",error});
  }
});

//get student method
router.get('/',verifyToken,async function(req, res, next) {
  try{
    const data = await student.findAll();
    if(data.length == 0){
      return res.status(200).json({message:"No student Found.."});
    }
    res.status(200).json(data);
  }catch(error){
    console.log(error);
    res.status(500).json({error:"Error Occured ",error});
  }
});

//get single student method
router.get('/:id',verifyToken,roleMiddleware(["Admin"]),validateStudentId,async(req,res)=>{
  try{
    const {id} = req.params;
    const data = await student.findByPk(id);
    console.log(data);
    if(!data){
      return res.status(404).json({message:"No student found with the Id"});
    }
    res.status(200).json(data);
  }
  catch(error){
    console.log(error);
    res.status(500).json({error:"Error Occured ",error});
  }
});

//student post method
router.post('/',verifyToken,roleMiddleware(["Admin"]),upload.single('profile'),validateStudentCreate,async function(req,res){
  try{
    const {studentName,password,marks,age,staff_id} = req.body;
    const profile = req.file ? req.file.filename : null;

    // if(!staffName || !experience || !role){
    //   return res.status(400).json({message:"All Fields Required"});
    // }
    await student.create({studentName,password,age,marks,staff_id,profile});
    res.status(201).json({message:"student Added Successfully"});
  }
  catch(error){
    console.log(error);
    res.status(500).json({error:"Error Occured ",error});
  }
});

//student update method
router.put('/:id',verifyToken,roleMiddleware(["Admin"]),upload.single('profile'),validateStudentUpdate,async(req,res) => {
  try{
    const {id} = req.params;
    const {studentName,marks,age,staff_id,password} = req.body;
    const image = req.file ? req.file.filename : null;

    // if(!studentName || !marks || !age ||!staff_id){
    //   return res.status(400).json({message:"All fields are required"});
    // }

    const checkexistdata = await student.findByPk(id);
    console.log(checkexistdata);
    if(!checkexistdata){
      return res.status(404).json({message:"Not student found with the id"});
    }
    const updateData = { studentName, marks, age, staff_id, password };
    if (image) updateData.profile = image;

    const dt = await student.update(updateData,{where:{id}});
    if(dt[0] === 1){
      return res.status(200).json({ message: "student updated successfully" });
    }
    return res.status(400).json({ message: "No changes made"});
    
  }catch(error){
    console.log(error);
    res.status(500).json({error:"Error Occured ",error});
  }
});

//staff delete method
router.delete('/:id',verifyToken,roleMiddleware(["Admin"]),validateStudentId,async(req,res)=>{
  try{
    const {id} = req.params;
    const result = await student.findByPk(id);
    if(!result){
      return res.status(404).json({message:"No student found with the Id"});
    }
    await result.destroy();
    res.status(200).json({message:"student Deleted Successfully"});
  }
  catch(error){
    console.log(error);
    res.status(500).json({error:"Error Occured ",error});
  }
});

//get student with staff
router.get('/getstaff/:id',verifyToken,roleMiddleware(["Admin"]),validateStudentId,async(req,res)=>{
  try{
    const {id} = req.params;
    const result = await staff.findByPk(id,{
      include:{
        model:student,
        attribute:{
          exclude:['password']
        }
      },
      attribute:{
        exclude:['password']
      }
    });
    if(!result){
      return res.status(404).json({message:"No Staff Found"});
    }
    res.status(200).json(result);
  }catch(error){
    console.log(error);
    res.status(500).json({error:"Error Occured ",error});
  }
});

module.exports = router;