// 上传文件
var express = require('express')
var router = express.Router()
//引入时间模块
var moment = require('moment')
var path = require('path')
var fs = require('fs')
var formidable = require('formidable')
// 映入文件删除模块
var delFs = require('fs-extra')

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
  // 实例化
  var form = new formidable.IncomingForm()
  // 文件是否保留后缀
  //   form.keepExtensions = true
  // 设置文件上传的临时目录
  form.uploadDir = path.join(__dirname, '../', 'temp')
  // 解析客户端传递过来的formdata数据
  form.parse(req, (error, fields, files) => {
    if (error) {
      console.error('File upload error:', error);
      return res.json({ code: 100, msg: '文件上传失败', error: error });
    }
    var image = files.image
    // 现在所在的目录
    var oldpath = image.filepath

    // 获取当前时间
    const now = moment()
    const formattedDate = now.format('YYYYMMDDHHmmss')

    // 生成随机数
    const random = Math.floor(Math.random() * 1000)

    // 提取文件后缀名
    const oldFileName = image.originalFilename
    console.log(oldFileName);
    const fileExtension = oldFileName.split('.').pop()

    // 组合文件名==>>存放目录
    const newpath =
      'public/images/' + `${formattedDate}_${random}.` + fileExtension

    // 保存文件
    fs.rename(oldpath, newpath, (err) => {
      if (err) {
        return res.json({ code: 100, msg: '文件上传失败', error: err })
      }
    })
    // 清空临时文件夹
    // 删除临时文件夹下所有文件
    delFs.emptyDirSync(path.join(__dirname, '../', 'temp'))
    //返回结果
    return res.json({ code: 200, value: newpath })
  })
})

module.exports = router
