// 插入发布文章
// !评论
var express = require('express')
var router = express.Router()
var md5 = require('md5-node')
//引入MySQL
var sqlQuery = require('../db/mysql')
//引入时间模块
const moment = require('moment')

//设置跨域请求
router.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
  )
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})
/* GET users listing. */
router.post('/', async function (req, res, next) {
  // !接收参数
  // 文章ID:article_id
  var data = req.body
  var selectAsk =
    'SELECT `user`.id, `user`.nickname, `user`.avatar, `comment`.content, `comment`.create_time FROM `user`, `comment` WHERE `comment`.article_id = ? AND `user`.id = `comment`.user_id ORDER BY `comment`.create_time DESC;'
  var selectAskData = await sqlQuery(selectAsk, [data.article_id])
  if (selectAskData.status == false) {
    return res.json({ code: 100, msg: '系统错误', data: selectAskData })
  }
  if (selectAskData.data.length > 0) {
    return res.json({
      code: 200,
      msg: '评论请求成功',
      data: selectAskData.data,
    })
  } else {
    return res.json({
      code: 100,
      msg: '评论请求失败',
      data: null,
    })
  }
})

module.exports = router
