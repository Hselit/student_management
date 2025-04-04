const {body,validationResult, param} = require('express-validator');

const validateStaffUpdate = [
   body('staffName')
      .trim()
      .optional()
      .notEmpty().withMessage("StaffName is required")
      .isString().withMessage("Staff name must be a string")
      .isLength({min:3,max:12}).withMessage("length should be minimun of 3 characters and maximum of 12 characters")
      .custom((value) => {
         if (/\d/.test(value)) {  // Check if it contains a number
           throw new Error("Staff name cannot contain numbers");
         }
         return true;
      }),
   
   body('role')
      .trim()
      .optional()
      .notEmpty().withMessage("Role is required")
      .isString().withMessage("role must be a string"),
      
   body('experience')
      .trim()
      .optional()
      .notEmpty().withMessage("Experience is required")
      .isInt({min:0,max:50}).withMessage("experience must be in range of 0-50"),

   body('password')
      .trim()
      .optional()
      .notEmpty().withMessage("Password is required")
      .isLength({min:8}).withMessage("Password length must be greater than 8 characters"),

   param('id')
      .trim()
      .notEmpty().withMessage("id is required")
      .isInt().withMessage("id must be a number"),

   handleValidationError,
];

const validateStaffCreate = [
   body('staffName')
      .trim()
      .notEmpty().withMessage("Staff Name is required")
      .isString().withMessage("Staff name must be a string")
      .isLength({min:3,max:12}).withMessage("length should be minimun of 3 characters and maximum of 12 characters")
      .custom((value) => {
         if (/\d/.test(value)) {  // Check if it contains a number
           throw new Error("Staff name cannot contain numbers");
         }
         return true;
      }),

   body('role')
      .trim()
      .notEmpty().withMessage("Role is required")
      .isString().withMessage("Role must be a string")
      .custom((value) => {
         if (/\d/.test(value)) {  // Check if it contains a number
           throw new Error("Staff name cannot contain numbers");
         }
         return true;
       }),
      
   body('password')
      .trim()
      .notEmpty().withMessage("Password is required")
      .isLength({min:8}).withMessage("Password length must be greater than 8 characters"),
      
   body('experience')
      .trim()
      .notEmpty().withMessage("Experience required")
      .isInt({min:0,max:50}).withMessage("experience must be in range of 0-50"),   
   
   handleValidationError,   
];

const validateStaffId = [
   param("id")
      .isInt().withMessage("Staff Id must be an Integer")
      .notEmpty().withMessage("Staff Id is required"),
   handleValidationError,
];

const validateStaffLogin = [
   body('staffName')
      .trim()
      .notEmpty().withMessage("Staff Name is Required")
      .isString().withMessage("Staff name must be a string")
      .custom((value) => {
         if (/\d/.test(value)) {  // Check if it contains a number
           throw new Error("Staff name cannot contain numbers");
         }
         return true;
       }),

   body('password')
      .trim()
      .notEmpty().withMessage("Password is required")
      .isLength({min:8}).withMessage("Password length must be greater than 8 characters"),
      
   handleValidationError,   
];

function handleValidationError(req,res,next){
   const error = validationResult(req);
   if(!error.isEmpty()){
      return res.status(400).json({error:error.array()});
   }
   next();
}

module.exports = { validateStaffCreate, validateStaffUpdate, validateStaffId, validateStaffLogin }