# 项目准备

# 准备数据库

    数据库名:vuedata
    运行:sql文件夹下的.sql文件
    更改API/db/mysql.js中的数据库配置参数或使用自定义配置文件参数(如果可以的话)。
    配置数据库
    // 链接数据库
    var connection = mysql.createConnection({
    host: 'localhost',
    user: '数据可账号',
    password: '数据库密码',
    database: 'vuedata',
    })

# 项目运行

    在 API 文件夹运行 npm run start
    在项目根目录运行 npm run serve

# node 版本

    node:18.14.2
    npm:9.5.0

# 项目地址

    https://gitee.com/dear-yan/vue-develop.git
