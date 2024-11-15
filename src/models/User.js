const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  firstName: { 
    type: String,
    minLength: 4,
    required: true,
  },
  lastName: { type: String},
  email: { 
    type: String, 
    unique: true, 
    required: true,
  },
  password: { 
    type: String,
    required: true,
    minLength: 8,
  },
  age: { 
    type :Number,
    min : 18,
    max : 60,
    required : true,
  },
  gender: { type: String},//use validate method
  skills : [String],
  hobbies : [String],
},{
  timestamps: true
});


userSchema.methods.getJWTToken = async function () {
  const user = this;
  let token = jwt.sign({_id:this.id},"DND",{"expiresIn":"1d"});
  return token;
};

userSchema.methods.validatepassword = async function (passwordInputByUser) {
  const user = this;
  let isMatch = await bcrypt.compare(passwordInputByUser,user.password);
  return isMatch;
};

const User = mongoose.model('User', userSchema);



module.exports = mongoose.model('user', userSchema);