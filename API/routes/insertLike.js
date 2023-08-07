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
  var data = req.body
  // return res.json({ data })

  var insertIntoLike = `insert into ${data.moduleName}(user_id,article_id) values((select id from user where token = ?),?)`
  // return res.json({ code: insertIntoLike })
  var insertIntoLikeData = await sqlQuery(insertIntoLike, [
    data.token,
    data.article_id,
  ])
  if (insertIntoLikeData.status == false) {
    return res.json({ code: 100, msg: '系统错误', data: insertIntoLikeData })
  }
  if (insertIntoLikeData.data.affectedRows == 1) {
    if (data.moduleName == 'zan') {
      return res.json({ code: 200, msg: '点赞成功' })
    }
    if (data.moduleName == 'cai') {
      return res.json({ code: 200, msg: '踩成功' })
    }
  } else {
    if (data.moduleName == 'zan') {
      return res.json({ code: 100, msg: '点赞失败' })
    }
    if (data.moduleName == 'cai') {
      return res.json({ code: 100, msg: '踩失败' })
    }
  }
})

router.post('/unlike', async function (req, res, next) {
  var data = req.body
  // return res.json(data)
  var insertIntoLike = `DELETE FROM ${data.moduleName} where user_id = (select id from user where token = ?) AND article_id = ?`
  var insertIntoLikeData = await sqlQuery(insertIntoLike, [
    data.token,
    data.article_id,
  ])
  if (insertIntoLikeData.status == false) {
    return res.json({ code: 100, msg: '系统错误', data: insertIntoLikeData })
  }
  if (insertIntoLikeData.data.affectedRows > 0) {
    if (data.moduleName == 'zan') {
      return res.json({ code: 200, msg: '取消点赞成功' })
    }
    if (data.moduleName == 'cai') {
      return res.json({ code: 200, msg: '取消踩成功' })
    }
  } else {
    if (data.moduleName == 'zan') {
      return res.json({ code: 100, msg: '取消点赞失败' })
    }
    if (data.moduleName == 'cai') {
      return res.json({ code: 100, msg: '取消踩失败' })
    }
  }
})

// 查新点赞信息，该表点赞颜色

router.post('/likeTheInformation', async function (req, res, next) {
  var data = req.body
  // return res.json(data)
  var insertIntoLike = `select * from ${data.moduleName} where user_id = (select id from user where token = ?) AND article_id = ?`
  var insertIntoLikeData = await sqlQuery(insertIntoLike, [
    data.token,
    data.article_id,
  ])
  if (insertIntoLikeData.status == false) {
    return res.json({ code: 100, msg: '系统错误', data: insertIntoLikeData })
  }
  if (insertIntoLikeData.data.length > 0) {
     if (data.moduleName == 'zan') {
      return res.json({ code: 200, msg: '该用户已经点赞', likeTheColor: true })
     }
     if (data.moduleName == 'cai') {
       return res.json({ code: 200, msg: '该用户已经踩', nolikeTheColor: true })
     }
    
  } else {
     if (data.moduleName == 'zan') {
       return res.json({
         code: 100,
         msg: '该用户没有点赞',
         likeTheColor: false,
       })
     }
     if (data.moduleName == 'cai') {
      return res.json({ code: 100, msg: '该用户没有踩', nolikeTheColor: false })
     }
    
  }
})

module.exports = router
