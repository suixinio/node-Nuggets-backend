var Router = require('koa-router')
var router = new Router()
var news_controller = require('./../../controllers/news_controller')
var verify = require('./../../middleware/verify')

router.post('/getAllNews',verify,news_controller.getNews)
router.post('/addOneNews',verify,news_controller.addOneNews)
router.post('/delNewsByIds',verify,news_controller.delNewsByIds)
router.post('/getCollections',verify,news_controller.getCollectionsByUserId)
router.post('/newsCollect',verify,news_controller.collectNews)
router.post('/cancelCollections',verify,news_controller.cancelCollections)

module.exports = router