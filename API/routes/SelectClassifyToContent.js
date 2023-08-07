// !根据文章分类获取文章列表
var express = require('express')
var router = express.Router()
//引入MySQL
var sqlQuery = require('../db/mysql')

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
  //   ​cate_id:文章分类id
  var data = req.body
  // return res.json({ code: 100, data: data, msg: '请求成功' })
  // 根据cate_id来获取文章分类id
  let selectClassToContent =
    'SELECT a.*, u.nickname, u.avatar, COUNT(z.user_id) AS like_num FROM article a LEFT JOIN user u ON a.user_id = u.id LEFT JOIN zan z ON a.id = z.article_id WHERE a.cate_id = ? GROUP BY a.id'
  let selectClassToContentData = await sqlQuery(selectClassToContent, [
    data.cate_id,
  ])
  if (selectClassToContentData == false) {
    return res.json({
      code: 100,
      msg: '系统错误',
      data: selectClassToContentData,
    })
  }
  if (selectClassToContentData.data.length > 0) {
    return res.json({
      code: 200,
      msg: '文章分类已切换',
      data: selectClassToContentData.data,
    })
  } else {
    return res.json({
      code: 100,
      msg: '没有该文章分类',
      data: null,
    })
  }
})

module.exports = router
