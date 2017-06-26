const express = require('express');
const path = require('path');  // core module inclued by default
const mongoose = require('mongoose'); // structure data on a application level
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodedb');
const db = mongoose.connection;

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

// body parser middleware
// parse application/x-www.form-urlencoded
app.use(bodyParser.urlencoded({ extended:false}));
// parse application/json
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname,'public')));


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

// get single article
app.get('/article/:id', function(req, res){
  Article.findById(req.params.id, function(err, article) {
    res.render('article', {
      article: article
    });
  });
});

// get Edit form
app.get('/article/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article) {
    res.render('edit_article', {
      title:'Edit Article',
      article: article
    });
  });
});

// add route
app.get('/articles/add' ,function(req, res) {
  res.render('add_article', {
    title:'Add Article'
  })
});

// add submit POST route  (same URL allowed as long as different request type)
app.post('/articles/add', function(req, res) {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err){
    if(err){
      console.log(err);
      return;
    } else {
      res.redirect('/')
    }
  })
});


//start server
app.listen(3000,function(){
  console.log("Server Started On Port 3000....")
});
