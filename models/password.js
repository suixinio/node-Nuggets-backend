const mongoose = require('mongoose')

var Schema = mongoose.Schema
var passwordSchema = new Schema({
    userId:{
        type:String,
        required:true,
        unique:true
    },
    hash:{
        type:String,
        required:true
    },
},{ collection: 'password', versionKey: false})

module.exports = mongoose.model('password',passwordSchema)