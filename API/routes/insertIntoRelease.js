// 插入发布文章

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
  // !接收参数
  // ​	title:文章标题
  // ​	content：文章内容
  // ​	cate_id:文章分类ID
  // ​	token:用户的唯一标识
  var data = req.body
  // return res.json(data)
  //!验证参数
  // ​	title:文章标题
  if (data.title == '') {
    return res.json({ code: 100, msg: '请输入标题', data: null })
  }
  // ​	content：文章内容
  if (data.content == '') {
    return res.json({ code: 100, msg: '请输入文章内容', data: null })
  }
  // ​	cate_id:文章分类ID
  if (data.cate_id == '') {
    return res.json({ code: 100, msg: '请选择分类', data: null })
  }
  // ​	token:用户的唯一标识
  if (data.token == '') {
    return res.json({ code: 100, msg: '当前号位登录,请登录', data: null })
  }
  //!获取user_id:用户ID>>不能通过参数获取
  // 通过token：用户的唯一标识来获取user_id
  var selectUser_id = 'select * from user where token = ?'
  var selectUser_idData = await sqlQuery(selectUser_id, [data.token])
  if (selectUser_idData.status == false) {
    return res.json({ code: 100, msg: '系统错误', data: selectUser_idData })
  }
  // return res.json(selectUser_idData)
  var user_id = selectUser_idData.data[0].id
  // return res.json({ id: user_id })
  // !create_time:创建时间>>不能通过参数获取update_time:修改时间>>不能通过参数获取
  // 获取当前时间并进行时区转换（假设目标时区为UTC+8）
  const currentTime = moment().utcOffset('+08:00')

  // 格式化时间为MySQL的日期时间字符串（YYYY-MM-DD HH:MM:SS）
  const formattedTime = currentTime.format('YYYY-MM-DD HH:mm:ss')
  // !向数据库插入数据
  var insertIntoArticle =
    'insert into article(title,content,cate_id,user_id,create_time,update_time) values(?,?,?,?,?,?)'
  var insertIntoData = await sqlQuery(insertIntoArticle, [
    data.title,
    data.content,
    data.cate_id,
    user_id,
    formattedTime,
    formattedTime,
  ])
  if (insertIntoData.status == false) {
    return res.json({ code: 100, msg: '系统错误', data: insertIntoData })
  }
  if (insertIntoData.data.affectedRows == 1) {
    return res.json({ code: 200, msg: '发布成功', data: null })
  } else {
    return res.json({ code: 100, msg: '发布失败 请重试', data: null })
  }
})

module.exports = router
