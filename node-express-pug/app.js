const express = require('express');
const path = require('path');  // core module inclued by default
const mongoose = require('mongoose'); // structure data on a application level

mongoose.connect('mongodb://localhost/nodedb');
let db = mongoose.connection;


// check connection
db.once('open',function(){
  console.log('Connected to MongoDB');
});

// check for DB errots
db.on('error', function(err){
  console.log(err);
});

// init app
const app = express();

// breing in models
let Article = require('./models/article')

// load view engine
app.set('views', path.join(__dirname, 'views'));  // dirname meaning the current direc, view -- views folder
app.set('view engine', 'pug'); // chose the pug view engine


// home route
app.get('/', function(req, res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title:'Articles',
        articles: articles
      });
    }
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
