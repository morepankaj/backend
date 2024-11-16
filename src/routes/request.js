const express = require("express");
const requestRouter = express.Router();

const {authenticate} = require('../middlewares/auth');

requestRouter.post('/sendConnectionRequest',authenticate,async (req,res) => {

  
    let user = req.user;
    res.send(user.firstName + " sending connection request.");
  
});

module.exports = requestRouter;