const express = require("express");
const profileRouter = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const {authenticate} = require('../middlewares/auth');
const {validateFields,validateEditFields} = require('../utils/validator');
const bcrypt = require('bcrypt');

profileRouter.get('/profile',authenticate,async (req,res) => {

    const cookie = req.cookies;
    console.log(cookie);
  
    let id = jwt.verify(cookie.token,"DND")._id;
    console.log(id);
    if (!id) {
      res.send("Invalid token");
    }
  
    let data = await User.findById(id);
    if(!data){
      res.status(404).send("User not found");
    }
    //let data = req.user;
    res.send({data});
  
});

profileRouter.patch("/profile/edit",authenticate,async (req,res) => {
  try {
    if(!validateEditFields(req)){
      throw new Error("Invalid edit request");
    }
    if(req.body.password == "" && req.body.oldPassword == ""){
      throw new Error("Password cannot be empty");
    }

    const loggedinuser = req.user;
    //console.log("b4",loggedinuser);
    Object.keys(req.body).forEach((key) => loggedinuser[key]=req.body[key]);
    //console.log("after",loggedinuser);
    await loggedinuser.save();
    res.send(`${loggedinuser.firstName}, your profile updated`);
  } catch (error) {
    res.status(400).send("error"+error.message);
  }
  
})
  


profileRouter.patch("/profile/password",authenticate,async (req,res) => {
  try {
    const loggedinuser = req.user;
    const {oldPassword, newPassword} = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).send("Both old and new passwords are required.");
    }

    const isMatch = await loggedinuser.validatepassword(oldPassword);
    if (!isMatch) {
      return res.status(401).send("Incorrect old password.");
    }
    let passwordHash = await bcrypt.hash(newPassword,10);
    loggedinuser.password = passwordHash; // The pre-save hook in the User model will hash this
    await loggedinuser.save();
    res.send("Password updated successfully.");
  } catch (error) {
    res.status(500).send("Error updating password: " + error.message);
  }
});
/*  
app.delete('/delete', async (req, res) => {
    try{
      let data = await User.findByIdAndDelete(req.body.id);
      res.send("successfuly deleted the data");
    }
    catch(err){
      res.status(500).send(err);
    }
});
  
app.patch('/update', async (req, res) => {
    console.log(req.body);
    try{
      let data = await User.findByIdAndUpdate(req.body.id,req.body,{returnDocument:'before'});
      console.log(data);  
      res.send("successfuly updated the data");
    }
    catch(err){
      res.status(500).send(err);
    }
});

*/

module.exports = profileRouter;