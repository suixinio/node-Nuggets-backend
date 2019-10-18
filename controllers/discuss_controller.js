const discuss_Col = require('./../models/discuss')
const news_Col = require('./../models/news')
const uuid = require('uuid')

/**
 * 新增评论
 * @param {String} userId 
 * @param {String} newsId
 * @param {String} content 评论内容
 * @param {String} time 评论时间 
 */
const addDiscuss = async (ctx,next)=> {
    var {userId,newsId,content,time} = req = ctx.request.body
    if(!userId || !newsId || !time || !content) {
        ctx.status = 401
        ctx.body = {
            data: {
                code: 401,
                msg: '缺少必填项'
            }
        }
        return
    }
    try {
        req.disId = uuid.v1()
        const newDis = await discuss_Col.create(req)
        if(newDis){
            var data = await discussByNewsId(ctx,newsId)
            console.log(data)
            ctx.status = 200
            ctx.body = {
                data: {
                    list: data
                }
            }
        }else {
            ctx.throw('500','error')
        }
    } catch (err) {
        ctx.status = 500
        ctx.body = {
            data: {
                code: 500,
                msg: 'server error '+ err
            }
        }
    }
}

/**
 * 获取评论
 * @param {String} newsId 
 */
const getDiscussByNewsId = async (ctx,next)=> {
    var { newsId } = ctx.request.body
    if(!newsId) {
        ctx.status = 401
        ctx.body = {
            data: {
                code: 401,
                msg: '缺少必填项'
            }
        }
        return
    }
    try {
        var data = await discussByNewsId(ctx,newsId)
        ctx.status = 200
        ctx.body = {
            data: {
                list: data,
                code: 200
            }
        }
        
    } catch (error) {
        ctx.status = 500
        ctx.body = {
            data: {
                code: 500,
                msg: 'server error'+ error
            }
        }
    }
}

/**
 * 删除指定评论
 * 1. 如果文章作者 可以删除所有评论
 * 2. 如果不是作者 只可以删除自己的评论
 * @param {String} userId 当前登录的用户
 * @param {String} newsId 当前文章id
 * @param {String} disId 当前评论id
 */
const delateDiscussById = async (ctx)=> {
    var { newsId,userId,disId } = req = ctx.request.body
    if(!newsId || !userId || !disId) {
        ctx.status = 401
        ctx.body = {
            data: {
                code: 401,
                msg:'缺少必填项'
            }
        }
        return
    }
    try {
        var authorId = '' // 此文作者
        var disAuthorId = '' // 评论者

        await news_Col.findOne({
            newsId:newsId
        }).then(item=> {
            authorId = item.userId
        })

        await discuss_Col.findOne({
            disId:disId
        }).then(item=> {
            disAuthorId = item.userId
        })

        if( authorId == userId || disAuthorId == userId) {
            await discuss_Col.deleteOne({disId:disId}).then(async x=> {
                var list = await discussByNewsId(ctx,newsId)
                ctx.status = 200
                    ctx.body = {
                        data: {
                            code: 200,
                            list: list
                        }
                    }
            }).catch(err=> {
                ctx.status = 500
                ctx.body = {
                    data: {
                        code: 500,
                        msg: err
                    }
                }
            })
        }else {
            ctx.status = 401
            ctx.body = {
                data: {
                    code: 401,
                    msg:'权限不足'
                }
            }
        }

    } catch (error) {
        ctx.status = 500
        ctx.body = {
            data: {
                code: 500,
                msg: error
            }
        }
    }



}

/**
 * 查询指定文章的评论
 * @param {String} newsId
 */
const discussByNewsId = async(ctx,newsId)=> {
    var newsId = newsId
    var data = []
    await discuss_Col.aggregate([
        {
          $lookup:
            {
              from: "user",
              localField: "userId",
              foreignField: "userId",
              as: "item"
            }
        },{
            $match:{
                newsId:newsId
            }
        },{
            $project:{
               "_id":0,"content":1,"time":1,"disId":1,"item.userName":1,"item.pic":1,"item.userId":1,
            }
        }
      ]).then(item=> {
          data = item
      }).catch(err=> {
          ctx.throw('500','server error'+ err)
      })
    return data
}


module.exports = {
    addDiscuss,
    getDiscussByNewsId,
    delateDiscussById,
}