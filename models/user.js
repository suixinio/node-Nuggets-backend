var mongoose = require('mongoose')

var Schema = mongoose.Schema;
var userSchema = new Schema({
    userId:{
        type:String,
        unique:true,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String
    },
    phone:{
        type:String
    },
    pic:{
        type:String
    },
    collections:{
        type:Array,
    }
},{ collection: 'user', versionKey: false})

module.exports = mongoose.model('user',userSchema)
