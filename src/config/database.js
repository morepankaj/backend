const mongoose = require('mongoose');
//const { MongoClient } = require('mongodb');
const connectDB = async () => {
    await mongoose.connect(process.env.CONNECTION_STRING);
}

module.exports = {connectDB};

