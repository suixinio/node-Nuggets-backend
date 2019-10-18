/**
 *  token verify 
 */

const config = require('./../config')
const jwt = require('jsonwebtoken')

module.exports = async(ctx,next)=> {
    const reqToken = ctx.get('token')
    if(reqToken == '') {
        ctx.throw(401,'没有携带token')
    }
    let verifyToken;
    try {
        verifyToken = await jwt.verify(reqToken, config.jwt.secret); // 验证
    }catch(err) {
        if ('TokenExpiredError' === err.name) {
            ctx.throw(401, 'token expired,请及时本地保存数据！');
        }
        ctx.throw(401,'token error')
    }
    await next()
}