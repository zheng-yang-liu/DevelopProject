// !热门文章

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
  //!根据文章里浏览量排序列表
  // 查询数据
  var selectHotReviewList =
    'SELECT a.*, u.nickname, u.avatar, COUNT(z.user_id) AS like_num FROM article a LEFT JOIN user u ON a.user_id = u.id LEFT JOIN zan z ON a.id = z.article_id GROUP BY a.id ORDER BY a.see_num DESC'

  var selectHotReviewListData = await sqlQuery(selectHotReviewList)
  // return res.json({selectHotReviewListData })
  if (selectHotReviewListData.status == false) {
    return res.json({
      code: 100,
      msg: '系统错误',
      data: selectHotReviewListData,
    })
  }
  // return res.json(selectHotReviewListData)
  if (selectHotReviewListData.data.length > 0) {
    return res.json({
      code: 200,
      msg: '请求成功',
      data: selectHotReviewListData.data,
    })
  } else {
    return res.json({ code: 100, msg: '请求失败', data: null })
  }
})

module.exports = router
