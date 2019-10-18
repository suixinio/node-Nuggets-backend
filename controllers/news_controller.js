const news_Col = require('./../models/news')
const user_Col = require('./../models/user')

/**
 * 获取文章
 * @param {String} userId 
 * @param {String} others...
 */
const getNews = async (ctx,next)=> {
    var req = ctx.request.body
    var newsList =await news_Col.find(req,{
        _id:0,
        __v:0
    })
    if(newsList) {
        ctx.status = 200
        ctx.body = {
            data:{
                code:200,
                list:newsList,
                msg:'success'
            }
        }
        return
    }
    ctx.status = 500
    ctx.body = {
        data: {
            code: 500,
            msg:'server error'
        }
    }
}

/**
 * 新增
 * @param {String} userId
 * @param {String} title
 * @param {String} author
 * @param {String} creatTime
 * 生成的newsId根据当前数据库中最大的newsId+1
 */ 
const addOneNews = async (ctx,next)=> {
    var {userId,title,author,creatTime,tags='defult',content="none"} = ctx.request.body
    if(title && author && creatTime && userId) {
        // 写入newId
        var newsIds = await news_Col.find({},{newsId:1,_id:0})
        var arr = []
        newsIds.map(x=> {
            arr.push(x.newsId)
        })
        var newsId = Math.max.apply(null,arr)+1
        if(arr.length == 0) {
            newsId = 1
        }
        var newNews = await news_Col.create({
            newsId:newsId,
            title:title,
            author:author,
            creatTime:creatTime,
            tags:tags,
            userId:userId,
            content:content
        })
        if(newNews) {
            ctx.status = 200
            ctx.body = {
                data: {
                    code: 200,
                    msg: 'add news success!'
                }
            }
        }else {
            ctx.status = 500
            ctx.body = {
                data: {
                    code: 500,
                    msg: "server error..."
                }
            }
        }
        return
    }

    ctx.status = 401
    ctx.body = {
        data:{
            msg:'缺少必填项',
            code:401
        }
    }
}

/**
 * 批量删除
 * @param {String} ids 逗号隔开 例如: ids:'1,2,3'
 */
const delNewsByIds = async (ctx,next)=> {
    var req = ctx.request.body
    if(req.ids.split(',').length<1) {
        ctx.status = 401
        ctx.body = {
            data : {
                code : 401,
                msg: '没有选择要删除的'
            }
        }
        return;
    }
    ctx.status = 200
    var removeCB = await news_Col.remove({newsId:{$in:req.ids.split(',')}})
    if(removeCB) {
        ctx.body = {
            data: {
                code: 200,
                msg:'success'
            }
        }
        return
    }
    ctx.status = 500
    ctx.body = {
        data: {
            code: 500,
            msg: 'server error'
        }
    }
}

/**
 * 获取用户收藏的文章
 * @param {String} userId
 */
const getCollectionsByUserId = async (ctx,next)=> {
    var req = ctx.request.body
    var { userId } = req
    if(!userId) {
        ctx.status = 401
        ctx.body = {
            data: {
                code: 401,
                msg: '查询缺少必要参数userId'
            }
        }
        return
    }
    ctx.status = 200
    var cols = await user_Col.findOne({
        userId:userId
    },{
        collections:1
    })
    if(cols) {
        var colArr = cols.collections
        /**
         *  @param { array } newsId
         */
        var news = await news_Col.find({
            "newsId":{"$in":colArr}
        },{
            _id:0,
            __v:0
        })
        ctx.body = {
            data:{
                code:200,
                list:news
            }
        }
        return;
    }
    ctx.body = {
        data:{
            code:200,
            list:[]
        }
    }
}

/**
 *  收藏/取消收藏文章
 *  @param { String } userId
 *  @param { String } newsId
 */
const collectNews = async (ctx,next)=> {
    var { userId,newsId } = ctx.request.body

    if(!userId || !newsId) {
        ctx.status  = 401 
        ctx.body = {
            data: {
                code: 401,
                msg: '缺少查询参数'
            }
        }
        return
    }
    try{
        var queryNews = await news_Col.find({ newsId:newsId },{ newsId:1 }).catch(err=> {ctx.throw(401,'newsId类型错误') })
        if(queryNews.length<1 ) {
            ctx.status = 401
            ctx.body = {
                data: {
                    code: 401,
                    msg: '没有该条数据,请刷新再试'
                }
            }
            return
        }

        var hasNewsInUserCol = await user_Col.findOne({
            userId:userId
        },{})
        /**
         *  判断没有收藏
         */
        if(hasNewsInUserCol.collections.indexOf(newsId)<0) { // no
            
            ctx.status = 200
            await user_Col.update({
                userId:userId
            },{
                $push:{
                    collections:newsId
                }
            },{
                _id:0,
                __v:0
            })

            var user_collections = await user_Col.findOne({userId:userId},{collections:1})
            var user_col_news = await news_Col.find({
                newsId: {$in:user_collections.collections}
            },{
                _id:0,
                __v:0
            })
            ctx.body = {
                data: {
                    code: 200,
                    list: user_col_news,
                    msg:'收藏成功'
                }
            }

        }else { // yes
            ctx.status = 200
            var user_col_list = []
            await user_Col.update({
                userId:userId
            },{
                $pull:{
                    collections:newsId
                }
            })
            await user_Col.findOne({
                userId:userId
            },{
                collections:1,
            }).then(item=> { user_col_list = item.collections})
            var newsList = await news_Col.find({
                newsId:{$in:user_col_list}
            },{
                _id:0,
                __v:0
            })
            ctx.body = {
                data: {
                    code:200,
                    list:newsList,
                    msg:'取消收藏成功'
                }
            }
        }
    } catch(err) {
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
 * (批量)取消收藏
 * @param { String } userId
 * @param { String } newsId 逗号隔开
 */
const cancelCollections = async (ctx,next)=> {
    var { newsId,userId } = ctx.request.body
    newsId = newsId.split(',')
    if(newsId.length<1 || !userId) {
        ctx.status = 401
        ctx.body = {
            data: {
                code: 401,
                msg: '缺少查询参数'
            }
        }
        return
    }
    try {
        ctx.status = 200
        var my_cons = await user_Col.findOne({
            userId:userId
        },{
            collections:1
        }) 
        
        await user_Col.update({
            userId: userId
        },{
            $pull:{ collections:{$in:newsId}}
        },{ multi: true })
        
        var user = await user_Col.findOne({
            userId: userId
        })
        var newsList = await news_Col.find({
            newsId:{$in:user.collections}
        },{
            __v:0,
            _id:0
        })
        ctx.body = {
            data: {
                code: 200,
                list:newsList
            }
        }
    } catch(err) {
        ctx.status = 500
        ctx.body = {
            data: {
                code: 500,
                msg:'srver error'+err
            }
        }
    }

}


module.exports = {
    getNews,
    addOneNews,
    delNewsByIds,
    getCollectionsByUserId,
    collectNews,
    cancelCollections
}