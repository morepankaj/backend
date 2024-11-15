const validate = require('validator');

function validateFields(req) {
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.age) {
        throw new Error("fields are missing. All fields is required");
    }
    if(req.body.age < 18 || req.body.age > 60){
        throw new Error("Invalid age");
    }
    if (!validate.isLength(req.body.password, { min: 8, max: 16 })) {
        throw new Error("Password must be between 8 and 16 characters long");
    }
    if (!validate.isStrongPassword(req.body.password)) {
        throw new Error("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
    }
    if (!validate.isLength(req.body.firstName, { min: 4 })) {
        throw new Error("First name must be at least 4 characters long");
    }
    if (!validate.isEmail(req.body.email)) {
        throw new Error("Invalid email address");
        
    }

}

module.exports = {validateFields};