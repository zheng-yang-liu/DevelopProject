<template>
  <div>
    <div class="bg">
      <div class="content">
        <div class="content-left">
          <img src="../img/8.jpg" class="leftimage" />
        </div>
        <div class="content-right">
          <img src="../img/logo.png" class="rightImg" />
          <div class="loginForm_box">
            <el-form
              ref="form"
              :model="form"
              :rules="rule"
              label-position="left"
              label-width="100px"
              class="LoginFrom"
            >
              <!--  -->
              <el-form-item
                label="昵称"
                prop="nickname"
                label-width="100px"
                class="form_item_box"
              >
                <el-input
                  maxlength="20"
                  placeholder="请输入昵称"
                  v-model="form.nickname"
                  class="input"
                  autofocus="true"
                >
                </el-input>
              </el-form-item>

              <el-form-item
                label="手机号码"
                prop="phone"
                label-width="100px"
                class="form_item_box"
              >
                <el-input
                  maxlength="11"
                  placeholder="请输入手机号码"
                  v-model="form.phone"
                  class="input"
                  v-number-only
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="登录密码"
                prop="password"
                minlength="6"
                label-width="100px"
                class="form_item_box"
              >
                <el-input
                  v-model="form.password"
                  placeholder="请输入登录密码"
                  show-password
                  class="input"
                ></el-input>
              </el-form-item>

              <el-form-item
                label="确认密码"
                prop="password2"
                label-width="100px"
                class="form_item_box"
              >
                <el-input
                  v-model="form.password2"
                  placeholder="请输入确认密码"
                  show-password
                  class="input"
                >
                </el-input>
              </el-form-item>
              <!-- 验证码后写 -->
              <el-form-item
                label="输入验证码"
                prop="captcha"
                label-width="100px"
                class="form_item_box"
              >
                <div class="form_item_box_captcha">
                  <el-input
                    v-model="form.captcha"
                    placeholder="请输入验证码"
                    class="input_captcha"
                  >
                  </el-input>
                  <div class="captcha_box" @click="changeCode">
                    <div>{{ captcha }}</div>
                  </div>
                </div>
              </el-form-item>
              <!-- 注册按钮 -->
              <el-form-item label="" class="form_item_box">
                <el-button
                  @click="submitform"
                  type="primary"
                  style="width: 100%"
                  class="button"
                  >注册
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
// 更换封装后的axios请求
import request from '../utils/request'
export default {
  data() {
    return {
      // 验证码
      captcha: 121212,
      value: true,
      value2: false,
      value3: false,
      form: {},
      rule: {
        //键名：键值
        // model的贱名：验证
        //必填
        password: [
          { message: '请输入密码' },
          { min: 6, message: '最少输入6个字符' },
        ],
        password2: [
          { message: '请输入密码' },
          { min: 6, message: '最少输入6个字符' },
        ],
      },
    }
  },
  methods: {
    submitform() {
      // 判断form表单提交的内容都不为空
      //   验证昵称
      if (!('nickname' in this.form)) {
        return this.$message.error('请填写昵称')
      }

      //   验证手机号
      if (!('phone' in this.form)) {
        return this.$message.error('请填写手机号')
      }
      if (/^1\d{10}$/.test(this.form.phone) == false) {
        return this.$message.error('请输入正确的手机号')
      }

      //   验证密码
      if (!('password' in this.form)) {
        return this.$message.error('请填写密码')
      }

      //   验证确认密码
      if (!('password2' in this.form)) {
        return this.$message.error('请填写确认密码')
      }
      if (this.form.password != this.form.password2) {
        this.form.password2 = ''
        return this.$message.error('两次输入的密码不同 请重新输入')
      }
      //   验证验证码
      if (!('captcha' in this.form)) {
        return this.$message.error('请填写验证码')
      }
      // 验证码不同
      if (this.form.captcha != this.captcha) {
        // 清空验证码的输入
        this.form.captcha = ''
        // 重新刷新验证码
        this.changeCode()
        // 提醒用户
        return this.$message.error('验证码不正确请重新输入')
      }
      // 进行数据请求
      console.log(this.form)
      //进行axios请求
      request
        .post(
          'http://localhost:3000/register',
          {
            nickname: this.form.nickname,
            password: this.form.password,
            password2: this.form.password2,
            phone: this.form.phone,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
        .then((res) => {
          if (res.code != 100) {
            console.log(res)

            // 跳转页面
            this.$publicJS.ToNewPath('login')
          }
          // 清空数据
          this.form = {}
        })
    },
    //更换验证码
    changeCode() {
      // 生成一个新的六位随机数，并更新验证码
      const newCode = Math.floor(Math.random() * 900000) + 100000
      this.captcha = String(newCode) // 转为字符串形式，并更新验证码
    },
  },
  mounted() {
    this.changeCode()
  },
}
</script>

<style scoped>
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}

.bg {
  width: 100%;
  height: 100vh;
  background-image: url(../img/6.jpg);
  background-position: center;
  background-size: cover;
  position: relative;
    /* 不允许复制 */
  -webkit-user-select: none; /* Safari/Chrome */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */
  user-select: none; /* 其他浏览器 */
}
.content {
  position: absolute;
  width: 900px;
  height: 420px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
}
.content-left {
  width: 450px;
  height: 500px;
  background-size: cover; /* 将图片缩放以填充整个背景区域 */
  background-position: center; /* 将背景图像定位于元素中心 */
}
.content-right {
  background-color: #ffffff;
  width: 450px;
  height: 500px;
  border-radius: 0px 20px 20px 0px;
}
.rightImg {
  margin: 0px;
  /* background-color: red; */
  flex-direction: column;
  width: 150px;
  height: 80px;
  margin-top: 8%;
  margin-left: 31%;
  margin-bottom: 10%;
}
/* 右边表单的布局样式 */
.loginForm_box {
  margin-top: -40px;
  /* background-color: green; */
  display: flex;
  align-items: center;
  justify-content: center;
}
.LoginFrom {
  width: 300px;
  height: 200px;
  display: flex;
  /* 垂直排布 */
  flex-direction: column;
  /* background-color: red; */
}
/* 左边图片的样式 */
.leftimage {
  width: 450px;
  height: 500px;
  border-radius: 20px 0 0 20px;
}
/* .input {
  margin-top: 20px;
} */
.form_item_box {
  /* background-color: blue; */
  margin-bottom: 20px;
}
.button {
  height: 35px;
}
/* 验证码 */
.form_item_box_captcha {
  display: flex;
  /* background-color: red; */
    /* 不允许复制 */
  -webkit-user-select: none; /* Safari/Chrome */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */
  user-select: none; /* 其他浏览器 */
}
.input_captcha {
  margin-right: 5px;
}
.captcha_box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  font-size: 17px;
  font-weight: bold;
  color: black;
  background-color: #dcd7d7;
  border-radius: 5px;
  /* 鼠标悬浮变成手 */
  cursor: pointer;
}
</style>
