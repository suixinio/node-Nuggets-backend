var Router = require('koa-router')
var router = new Router()
var user_controller = require('./../../controllers/user_controller')

router.post('/login',user_controller.login)
router.post('/regist',user_controller.regist)
router.get('/getCode',user_controller.getSvgCode)

module.exports = router