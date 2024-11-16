const express = require("express");
const profileRouter = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const {authenticate} = require('../middlewares/auth');

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