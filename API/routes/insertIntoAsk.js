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
  var data = req.body
  //   return res.json({data:data.token})

  if (data.token == '') {
    return res.json({ code: 100, msg: '还未登录 请登录', data: null })
  }
  // 查询是否有此用户
  var selectToken = 'select * from user where token = ?'
  var selectTokenData = await sqlQuery(selectToken, [data.token])
  if (selectTokenData.status == false) {
    return res.json({ code: 100, msg: '系统错误', data: selectTokenData })
  }
  if (selectTokenData.data.length > 0) {
    // !获取当前时间
    // 获取当前时间并进行时区转换（假设目标时区为UTC+8）
    const currentTime = moment().utcOffset('+08:00')

    // 格式化时间为MySQL的日期时间字符串（YYYY-MM-DD HH:MM:SS）
    const formattedTime = currentTime.format('YYYY-MM-DD HH:mm:ss')
    var insertIntoAsk =
      'INSERT INTO comment (user_id, article_id, content,create_time) VALUES ((SELECT id FROM user WHERE token = ?), ?, ?,?);'
    var insertIntoAskData = await sqlQuery(insertIntoAsk, [
      data.token,
      data.article_id,
      data.content,
      formattedTime,
    ])
    if (insertIntoAskData.status == false) {
      return res.json({ code: 100, msg: '系统错误', data: insertIntoAskData })
    }
    if (insertIntoAskData.data.affectedRows == 1) {
      return res.json({ code: 200, msg: '发布成功', data: null })
    } else {
      return res.json({ code: 100, msg: '发布失败', data: null })
    }
  } else {
    return res.json({ code: 100, msg: '未找到该用户 请重新操作', data: null })
  }
})

module.exports = router
