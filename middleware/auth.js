require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
   const token = req.headers["authorization"];

   console.log("Token Received:", token);

   if (!token) {
       return res.status(401).json({ message: "Authentication Required: No token provided" });
   }

   try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       console.log("Verified Successfully:", decoded);

       req.user = decoded;
       next();
   } catch (error) {
       return res.status(401).json({ message: "Unauthorized: Invalid Token" });
   }
};


const roleMiddleware = (allowedRoles)=>{
   return (req,res,next) =>{
      if(!req.user || !allowedRoles.includes(req.user.role)){
         return res.status(401).json({message:"Forbidden:Access Denied"});
      }
      next();
   }
}

module.exports = {roleMiddleware,verifyToken};