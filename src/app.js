const express = require('express');

const app = express();

app.use('/user', (req, res) => {
  console.log('Request received for /user , i won\'t allow');
  res.send("i mont allow");
});

app.get('/user', (req, res) => {
  res.send({"first_name":"John","last_name":"Doe"});
});


app.post('/user', (req, res) => {
  res.send('User created successfully');
});


app.delete('/user', (req, res) => {
  const userId = "";//req.params.id;
  res.send(`User with ID ${userId} deleted successfully`);
});



app.use("/test",(req,res) => {
    res.send("Hello test from Server");
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});