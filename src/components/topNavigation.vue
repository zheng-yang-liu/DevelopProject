<template>
  <div class="navigation">
    <!-- 左侧 -->
    <div class="navigation_left">
      <!-- logo图片 -->
      <img
        src="../img/logo.png"
        class="navigation_logo"
        @click="$publicJS.ToNewPath('home')"
      />
      <!-- 网站名字-文章阅读网 -->
      <!-- <span class="navigation_text" @click="ToNewPath('home')">文章阅读网</span> -->
      <span class="navigation_text" @click="$publicJS.ToNewPath('home')"
        >文章阅读网</span
      >
    </div>
    <!-- 右侧 -->
    <div class="navigation_right">
      <!-- 发布按钮 -->
      <div class="publish_hand">
        <i class="el-icon-plus"></i>
        <span
          class="navigation_right_publish"
          @click="$publicJS.ToNewPath('release')"
          >发布</span
        >
      </div>

      <!-- 登录按钮 -->
      <div class="signInButton" v-if="showSignIn">
        <el-button
          type="primary"
          class="navigation_right_login"
          @click="$publicJS.ToNewPath('login')"
          >登录</el-button
        >
        <!-- 注册按钮 -->
        <el-button
          plain
          class="navigation_right_enroll"
          @click="$publicJS.ToNewPath('register')"
          >注册</el-button
        >
      </div>
      <div v-else class="signInButton_avatar">
        <div class="upperPortion">
          <!-- avatar -->
          <img :src="'http://localhost:3000/' + avatar" class="avatar" />
          <!-- nickname -->
          <span class="nickname" @click="$publicJS.ToNewPath('mycenter')">{{
            nickname
          }}</span>
          <span class="quitButton" @click="quit">退出</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  methods: {
    // 请求头像和昵称
    obtainUserUserInformation() {
      if (!this.showSignIn) {
        const token = localStorage.getItem('token')
        axios
          .post('http://localhost:3000/user', {
            token: token,
            requestName: 'home',
          })
          .then((res) => {
            if (res.data.code == 200) {
              this.avatar = res.data.data[0].avatar
              this.nickname = res.data.data[0].nickname
            } else {
              this.$message.error(res.data.msg)
            }
          })
      }
    },
    quit() {
      // 清除本地存储的 token
      localStorage.removeItem('token')

      // 刷新页面
      location.reload()
    },
  },
  data() {
    return {
      showSignIn: true,
      avatar: '',
      nickname: '',
    }
  },
  created() {
    const token = localStorage.getItem('token')
    if (token) {
      this.showSignIn = false
    } else {
      this.showSignIn = true
    }
  },
  mounted() {
    this.obtainUserUserInformation()
  },
}
</script>

<style scoped>
@import '../css/topNavigation.css';
i {
  font-weight: bold;
}
</style>
