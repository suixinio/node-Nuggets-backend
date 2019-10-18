const User_col = require('./../models/user');
const Password_col = require('./../models/password');
const ccap = require('ccap')()
const passport = require('./../utils/passport');
const uuid = require('uuid')
const config = require('./../config')
const jwt = require('jsonwebtoken')

/**
 * 登录
 * @param {String} userName 
 * @param {String} password
 * @param {String} code
 * @return { userInfo,token }
 */
const login = async (ctx,next)=> {
    const req = ctx.request.body
    if(!req.userName ||!req.password || !req.code ) {
        ctx.status = 401
        ctx.body = {
            data: {
                code: 401,
                msg: '缺少必填项🙅'
            }
        }
        return
    }
    try{
        const user = await User_col.findOne({
            userName:req.userName
        },{
            __v:0,
            _id:0
        })
        if(!user) { // 没有此用户
            ctx.status = 401 
            ctx.body = {
                msg:'没有此账号',
                code:401
            } 
            return;
        }

        if(req.code !== ctx.session.captcha) {
            ctx.status = 401
            ctx.body = {
                data: {
                    msg:'验证码错误🙅‍',
                    code:401
                }
            }
            return
        }

        const userId = user.userId
        const pass = await Password_col.findOne({
            userId
        },{
            hash:1
        })
        const match = await passport.validate(req.password, pass.hash)
        ctx.status = 200

        const token = jwt.sign({
            uid:user.userId,
            name:user.userName,
            exp:config.jwt.time
        },config.jwt.secret)

        if(match) { // 登录成功
            ctx.body = {
                token:token,
                userId:user.userId,
                userName:user.userName,
                msg:'登录成功',
                code:200
            }
            return;
        }

        ctx.body = {
            msg:'账号或密码错误🙅‍',
            code:400
        }
    } catch(err) {
        ctx.status = 500
        ctx.body = {
            msg:'server error ...'+err,
            code:500
        }
    }
}

/**
 * 注册
 * @param {String} userName 
 * @param {String} password 
 */ 
const regist = async (ctx,next)=>{
    var req = ctx.request.body
    if(!req.userName || !req.password) {
        ctx.status = 401
        ctx.body = {
            code:401,
            msg:'账号或密码必填'
        }
        return;
    }
    try{
        var user = await User_col.findOne({
            userName:req.userName
        })
        ctx.status = 401
        if(user) {
            ctx.body = {
                code:401,
                msg:'账号名重复'
            }
            return;
        }
        
        var userId = uuid.v1() // 生成随机userId
        const newUser = await User_col.create({
            userId: userId,
            userName: req.userName,
            collections:[],
            email:req.email || '',
            phone:req.email || '',
            pic:req.pic || '',
        })

        if(newUser) {
            // 加密
            const hash = await passport.encrypt(req.password, config.saltTimes);
            const result = Password_col.create({
                hash,
                userId:userId
            })
            if(result){
                ctx.body = {
                    code:200,
                    msg:'注册成功',
                    data:{
                        userId:newUser.userId,
                        userName:newUser.userName
                    }
                }
                return;
            }
            ctx.body = {
                code:400,
                msg:'注册失败'
            }
        }
    } catch(err) {
        ctx.status = 500
        ctx.body = {
            code: 500,
            msg:'server error'+err
        }
    }
}

// 生成验证码
const getSvgCode = async (ctx,next)=> {
    var ary = ccap.get()
    let code = ary[0]
    let buf = ary[1]
    ctx.body = buf
    ctx.type= 'image/png'
    ctx.session.captcha = code
    console.log(code)
}

module.exports = {
    login,
    regist,
    getSvgCode,
}