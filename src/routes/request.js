const express = require("express");
const requestRouter = express.Router();

const {authenticate} = require('../middlewares/auth');
const User = require('../models/User');
const ConnectionRequest = require('../models/ConnectionRequest');
const mongoose = require('mongoose');


requestRouter.post('/sendConnectionRequest',authenticate,async (req,res) => {

  
    let user = req.user;
    res.send(user.firstName + " sending connection request.");
  
});

requestRouter.post("/request/send/:status/:toUserId", authenticate,  async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res
            .status(401)
            .json({ error: "Unauthorized. Please login again." });
        }

        const fromUserId = user._id;
        const { status, toUserId } = req.params;
        // a=> b
        // b should be login user

        //! Checking if toUserId exist in user database

        if (mongoose.Types.ObjectId.isValid(toUserId)) {
            const isToUserExist = await User.findById(toUserId);
            if (!isToUserExist) {
            return res.status(400).json({ error: "User not exists" });
            }
        } else {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        //! check if toUserId === fromUserId
        if (fromUserId.equals(toUserId)) {
            return res
            .status(400)
            .json({ error: "You Could not send request to yourself" });
        }

        const allowedStatus = ["interested", "ignored"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ error: `invalid status type ${status}` });
        }

        //! checking if there is existing connectionRequest

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [ 
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });

        if (existingConnectionRequest) {
            return res
            .status(400)
            .json({ error: "Connection request already exist" });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();
        if (status === "interested") {
            res.status(200).json({ message: "Connection request Send" });
        } else if (status === "ignored") {
            res.status(200).json({ message: "User ignored" });
        } else {
            res.status(400).json({ error: "Invalid request type" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
  }
);

requestRouter.post('/request/review/:status/:requestId',authenticate,async (req,res) => {
    try{
        const loggedInUser = req.user;
        const {status,requestId} = req.params;
        console.log(status,requestId,req.params);

        const allowedStatus = ['accepted','rejected'];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:`invalid status type ${status}`});
        }
        console.log(loggedInUser);
        console.log(requestId,loggedInUser._id,loggedInUser._id.toString());

        const connectionRequest = await ConnectionRequest.findOne({ 
            fromUserId : requestId,
            toUserId : loggedInUser._id,
            status : "interested"
        });
        console.log(connectionRequest);
        if(!connectionRequest){
            return res.status(400).json({message: "connection request not found"});
        }
        connectionRequest.status = status;
        let data = await connectionRequest.save();
        res.status(200).json({message:'connection status'+status,data});
    
    }
    catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = requestRouter;