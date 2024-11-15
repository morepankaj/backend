- order of routing is imp

//1
app.use("/hello/2",(req,res) => {
    res.send("Hello hello 2 from Server");
});

//2
app.use("/hello",(req,res) => {
    res.send("Hello hello from Server");
});
// if we swicth above then 2nd will print becasue it matches this url regardless of 1st

//3
app.use("/test",(req,res) => {
    res.send("Hello test from Server");
});

//4
app.use("/",(req,res) => {
    res.send("Hello World from Server");
});

// same for 4, if we move 4 to 1st then it will return 1st

example

========================================================

const express = require('express');

const app = express();

/* app.use((req,res) => {
    res.send("Hello World from Server");
}); */

app.use("/hello/2",(req,res) => {
    res.send("Hello hello 2 from Server");
});

app.use("/hello",(req,res) => {
    res.send("Hello hello from Server");
});


app.use("/test",(req,res) => {
    res.send("Hello test from Server");
});

app.use("/",(req,res) => {
    res.send("Hello World from Server");
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

================================================================


const express = require('express');

const app = express();

//ab+c  : start and end  with a and c and b+ as many
//ab*cd : start with ab and end with cd,* means any 
//a(bc)?d  : (bc) optional
app.get('/a(bc)?d', (req, res) => {
  res.send({'msg':'Hello, World!'});
});

// : means dynamic routes
app.get('/user/:userID', (req, res) => {
    console.log(req.params,req.query);
  res.send({'msg':'Hello, World!'});
});

// use ?,+,(),* in routes


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


========================================================

app.use('/user',(req,res,next)=>{
  console.log("handling route 1");
  next();
},
(req,res,next)=>{
  console.log("handling route 2");//res.send("<h1>Hello</h1>");
  next();
},
(req,res,next)=>{
  console.log("handling route 3");
  //next();
  //res.send("<h1>Hello</h1>");
})
/*

- if we add next(), it will pass the control to next route by without res.send() in 1st and 2nd call
- And if add res.send in 1st and 2nd then it will cause issue it will through error on console but output also there of last res.send()
- if we don't send res.send in any method(but have next()) it will through error => Cannot GET /user
- if we don't send res.send then it will hang
*/

========================================================

alternative to above

app.use('/user',(req,res,next)=>{
  console.log("handling route 1");
  next();
});

app.use('/user',(req,res,next)=>{
  console.log("handling route 2");
  res.send("Hello");
});

========================================================


//GET /user => middleware chain => request handler
//1,2,3 are actually middleware

//1
app.use('/',(req,res,next)=>{
  //console.log("handling route 1");
  next();
});
//2
app.use('/user',(req,res,next)=>{
  console.log("handling route 1");
  next();
},
(req,res,next)=>{
  console.log("handling route 2");
  res.send("Hello");
});

========================================================

const { authenticate,adminAuth } = require('./middlewares/auth');

app.use('/user',authenticate);

app.get('/user', (req, res) => {
  res.send('getting user');
});

app.post('/user', (req, res) => {
  res.send('adding user');
});

app.get('/admin',adminAuth, (req, res) => {
  res.send('getting admin');
});

========================================================

try catch

app.get( '/getUserData', (req, res) => {
  //try {
    throw new Error("Error throw");
  //} catch (error) {
    
  //}
  
})

app.use("/",(err,req,res,next) => {
  if(err){
    res.status(500).send("Internal Server Error");
  }
  
});


===================================================