//mongodb+srv://pankajmore1991:ybGgZD4V2rzfLTQk@cluster0.hgzgr.mongodb.net/admin?authSource=admin&replicaSet=atlas-lp4lw1-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true
//mongodb+srv://pankajmore1991:<db_password>@cluster0.hgzgr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const mongoose = require('mongoose');
//const { MongoClient } = require('mongodb');
const connectDB = async () => {
    await mongoose.connect("mongodb+srv://pankajmore1991:ybGgZD4V2rzfLTQk@cluster0.hgzgr.mongodb.net/study_material");
}

module.exports = {connectDB};

