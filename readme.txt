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