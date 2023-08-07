<template>
  <div>
    <div class="bg">
      <div class="content">
        <div class="content-left">
          <img src="../img/8.jpg" class="leftimage" />
        </div>
        <div class="content-right">
          <img src="../img/logo.png" class="rightImg" />
          <div class="loginForm">
            <el-form
              ref="form"
              :model="form"
              :rules="rule"
              label-position="left"
              label-width="100px"
              class="LoginFrom"
            >
              <el-form-item label="" prop="phone">
                <el-input
                  v-model="form.phone"
                  prefix-icon="el-icon-s-custom"
                  placeholder="请输入手机号"
                ></el-input>
              </el-form-item>
              <el-form-item label="" prop="password">
                <el-input
                  v-model="form.password"
                  prefix-icon="el-icon-unlock"
                  placeholder="请输入密码"
                  type="password"
                  :show-password="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-button
                  @click="submitform"
                  type="primary"
                  style="width: 100%"
                  >登录</el-button
                >
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
      name: '',
      password: '',
      form: {},
      rule: {
        //建名，键值
        //model 的建名；验证规则，是数据
        phone: [
          { required: true, message: '请输入用户名' },
          { min: 3, message: '最少输入3个字符' },
        ],
        password: [{ required: true, message: '请输入密码' }],
      },
    }
  },
  methods: {
    submitform() {
      this.$refs.form.validate((res) => {
        if (res == true) {
          request
            .post(
              'http://localhost:3000/login',
              {
                phone: this.form.phone,
                password: this.form.password,
              },
              {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              }
            )
            .then((res) => {
              console.log(res)
              // 存储本地token
              if (res.code != 100) {
                // 储存本地token
                localStorage.setItem('token', res.data.token)
                this.$publicJS.ToNewPath('home')
              }
              // 清空数据
              this.form = {}
            })
        } else {
          this.$message.error('登录失败 请填写账号密码')
        }
      })
      console.log(this.from)
    },
  },
}
</script>

<style scoped>
.bg {
  width: 100%;
  height: 100vh;
  background-image: url(../img/6.jpg);
  background-position: center;
  background-size: cover;
  position: relative;
}
.bgImg {
  background-color: rgba(0, 0, 0, 0.5);
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
  width: 500px;
  height: 420px;
}
.content-right {
  background-color: #fff;
  width: 400px;
  height: 420px;
  border-radius: 0px 5px 5px 0px;
}
.rightImg {
  flex-direction: column;
  width: 150px;
  height: 80px;
  margin-top: 10%;
  margin-left: 31%;
  margin-bottom: 5%;
}
.loginForm {
  background-color: #fff;
  border-radius: 20px;
  left: 57%;
  right: 5%;
  margin: auto;
  position: absolute;
}
.LoginFrom {
  margin-left: -60px;
}
.leftimage {
  width: 510px;
  height: 420px;
  border-radius: 10px;
}
</style>
