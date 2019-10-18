const mongoose = require('mongoose')

var Schema = mongoose.Schema

var discussSchema = new Schema({
    disId:{
        type:String,
        unique:true,
        required:true
    },
    newsId:{
        type:String,
        required:true
    },
    userId:{
        type: String,
        required:true
    },
    content:String,
    time:String
})

module.exports = mongoose.model('discuss',discussSchema,'discuss')