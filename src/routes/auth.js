const express = require("express");
const authRouter = express.Router();

const validator = require('validator');
const {validateFields} = require('../utils/validator');
const bcrypt = require('bcrypt');
const User = require('../models/User');

authRouter.post('/signup', async (req, res) => {
  
    try{
      validateFields(req);
      let {firstName,lastname,email,password,age,gender,about,skills,hobbies} = req.body;
      let passwordHash = await bcrypt.hash(password,10);
      console.log(req.body);
      let user = new User({firstName,lastname,email,password:passwordHash,age,gender,about,skills,hobbies});
      await user.save();
      res.send("Data saved successfully");
    }
    catch(err){
      res.status(500).send(err.message);
    }
  });
  
authRouter.post('/login', async (req, res) => {
    try{
        let {email,password} = req.body;
        if (validator.isEmpty(email) || validator.isEmpty(password)) {
        throw new Error("Email and password are required");
        }
        if (!validator.isEmail(email)) {
        throw new Error("Invalid email address");
        }
        if (!validator.isLength(password, { min: 8, max: 16 })) {
        throw new Error("Password must be between 8 and 16 characters long");
        }
        let user = await User.findOne({email:email});
        if(!user){
        res.status(404).send("Invalid credentials");
        }
        //await bcrypt.compare(password,user.password);
        let passwordMatch = user.validatepassword(password);
        if(!passwordMatch){
        res.status(401).send("Invalid credentials");
        }
        //let token = jwt.sign({_id:user.id},"DND",{"expiresIn":"1d"});
        let token = await user.getJWTToken();
        console.log(token);
        res.cookie('token',token);
        res.send("Login successful");
    }
    catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

authRouter.post('/logout',async (req,res) => {
    res.cookie('token', null, { expires: new Date(Date.now() + 3600000) });
    res.send("logout successfuly..");
});

module.exports = authRouter;