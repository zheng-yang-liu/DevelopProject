<!-- 文章详情 -->
<template>
  <div class="father_box">
    <div class="personalCenterBox">
      <!-- 中心内容 -->
      <div class="centralContent">
        <!-- 个人中心滚动框personalCenterScrollingBox -->
        <div class="personalCenter_ScrollingBox">
          <!-- 上部：头像、昵称-获赞、修改个人信息 -->
          <div class="personalCenter_ScrollingBox_upperPortion_box">
            <div class="personalCenter_ScrollingBox_upperPortion">
              <!-- 头像avatar -->
              <img
                :src="'http://localhost:3000/' + personalInformation[0].avatar"
                class="avatarImg"
              />
              <!-- 昵称-获赞nicknameLiked -->
              <div class="nicknameLiked">
                <div class="nicknameLiked_nickname">
                  {{ personalInformation[0].nickname }}
                </div>
                <div class="nicknameLiked_liked">
                  {{ personalInformation[0].like_num | formatNumber }} 点赞
                </div>
              </div>
              <!-- 修改个人信息 -->
              <button class="button" @click="openThePopDialog">
                修改个人信息
              </button>
              <el-dialog
                title="修改个人信息"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose"
                :modal-append-to-body="false"
                :append-to-body="true"
                class="dialog"
              >
                <!-- <span>这是一段信息</span> -->
                <el-form
                  :model="form"
                  label-position="left"
                  label-width="100px"
                  class="LoginFrom"
                >
                  <!--  -->
                  <el-form-item
                    label="修改昵称"
                    prop="nickname"
                    label-width="100px"
                    class="form_item_box"
                  >
                    <el-input
                      maxlength="11"
                      placeholder="请输昵称"
                      v-model="form.nickname"
                      :maxlength="20"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    label="修改手机号"
                    prop="phone"
                    label-width="100px"
                    class="form_item_box"
                    :maxlength="11"
                  >
                    <el-input
                      v-model="form.phone"
                      placeholder="请输入手机号"
                      v-number-only
                      maxlength="11"
                    ></el-input>
                  </el-form-item>

                  <el-form-item
                    label="修改密码"
                    prop="password"
                    label-width="100px"
                    class="form_item_box"
                  >
                    <el-input
                      v-model="form.password"
                      placeholder="请输入密码"
                      show-password
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    label="修改头像"
                    prop="avatar"
                    label-width="100px"
                    class="form_item_box"
                  >
                    <div class="upload_box">
                      <div class="upload_left">
                        <el-upload
                          class="upload-demo"
                          action="http://localhost:3000/upload"
                          name="image"
                          :show-file-list="false"
                          :on-success="successupload"
                        >
                          <el-button size="small" type="primary"
                            >点击上传</el-button
                          >
                          <div slot="tip" class="el-upload__tip">
                            只能上传jpg/png文件
                          </div>
                        </el-upload>
                      </div>
                      <div class="upload_right">
                        <img
                          class="upload_image"
                          v-if="avatar != ''"
                          :src="'http://localhost:3000/' + avatar"
                        />
                      </div>
                    </div>
                  </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="submitform"
                    >确 定</el-button
                  >
                </span>
              </el-dialog>
            </div>
          </div>
          <!-- 分割线 -->
          <div class="dividingLine"></div>
          <!-- 下部：我的发布 -->
          <div class="personalCenter_ScrollingBox_lower">
            <p class="myPosting">我的发布</p>
            <!-- 循环输出我的发布 -->
            <!-- <div class="loopOutMyPost">

            </div> -->
            <!-- 列表项 -->
            <div
              v-for="(item, index) in listOfArticles"
              :key="index"
              class="listItems"
              v-if="index < displaysTheNumberOfComments"
            >
              <!-- 文章标题 title-->
              <div
                class="articleTitle"
                @click="$publicJS.jumpToArticleDetails(item.id)"
              >
                <p>{{ item.title }}</p>
              </div>
              <!-- 发布人:nickname,点赞人数:like_num,浏览量:see_num,发布时间: create_time-->
              <div class="articleInformation">
                <p>{{ item.nickname }}</p>
                <p>{{ item.like_num | formatNumber }} 点赞</p>
                <p>{{ item.see_num | formatNumber }} 浏览</p>
                <p>{{ item.create_time | dateFormat }}</p>
              </div>
              <!-- 文章内容 articleContent-->
              <div class="articleContent">
                <p>{{ item.content }}</p>
              </div>
            </div>
            <div
              class="moreComments"
              @click="changeTheNumberOfBarsDisplayed"
              v-if="listLength > displaysTheNumberOfComments"
            >
              <div class="moreComments_text">显示更多内容</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import request from '../utils/request'
export default {
  data() {
    return {
      // 个人信息
      // nickname	昵称
      // avatar	头像
      // phone	手机号
      // password	密码

      personalInformation: [
        {
          id: '',
          nickname: '',
          avatar: '',
          like_num: '',
          phone: '',
          password: '',
        },
      ],
      //我的发布的文章列表
      listOfArticles: [],
      // 默认显示的条数
      displaysTheNumberOfComments: 6,
      // 我的发布的文章列表的长度
      listLength: 0,
      // 修改弹窗
      dialogVisible: false,
      // 更改后的数据
      form: {},
      // 用户token
      token: '',
      // 头像
      avatar: '',
      // 执行
      execute: 0,
      ifToken: false,
    }
  },
  methods: {
    //获取我的发布的文章数据getMyPublishedArticleData
    getMyPublishedArticleData(token) {
      axios
        .post('http://localhost:3000/myVariousArticles', {
          name: 'mycontent',
          token: token,
        })
        .then((res) => {
          // console.log(res)
          if (res.data.code == 200) {
            this.listOfArticles = res.data.data
            // 获取数组长度
            this.listLength = this.listOfArticles.length
          }
        })
    },
    // 更改显示的条数
    changeTheNumberOfBarsDisplayed() {
      this.displaysTheNumberOfComments += 6
    },
    // 确认关闭
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    // 提交数据
    submitform() {
      let mark = 0
      let markTokenNickname = 0
      let markTokenPassword = 0
      let markNickname = 0
      let markPassword = 0
      // 暂存Token=
      console.log(this.form)
      if ('nickname' in this.form) {
        console.log('myForm具有nickname属性')
        this.modifyUserData(this.token, this.form.nickname, 'nickname')
        mark = 1
        markTokenNickname = 1
        markNickname = 1
      }
      if ('password' in this.form) {
        console.log('myForm具有password属性')
        this.modifyUserData(this.token, this.form.password, 'password')
        markTokenPassword = 1
        mark = 1
        markPassword = 1
      }
      if ('phone' in this.form) {
        console.log('myForm具有phone属性')
        this.modifyUserData(this.token, this.form.phone, 'phone')
        mark = 1
      }
      if (this.avatar != '') {
        console.log('myForm具有avatar属性')
        this.modifyUserData(this.token, this.avatar, 'avatar')
        mark = 1
      }
      if (mark == 0) {
        this.$message.success('未进行任何修改')
        return (this.dialogVisible = false)
      }

      if (markTokenNickname == 1 && markTokenPassword == 1) {
        // 重新获取token值
        console.log('我被执行了')
        setTimeout(() => {
          this.regainTheTokenValue()
        }, 1000)
      }
      if (markTokenNickname == 1 || markTokenPassword == 1) {
        // 重新获取token值
        console.log('我被执行了')
        setTimeout(() => {
          this.regainTheTokenValue()
        }, 1000)
      }
      if (markNickname == 1) {
        // 重新获取token值
        this.regainTheTokenValue()
      }
      if (markPassword == 1) {
        // 重新获取token值
        this.regainTheTokenValue()
      }
      if (mark == 1) {
        // 获取用户用户信息
        setTimeout(() => {
          // this.obtainUserUserInformation()
          location.reload()
        }, 2000)

        // 重新获取token值
        // this.regainTheTokenValue()
        // setTimeout(() => {
        //   // 刷新页面
        //   // location.reload()
        // }, 1000)

        return (this.dialogVisible = false)
      }
    },
    //开启弹窗
    openThePopDialog() {
      // 清空数据
      this.dialogVisible = true
      //清空数据
      this.form = {}
      this.avatar = ''
      this.execute = 0
    },
    // 获取用户用户信息
    obtainUserUserInformation() {
      // 获取本地存储中的token值
      const token = localStorage.getItem('token')
      axios
        .post('http://localhost:3000/user', {
          token: token,
          requestName: 'mycenter',
        })
        .then((res) => {
          console.log('======================', res)
          if (res.data.code == 200) {
            this.personalInformation = res.data.data
          }
        })
    },
    // 文件上传成功后进行的回调函数
    successupload(e) {
      if (e.code == 200) {
        this.avatar = e.value
        console.log(this.avatar)
      } else {
        this.$message.error(e.msg)
      }
    },
    // 修改用户数据

    //参数 token:用户的唯一标识、afterModification:修改后的值、modifyTheProjectName:修改的字段名
    modifyUserData(token, afterModification, modifyTheProjectName) {
      console.log(
        '用户的唯一标识',
        token,
        '修改后的值',
        afterModification,
        '修改的字段名',
        modifyTheProjectName
      )
      axios
        .post('http://localhost:3000/user/upDateUser', {
          modifyTheProjectName: modifyTheProjectName,
          token: token,
          afterModification: afterModification,
        })
        .then((res) => {
          console.log(res)
          if (res.data.code == 200) {
            if (this.execute == 0) {
              this.$message.success(res.data.msg)
              this.execute = 1
            }
          } else {
            this.$message.error(res.data.msg)
          }
        })
    },
    //重新获取token值
    regainTheTokenValue() {
      // 重新获取token值
      axios
        .post('http://localhost:3000/user/upDateUser/token', {
          token: this.token,
        })
        .then((res) => {
          console.log(res.data.token)
          // 储存本地token
          localStorage.setItem('token', res.data.token)
          this.token = res.data.token
        })
    },
  },

  mounted() {
    // 获取本地存储中的token值
    const token = localStorage.getItem('token')
    this.token = token
    // 检查是否存在token
    if (token) {
      // 执行您想要的操作，例如设置组件数据
      // 获取数据
      this.getMyPublishedArticleData(token)
      // 获取用户用户信息
      this.obtainUserUserInformation()
    } else {
      // 如果不存在token，执行其他逻辑
      return this.$message.error('还未登录 请前往登录')
    }
    // 获取数组长度
    this.listLength = this.listOfArticles.length
  },
  // created() {
  //   // 监听本地存储中的token
  //   this.$watch('getToken', () => {
  //     this.ifToken = true
  //     console.log('我被改变了')
  //   })
  // },
}
</script>

<style scoped>
@import url(../css/personalCenter.css);
</style>
