const { param,body,validationResult} = require('express-validator');

const validateStudentCreate = [
   body("studentName")
      .trim()
      .isString().withMessage("Student Name must be a string")
      .notEmpty().withMessage("Student Name is required")
      .isLength({min:3,max:12})
      .custom((value) => {
         if (/\d/.test(value)) {  // Check if it contains a number
           throw new Error("Staff name cannot contain numbers");
         }
         return true;
       }),

   body("marks")
      .trim()
      .notEmpty().withMessage("Student mark is required")
      .isInt({min:0,max:100}).withMessage("Marks must be a Number"),

   body("age")
      .trim()
      .notEmpty().withMessage("Age is required")
      .isInt({min:18}).withMessage("Age must be greater than 18"),
      
   body("staff_id")
      .trim()
      .notEmpty().withMessage("Staff id is requied")
      .isInt().withMessage("Staff Id must be a Number"),

   body('password')
      .trim()
      .notEmpty().withMessage("Password is required")
      .isLength({min:8}).withMessage("Password length must be greater than 8 characters"),
     
   handleValidationError,   
];

const validateStudentUpdate = [
   body("studentName")
      .trim()
      .optional()
      .isString().withMessage("Student Name must be a string")
      .isLength({min:3,max:12}).withMessage("Student Name length should be in range of 3 to 12")
      .custom((value) => {
         if (/\d/.test(value)) {  // Check if it contains a number
           throw new Error("Staff name cannot contain numbers");
         }
         return true;
       }),

   body("marks")
      .trim()
      .optional()
      .isInt({min:0,max:100}).withMessage("Marks must be a Number"),

   body("age")
      .trim()
      .optional()
      .isInt({min:18}).withMessage("Age must be greater than 18"),
      
   body("staff_id")
      .trim()
      .optional()
      .isInt().withMessage("Staff Id must be a Number"),
   
   body('password')
      .trim()
      .optional()
      .isLength({min:8}).withMessage("Password length must be greater than 8 characters"),
   
   param('id')
      .trim()
      .notEmpty().withMessage("id is required")
      .isInt().withMessage("id must be a number"),   
         
   handleValidationError,   
];

const validateStudentId = [
   param("id")
      .trim()
      .notEmpty().withMessage("id is required")
      .isInt().withMessage("id must be a Number"),
   handleValidationError,
];

const validateStudentLogin = [
   body('studentName')
      .trim()
      .notEmpty().withMessage("Student Name is Required")
      .isLength({min:3,max:12}).withMessage("Student Name length should be in range of 3 to 12")
      .custom((value) => {
         if (/\d/.test(value)) {
           throw new Error("Staff name cannot contain numbers");
         }
         return true;
      }),

   body('password')
      .trim()
      .notEmpty().withMessage("Password is required")
      .isLength({min:8}).withMessage("Password length must be greater than 8 characters"),

   body('role')
      .trim()
      .optional()
      .notEmpty().withMessage("Role is required"),

   handleValidationError
];
 
function handleValidationError(req,res,next){
   const errors = validationResult(req);
   if(!errors.isEmpty()){
      return res.status(400).json({error:errors.array()})
   }
   next();
}

module.exports = { validateStudentId,validateStudentCreate,validateStudentUpdate,validateStudentLogin }