const express = require("express");
const userRouter = express.Router();
const  { authenticate } = require("../middlewares/auth");
const connectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");
const USER_SAFE_DATA = "firstName lastName age gender skills hobbies";

userRouter.get("/user/requests/received",authenticate,async (req,res) => {

    try{
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId",["-_id","firstName","lastName","age","gender","skills","hobbies"]);


        
        res.json({
            message:"data fetched successfully",
            data:connectionRequests
        
        })
    }
    catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});


userRouter.get("/user/connections",authenticate,async (req,res) => {

    try{
        const loggedInUser = req.user;

        const connectionRequests = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" },
            ]
        }).populate("fromUserId", ["-_id", "firstName", "lastName", "age", "gender", "skills", "hobbies"]);

        console.log(connectionRequests);
        console.log(loggedInUser._id);

        const data = connectionRequests.map(row => {
            //console.log(">>",row.fromUserId._id,loggedInUser._id);

            if (row.fromUserId._id &&  row.fromUserId._id.equals(loggedInUser._id)) {
                return row.toUserId;
            } 
            return row.fromUserId;                   
            
        });
        console.log(data);

        res.send({
            message: "data fetched successfully",
            data: data
        });
    }
    catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});


userRouter.get("/feed",authenticate,async (req,res) => {

    try{
        const loggedInUser = req.user;

        const page = req.query.page || 1;
        let limit = req.query.limit || 10;
        limit = limit > 50 ? limit : 10;
        const skip = (page-1)*limit;
        // user can see all people except 
        // self
        // hisconnection
        // ignore
        // already sent conn request

        const connectionRequests = await connectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId")
        //.populate("fromUserId",["firstName"]);

        const hideUserfromfeed = new Set();
        connectionRequests.forEach(row => {
            hideUserfromfeed.add(row.fromUserId.toString());
            hideUserfromfeed.add(row.toUserId.toString());
        });
        console.log(hideUserfromfeed);
        
        const user = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserfromfeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_SAFE_DATA).limit(limit).skip(skip);
        //complicated like skills and hobbies
        //filter
        //check mongo queries eq,nq..

        res.send({
            message: "data fetched successfully",
            data: user
        });
    }
    catch(err){
        console.log(err);
        res.status(500).send(err);
    }
    
});

module.exports = userRouter;
    

module.exports = userRouter;