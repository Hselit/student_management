const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
   destination:function (req,file,cb){
      cb(null,'./uploads/');
   },
   filename:function (req,file,cb){
      const name = Date.now() + '-' +file.originalname;
      cb(null,name);
   }
});

const fileFilter = (req,file,cb)=>{
   const allowedTypes = /jpeg|png|jpg/;
   const ext = path.extname(file.originalname).toLowerCase();
   if(allowedTypes.test(ext)){
      cb(null,true);
   }
   else{
      cb(new Error('Only jepg,png,jpg images are allowed'));
   }
};

const upload = multer({storage,fileFilter})
module.exports = upload;