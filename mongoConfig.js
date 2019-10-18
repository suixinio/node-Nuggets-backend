const mongoose = require('mongoose')

const config = require('./config')

if(process.env.NODE_ENV == 'dev') { // 如果是开发环境 把集合方法和参数打印到控制台
    mongoose.set('debug',true)
}

/**
 * 将 bufferMaxEntries 设为 0 同时将 bufferCommands 设为 false，可以让驱动在未连接到数据库的时候，操作立即返回失败，而不是一直在等待重连。
 */

mongoose.set('bufferCommands',false)

function connectMongoDB(address) {
    try{
        mongoose.connect(address,{
            useNewUrlParser:true,
            bufferMaxEntries:0,
            autoReconnect:true,
            poolSize:5
        })
        const db = mongoose.connection
        db.on('error',(err)=> {
            console.log('connect error'+err)
        })
        db.once('open',()=> {
            console.log('connect success...')
        })
        return db
    } catch(err) {
        console.log('connect error' + err)
    }
}

module.exports = connectMongoDB