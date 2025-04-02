var express = require('express');
var router = express.Router();

//student get method
router.get('/',(req,res)=>{
   res.send("Student Routes");
});

module.exports = router;