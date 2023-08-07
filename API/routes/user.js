// 上传文件
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
  //!接收参数
  var data = req.body
  // return res.json(data)
  //!验证参数
  if (data.token == '') {
    return res.json({ code: 100, msg: '当前未登录请登录', data: null })
  }
  // !根据token获取用户信息
  if (data.requestName == 'home') {
    var selectUser = 'select * from user where token = ?'
    var selectUserData = await sqlQuery(selectUser, [data.token])
    if (selectUserData.status == false) {
      return res.json({ code: 100, msg: '系统错误', data: selectUserData })
    }
    if (selectUserData.data.length > 0) {
      return res.json({ code: 200, msg: '请求成功', data: selectUserData.data })
    } else {
      return res.json({ code: 100, msg: '没有该用户', data: null })
    }
  }
  if (data.requestName == 'mycenter') {
    // 验证用户是否在点赞和cai表中是否有数据
    let selectZan =
      'select * from zan where user_id =(select id from user where token = ?)'
    let selectZanData = await sqlQuery(selectZan, [data.token])
    if (selectZanData.status == false) {
      return res.json({ code: 100, msg: '系统错误', data: selectZanData })
    }
    if (selectZanData.data.length > 0) {
      // *有数据
      var selectUser =
        'SELECT user.*, COUNT(zan.id) AS like_num FROM user JOIN article ON user.id = article.user_id LEFT JOIN zan ON article.id = zan.article_id WHERE user.token = ? GROUP BY user.id;'
      var selectUserData = await sqlQuery(selectUser, [data.token])
      if (selectUserData.status == false) {
        return res.json({ code: 100, msg: '系统错误', data: selectUserData })
      }
      if (selectUserData.data.length > 0) {
        return res.json({
          code: 200,
          msg: '请求成功',
          data: selectUserData.data,
        })
      } else {
        return res.json({ code: 100, msg: '没有该用户', data: null })
      }
    } else {
      // *没有数据
       let selectUser = 'select * from user where token = ?'
       let selectUserData = await sqlQuery(selectUser, [data.token])
       if (selectUserData.status == false) {
         return res.json({ code: 100, msg: '系统错误', data: selectUserData })
       }
       if (selectUserData.data.length > 0) {
         return res.json({
           code: 200,
           msg: '没有点赞信息',
           data: selectUserData.data,
         })
       } else {
         return res.json({ code: 100, msg: '没有该用户', data: null })
       }
    }
  }
})

router.post('/upDateUser', async function (req, res, next) {
  //!接收参数
  // modifyTheProjectName:修改项的名字
  // token:用户的唯一标识
  // afterModification:修改后
  var data = req.body
  //!验证参数
  if (data.modifyTheProjectName == '') {
    return res.json({ code: 200, msg: '未进行任何修改', data: null })
  }
  // !修改内容
  // 修改昵称
  if (data.modifyTheProjectName == 'nickname') {
    // 使用 .then() 和 .catch()
    modifyTheAction(
      data.token,
      data.afterModification,
      data.modifyTheProjectName
    )
      .then(function (result) {
        res.json(result)
      })
      .catch(function (error) {
        console.error('发生错误:', error)
        // 在这里可以进行错误处理，如返回特定的错误响应
        res.json({ code: 500, msg: '服务器错误' })
      })
  }
  // 修改密码
  if (data.modifyTheProjectName == 'password') {
    // 使用 .then() 和 .catch()
    modifyTheAction(
      data.token,
      data.afterModification,
      data.modifyTheProjectName
    )
      .then(function (result) {
        res.json(result)
      })
      .catch(function (error) {
        console.error('发生错误:', error)
        // 在这里可以进行错误处理，如返回特定的错误响应
        res.json({ code: 500, msg: '服务器错误' })
      })
  }
  // 修改手机号
  if (data.modifyTheProjectName == 'phone') {
    // 使用 .then() 和 .catch()
    modifyTheAction(
      data.token,
      data.afterModification,
      data.modifyTheProjectName
    )
      .then(function (result) {
        res.json(result)
      })
      .catch(function (error) {
        console.error('发生错误:', error)
        // 在这里可以进行错误处理，如返回特定的错误响应
        res.json({ code: 500, msg: '服务器错误' })
      })
  }

  // 修改头像
  if (data.modifyTheProjectName == 'avatar') {
    // 使用 .then() 和 .catch()
    modifyTheAction(
      data.token,
      data.afterModification,
      data.modifyTheProjectName
    )
      .then(function (result) {
        res.json(result)
      })
      .catch(function (error) {
        console.error('发生错误:', error)
        // 在这里可以进行错误处理，如返回特定的错误响应
        res.json({ code: 500, msg: '服务器错误' })
      })
  }
})

// 修改操作
//参数 token用户的唯一标识、afterModification：修改后的值、modifyTheProjectName：修改的字段名
async function modifyTheAction(token, afterModification, modifyTheProjectName) {
  // ?验证token是否存在
  if (modifyTheProjectName == 'password') {
    afterModification = md5(afterModification)
  }
  if (modifyTheProjectName == 'phone') {
    // 验证手机
    if (afterModification == '') {
      return { code: 100, msg: '请输入手机号', data: null }
    }
    if (/^1\d{10}$/.test(afterModification) == false) {
      return { code: 100, msg: '请输入正确的手机号', data: null }
    }
  }
  let selectTokenIN = 'select * from user where token = ?'
  let selectTokenInData = await sqlQuery(selectTokenIN, [token])

  if (selectTokenInData.status == false) {
    return res.json({ code: 100, msg: '系统错误', data: selectTokenInData })
  }
  if (selectTokenInData.data.length > 0) {
    // 执行剩余操作
    let updateSqlData = `update user set ${modifyTheProjectName}= ? where token = ?`

    // return { code: updateSqlData }
    let updateSqlDataData = await sqlQuery(updateSqlData, [
      afterModification,
      token,
    ])
    if (updateSqlDataData.status == false) {
      return {
        code: 100,
        msg: '系统错误',
        data: updateSqlDataData,
      }
    }
    //   return { code: updateSqlDataData.data.affectedRows }
    if (updateSqlDataData.data.affectedRows == 1) {
      return { code: 200, msg: '修改成功', data: null }
    } else {
      return { code: 100, msg: '修改失败', data: null }
    }
  } else {
    return {
      code: 100,
      msg: '没有查询到该用户的信息 请重新操作',
      data: null,
    }
  }
}

// 返回修改后的token值

router.post('/upDateUser/token', async function (req, res, next) {
  var TokenData = req.body
  // return res.json({ TokenData })
  var selectToken = 'select * from user where token = ?'
  var selectTokenData = await sqlQuery(selectToken, [TokenData.token])
  if (selectTokenData.status == false) {
    return res.json({
      code: 100,
      msg: '系统错误',
      data: selectTokenData,
    })
  }
  if (selectTokenData.data.length > 0) {
    //   return res.json(selectTokenData.data)
    let nickname = selectTokenData.data[0].nickname
    // return res.json({ code: nickname })

    let password = selectTokenData.data[0].password
    // return res.json({ password: password })

    let token = md5(nickname + password)
    //     return res.json({code:token})
    //   // 修改token
    let updateToken = 'update user set token = ? where token =?'
    let updateTokenData = await sqlQuery(updateToken, [token, TokenData.token])
    if (updateTokenData.status == false) {
      return res.json({
        code: 100,
        msg: '系统错误',
        data: updateTokenData,
      })
    }
    return res.json({ code: 200, msg: 'Token修改成功', token: token })
  } else {
    return res.json({
      code: 100,
      msg: '没有查询到该用户的信息 请重新操作',
      data: null,
    })
  }
})

module.exports = router
