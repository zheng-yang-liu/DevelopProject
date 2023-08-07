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
  // 接收参数需要一个文章contentID
  // contentID
  var data = req.body
  // 查询数据
  var selectLink =
    'select a.*,u.avatar,u.nickname from article a,user u where a.user_id = u.id and a.id = ?'

  var selectLinkData = await sqlQuery(selectLink, [data.contentID])
  // return res.json({selectLinkData })
  if (selectLinkData.status == false) {
    return res.json({ code: 100, msg: '系统错误', data: selectLinkData })
  }
  // return res.json(selectLinkData)
  if (selectLinkData.data.length > 0) {
    return res.json({ code: 200, msg: '请求成功', data: selectLinkData.data })
  } else {
    return res.json({ code: 100, msg: '请求失败', data: null })
  }
})

module.exports = router
