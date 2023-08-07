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
  // !接收参数Content-Type:application/x-www-form-urlencoded
  var data = req.body
  // !验证参数
  // 验证昵称
  // !使用return退出函数否则会出现错误res.json
  if (data.nickname == '') {
    return res.json({ code: 100, msg: '请输入昵称', data: null })
  }
  // 验证手机
  if (data.phone == '') {
    return res.json({ code: 100, msg: '请输入手机号', data: null })
  }
  if (/^1\d{10}$/.test(data.phone) == false) {
    return res.json({ code: 100, msg: '请输入正确的手机号', data: null })
  }
  if (data.password == '') {
    return res.json({ code: 100, msg: '请输入密码', data: null })
  }
  if (data.password2 == '') {
    return res.json({ code: 100, msg: '请输入确认密码', data: null })
  }
  if (data.password != data.password2) {
    return res.json({
      code: 100,
      msg: '两次输入的密码不同 请重新输入',
      data: null,
    })
  }

  // 密码加密
  var password = md5(data.password)

  // 加密token 用户的唯一标识(nickname+password)
  var token = md5(data.nickname + password)
  // !查询和修改数据
  // 验证手机号是否已经注册
  var selectSql = 'select * from user where phone = ?'
  var selectPhone = await sqlQuery(selectSql, [data.phone])
  // return res.json({selectPhone })
  if (selectPhone.status == false) {
    return res.json({ code: 100, msg: '系统错误', data: selectPhone })
  }
  // res.json(selectPhone);
  if (selectPhone.data.length > 0) {
    return res.json({ code: 100, msg: '该手机号已经之注册 请重试', data: null })
  } else {
    // !获取当前时间
    // 获取当前时间并进行时区转换（假设目标时区为UTC+8）
    const currentTime = moment().utcOffset('+08:00')

    // 格式化时间为MySQL的日期时间字符串（YYYY-MM-DD HH:MM:SS）
    const formattedTime = currentTime.format('YYYY-MM-DD HH:mm:ss')

    var insertIntoSql =
      'insert into user(nickname,phone,password,token,create_time,update_time) values(?,?,?,?,?,?)'
    var insertIntoData = await sqlQuery(insertIntoSql, [
      data.nickname,
      data.phone,
      password,
      token,
      formattedTime,
      formattedTime,
    ])
    // return res.json({insertIntoData })
    if (insertIntoData.status == false) {
      return res.json({ code: 100, msg: '系统错误', data: insertIntoData })
    }
    if (insertIntoData.data.affectedRows == 1) {
      return res.json({ code: 200, msg: '注册成功 请登录', data: null })
    } else {
      return res.json({ code: 100, msg: '注册失败 请重试', data: null })
    }
  }
})

module.exports = router
