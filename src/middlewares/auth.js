const jwt = require('jsonwebtoken');
const User = require('../models/User');


async function authenticate(req, res, next) {
    /* let token = "123456"
    if(token === '1234566') {
        console.log('user authenticated');
      next();
    } else {
      res.sendStatus(401);
    } */

    try {
        const {token} = req.cookies;
        if (!token) {
            throw new Error("Token is missing");
        }
        const decodedOjb = await jwt.verify(token, "DND");
        const {_id} = decodedOjb; 
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
        
    } catch (error) {
        res.status(500).send(error);
    }
}

function adminAuth(req,res,next) {
    let token = 'asdf';
    if(token === 'asdfg') {
        console.log('admin authenticated');
        next();
    } else {
        res.sendStatus(401);
    }
}



module.exports = {authenticate};//,adminAuth