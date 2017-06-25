const express = require('express');
const path = require('path');  // core module inclued by default

// init app
const app = express();

// load view engine
app.set('views', path.join(__dirname, 'views'));  // dirname meaning the current direc, view -- views folder
app.set('view engine', 'pug'); // chose the pug view engine

// home route
app.get('/', function(req, res){
  let articles = [
    {
      id:1,
      title:'Aricle One',
      auther:'lin',
      body:'This is article one'
    },{
      id:2,
      title:'Aricle Twe',
      auther:'wang',
      body:'This is article one'
    },{
      id:3,
      title:'Aricle Three',
      auther:'Sturloly',
      body:'This is article one'
    }
  ]
  res.render('index', {
    title:'Articles',
    articles: articles
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
