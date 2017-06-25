const express = require('express');
const path = require('path');  // core module inclued by default

// init app
const app = express();

// load view engine
app.set('views', path.join(__dirname, 'views'));  // dirname meaning the current direc, view -- views folder
app.set('view engine', 'pug'); // chose the pug view engine

// home route
app.get('/', function(req, res){
  res.render('index', {
    title:'Hello World'
  });
});

// add route
app.get('/articles/add' , function(req, res){
  res.render('add_article', {
    title:'Add Articles'
  })
});


//start server
app.listen(3000,function(){
  console.log("Server Started On Port 3000....")
});
