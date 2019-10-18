var router = require('koa-router')()
var discuss_controller = require('./../../controllers/discuss_controller')
var verify = require('./../../middleware/verify')

router.post('/addDiscuss',verify,discuss_controller.addDiscuss)
router.post('/getDiscussByNewsId',verify,discuss_controller.getDiscussByNewsId)
router.post('/delateDiscussById',verify,discuss_controller.delateDiscussById)

module.exports = router