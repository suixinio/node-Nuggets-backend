process.env.NODE_ENV = 'dev'; // 设置开发环境
const hour = 1000 * 60 * 60

module.exports = {
    port:9999,
    db:'mongodb://localhost:27017/logindb',
    saltTimes:3,
    jwt:{
        time:Math.floor(Date.now() / 1000) + 24 * 60 * 60, // token过期时间 1分钟
        secret:'me', // token加密文
    },
    session:{
        key: 'sess',   //cookie key (default is koa:sess)
        maxAge: hour * 2,  // cookie的过期时间 maxAge in ms (default is 1 days)
        overwrite: true,  //是否可以overwrite    (默认default true)
        httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
        signed: false,   //签名默认true
        rolling: true,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
        renew: false,  //(boolean) renew session when session is nearly expired,
    }
}
