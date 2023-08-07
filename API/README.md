# API接口逻辑

1. 接收参数
2. 验证数据
3. 执行需要的sql语句

## 注册逻辑

接收参数

nickname：昵称

phone：手机号

password：密码

password2：确认密码

验证参数

​	验证昵称不为空

​	验证手机号是否为空和格式是否正确

​	验证密码是否为空

md5密码加密（password）

生成token用户的唯一标识（昵称：nickname+密码：password=>加密后的密码）

验证手机号是否已经注册

​	查询数据库内的数据如果返回数据>0标识手机号已被注册反之没被注册

向user表中插入nickname、phone、password、token

​	如果返回的*affectedRows*==1标识注册成功反之失败

## 登录逻辑

接收参数

phone：手机号

password：密码

验证参数

​	验证手机号是否为空和格式是否正确

​	验证密码是否为空

根据手机号进行查询

​	返回的data结果长度 == 0 改手机号未进行注册，提示请注册，反之成功

取查询到的第一条数据

加密输入的密码password

加密**拿到的昵称**和**输入的密码**验证token是否相同

​	如果相同提示登录成功

​	反之提示 账号和密码错误 请重新输入

## 文章发布逻辑

需要内容

​	title:文章标题

​	content:文章内容

​	**user_id:用户ID>>不能通过参数获取**

​	cate_id:文章分类ID

​	**create_time:创建时间>>不能通过参数获取**

​	**update_time:修改时间>>不能通过参数获取**

接收参数

​	title:文章标题

​	content：文章内容

​	cate_id:文章分类ID

​	token:用户的唯一标识

验证参数

​	标题不为空

​	内容不为空

​	分类id不为空

​	token值不为空，否则提醒用户登录

逻辑

根据用户token来获取user_id用户ID

引入时间模块*const* *moment* *=* *require**(*'moment'*)*添加创建和修改时间

向数据库插入数据

## 我的X文章请求逻辑

接收参数

​	name :当前网页再index.js中的路由配置的name

​	token：用户的唯一标识

验证参数

​	token值不为空，否则提醒用户登录

​	name值不为空，否则提醒用户当前页面不存在

### 我的喜欢/踩文章逻辑

接收参数、验证参数**同上**

逻辑

​	涉及到的数据表

用户表user、字段：id、nickname、token

文章表article、字段：id、title、content、user_id、cate_id、see_num、status

点赞表zan、字段：id 、用户id：user_id、文章id：article_id

根据参数token来获取用户id

根用户id到zan表中获得文章id

根据文章id获取全部的文章表信息和用户id、昵称：nickname、点赞数：like_num

### 我的发布

接收参数、验证参数**同上**

逻辑

​	涉及到的数据表

​	用户表user、字段：id、nickname、token

​	文章表article、字段：id、title、content、user_id、cate_id、see_num、status

​	点赞表zan、字段：id 、用户id：user_id、文章id：article_id

​	根据参数token来获取用户id

​	根据用户id获取文章id

​	根据文章id获取全部的文章表信息和用户id、昵称：nickname、点赞数：like_num

## 个人主页的逻辑

接收参数

​	token：用户的唯一标识

验证参数

​	token值不为空，否则提醒用户登录



## 发布评论

接收参数

​	token:用户的唯一标识

​	content:评论的内容

​	article_id:文章id

验证参数

​	

​	token值不为空，否则提醒用户登录

​	content值不为空，反之提醒用户请输入评论内容

逻辑

用到的表

用户表user； 字段名：id,token

评论表：comment；字段名id
user_id
article_id
content
create_time
status
update_time

根据token获取用户id

将用户id 文章id 评论内容插入到评论表中
