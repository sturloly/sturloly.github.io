const express = require('express');

const app = express();

app.get('/', function(req, res){
  res.send('stop hello world please');
});

app.listen(3000,function(){
  console.log("Server Started On Port 3000....")
});
