// !我的X文章
var express = require('express')
var router = express.Router()
var md5 = require('md5-node')
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
  var data = req.body
  // ​	name :当前网页再index.js中的路由配置的name
  // ​	token：用户的唯一标识

  // !验证参数
  // ​	token值不为空，否则提醒用户登录
  // ​	name值不为空，否则提醒用户当前页面不存在
  if (data.name == '') {
    return res.json({ code: 100, msg: '当前页面不存在', data: null })
  }
  if (data.token == '') {
    return res.json({ code: 100, msg: '当前未登录,请先登录', data: null })
  }
  var token = data.token
  // !数据请求
  // ?根据网页名字请求响应的数据
  // 我的喜欢
  if (data.name == 'mylike') {
    // 根据点赞数量来排序
    var selectLike =
      'SELECT article.*,user.nickname AS nickname, COUNT(zan.id)AS like_num FROM article INNER JOIN user ON article.user_id = user.id LEFT JOIN zan ON article.id = zan.article_id WHERE article.id IN (SELECT article_id FROM zan WHERE user_id = ( SELECT id FROM user WHERE token = ?)) GROUP BY article.id ORDER BY like_num DESC'
    var selectLikeData = await sqlQuery(selectLike, [token])
    if (selectLikeData.status == false) {
      return res.json({ code: 100, msg: '系统错误', data: selectLikeData })
    }
    if (selectLikeData.data.length > 0) {
      return res.json({ code: 200, msg: '请求成功', data: selectLikeData.data })
    } else {
      return res.json({ code: 100, msg: '请求失败', data: selectLikeData.data })
    }
  }
  // 我的踩不喜欢
  if (data.name == 'mynolike') {
    // 根据点赞数量来排序
    var selectLike =
      'SELECT article.*,user.nickname AS nickname, COUNT(cai.id)AS like_num FROM article INNER JOIN user ON article.user_id = user.id LEFT JOIN cai ON article.id = cai.article_id WHERE article.id IN (SELECT article_id FROM cai WHERE user_id = ( SELECT id FROM user WHERE token = ?)) GROUP BY article.id ORDER BY like_num DESC'
    var selectLikeData = await sqlQuery(selectLike, [token])
    if (selectLikeData.status == false) {
      return res.json({ code: 100, msg: '系统错误', data: selectLikeData })
    }
    if (selectLikeData.data.length > 0) {
      return res.json({ code: 200, msg: '请求成功', data: selectLikeData.data })
    } else {
      return res.json({ code: 100, msg: '数据为空', data: selectLikeData.data })
    }
  }
  // 我的发布
  if (data.name == 'mycontent') {
    // 根据点赞数量来排序
    var selectLike =
      'SELECT article.*, user.nickname, COUNT(zan.id) AS like_num FROM article INNER JOIN user ON article.user_id = user.id LEFT JOIN zan ON article.id = zan.article_id WHERE user.token = ? GROUP BY article.id, article.title, article.content, article.user_id, user.nickname ORDER BY article.create_time DESC;'

    var selectLikeData = await sqlQuery(selectLike, [token])
    if (selectLikeData.status == false) {
      return res.json({ code: 100, msg: '系统错误', data: selectLikeData })
    }
    if (selectLikeData.data.length > 0) {
      return res.json({ code: 200, msg: '请求成功', data: selectLikeData.data })
    } else {
      return res.json({ code: 100, msg: '数据为空', data: selectLikeData.data })
    }
  } // 我的评论
  if (data.name == 'myask') {
    // 根据点赞数量来排序
    var selectLike =
      'SELECT comment.content, article.id, article.title, article.see_num, article.create_time, COUNT(zan.id) AS like_num FROM user JOIN comment ON user.id = comment.user_id JOIN article ON article.id = comment.article_id LEFT JOIN zan ON zan.article_id = comment.article_id WHERE user.token = ? GROUP BY user.nickname, comment.content, article.id;'
    var selectLikeData = await sqlQuery(selectLike, [token])
    if (selectLikeData.status == false) {
      return res.json({ code: 100, msg: '系统错误', data: selectLikeData })
    }
    if (selectLikeData.data.length > 0) {
      return res.json({ code: 200, msg: '请求成功', data: selectLikeData.data })
    } else {
      return res.json({ code: 100, msg: '数据为空', data: selectLikeData.data })
    }
  } else {
    return res.json({ code: 100, msg: '当前页面不存在', data: null })
  }
})

module.exports = router
