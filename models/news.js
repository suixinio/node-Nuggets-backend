const mongose = require('mongoose')

var Schema = mongose.Schema

var newsSchema = new Schema({
    content:String,
    userId:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    creatTime:{
        type:String,
        required:true
    },
    tags:{
        type:String,
        required:true
    },
    newsId:{
        type:Number,
        required:true,
        unique:true
    }
})

module.exports = mongose.model('news',newsSchema)
