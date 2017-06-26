const express = require('express');
const path = require('path');  // core module inclued by default
const mongoose = require('mongoose'); // structure data on a application level
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

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

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


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
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  // get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_article', {
      title:'Add Article',
      errors:errors
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'Article Added')
        res.redirect('/')
      }
    })
  }
});

// update submit article
app.post('/articles/edit/:id', function(req, res) {
  let article = {}
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){  // useing Article Model
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Article Updated')
      res.redirect('/')
    }
  });
});

// delete article
app.delete('/article/:id', function(req, res){
  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if(err){
      console.log(err)
    }
    req.flash('danger', 'Article Deleted')
    res.send('Success');
  });
});

//start server
app.listen(3000,function(){
  console.log("Server Started On Port 3000....")
});
