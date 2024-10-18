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