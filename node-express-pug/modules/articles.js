let mongoose = require('mongoose');

// articles schema
let articlesSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  auther:{
    type: String,
    required:true
  },
  body:{
    type: String,
    required: true
  }
})

let Articale = module.exports.model('Article', articleSchema)
