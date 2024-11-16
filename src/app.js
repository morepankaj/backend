const express = require('express');
const {connectDB} = require('./config/database');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.get("/ping",async (req,res)=> {res.send("Ok")});

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);


connectDB().then(() => {
  console.log('Connected to MongoDB');
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});



