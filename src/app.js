const express = require('express');
const {connectDB} = require('./config/database');
const User = require('./models/User');
const {validateFields} = require('./utils/validator');
const bcrypt = require('bcrypt');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {authenticate} = require('./middlewares/auth');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/user',async (req,res) => {
  console.log(req.body.email);
  try{
    let data = await User.find({"email" : req.body.email});
    if(data.length == 0){
      res.status(404).send("User not found");
    }
    res.send(data);
  }
  catch(err){
    res.status(500).send(err);
  }

})

app.get('/feed',async (req,res) => {
  try{
    let data = await User.find({});
    if (data.length == 0) {
      res.status(404).send("No data found")
    }
    res.send(data);
  }
  catch(err){
    res.status(500).send(err);
  }

});

app.post('/signup', async (req, res) => {
  
  try{
    validateFields(req);
    let {firstName,lastname,email,password,age,gender} = req.body;
    let passwordHash = await bcrypt.hash(password,10);
    console.log(req.body);
    let user = new User({firstName,lastname,email,password:passwordHash,age,gender});
    await user.save();
    res.send("Data saved successfully");
  }
  catch(err){
    res.status(500).send(err.message);
  }
});

app.post('/login', async (req, res) => {
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
    res.status(500).send(err);
  }
});


app.post('/sendConnectionRequest',authenticate,async (req,res) => {

  
  let user = req.user;
  res.send(user.firstName + " sending connection request.");

});

app.get('/profile',authenticate,async (req,res) => {

  /* const cookie = req.cookies;
  console.log(cookie);

  let id = jwt.verify(cookie.token,"DND")._id;
  console.log(id);
  if (!id) {
    res.send("Invalid token");
  }

  let data = await User.findById(id);
  if(!data){
    res.status(404).send("User not found");
  } */
  let data = req.user;
  res.send({data});

});


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

app.get( '/getUserData', (req, res) => {
  res.send('get all data');
  
})


connectDB().then(() => {
  console.log('Connected to MongoDB');
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});



