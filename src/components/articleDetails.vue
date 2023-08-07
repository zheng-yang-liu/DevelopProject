<!-- 文章详情 -->
<template>
  <div>
    <div class="articleDetailsOuterBox">
      <!-- 文章内容 -->
      <div class="articleContent">
        <!-- 输出 -->
        <div
          class="output"
          v-for="(item, index) in articleData"
          :key="index"
          v-if="index < 1"
        >
          <!-- 文章信息：标题、发布人、发布时间、浏览量 -->
          <div class="articleContent_articleInformation">
            <p class="title">{{ item.title }}</p>
            <div class="articleData">
              <p>{{ item.nickname }}</p>
              <!-- 浏览量 -->

              <!-- 在您的应用程序中使用 formatNumber 过滤器：{{ item.views | formatNumber }} 使50000转化成5.0万 在main.js这中定义   -->
              <p>{{ item.see_num | formatNumber }} 浏览量</p>
              <p>{{ item.create_time | dateFormat }}</p>
            </div>
          </div>
          <!-- 内容 -->
          <div class="articleContent_content">
            <div class="articleContent_content_text">{{ item.content }}</div>
          </div>
          <!-- 点踩踏按钮 -->
          <div class="likeAndStep">
            <!-- 点赞按钮 -->
            <div
              class="likeAndStep_zan"
              @click="changeColor"
              :class="likeTheColor ? 'color' : 'defaultColor'"
            >
              <div class="icon_like"><i class="icon icon-heart"></i> 点赞</div>
            </div>
            <!-- 踩按钮 -->
            <div
              class="likeAndStep_cai"
              @click="changeCaiColor"
              :class="stepOnTheColor ? 'color' : 'defaultColor'"
            >
              <div class="icon_like">
                <i class="icon icon-thumbs-down"></i> 踩
              </div>
            </div>
          </div>

          <!-- 分割线 -->
          <div class="dividingLine"></div>
          <!-- 文章评论 -->
          <div class="articleComments">
            <div class="comments_text">
              <!-- 评论数 -->
              评论
              <div class="askNum">{{ listLength | formatNumber }} 条</div>
            </div>
            <div class="myComment">
              <!-- 发表评论 -->
              <div class="leaveAComment">
                <!-- 头像 -->
                <img
                  :src="'http://localhost:3000/' + userAvatar"
                  class="avatarImg_pinglun"
                />

                <div class="myCommentText_box">
                  <!-- 评论输入框 -->
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="myCommentText"
                    :autosize="true"
                    class="el-input_input"
                  >
                  </el-input>
                  <button
                    class="myCommentText_box_button"
                    @click="postAComment"
                  >
                    发布
                  </button>
                </div>
              </div>

              <!-- 输出评论内容 -->
              <div
                class="outputTheCommentContent"
                v-for="(item, index) in listOfComments"
                v-if="index < displaysTheNumberOfComments"
              >
                <div class="borderShadow">
                  <!-- 头像、昵称 -->
                  <div class="avatarNickname">
                    <img
                      :src="'http://localhost:3000/' + item.avatar"
                      class="avatarImg"
                    />
                    <p class="Nickname">{{ item.nickname }}</p>
                  </div>
                  <!-- 评论内容、评论时间 -->
                  <div class="contentTime">
                    <div class="contentTime_content">{{ item.content }}</div>
                    <div class="contentTime_time">
                      {{ item.create_time | dateFormat }}
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="moreComments"
                @click="changeTheNumberOfBarsDisplayed"
                v-if="listLength > displaysTheNumberOfComments"
              >
                <div class="moreComments_text">显示更多评论</div>
              </div>
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
      // articleData文章数据
      articleData: [
        {
          id: '',
          title: '',
          nickname: '',
          avatar: '',
          like_num: '',
          ask_num: '',
          see_num: '',
          create_time: '',
          content: ' ',
        },
      ],

      //  点赞颜色
      likeTheColor: false,
      //  踩颜色
      stepOnTheColor: false,

      //   我的评论内容
      myCommentText: '',
      //   评论列表
      listOfComments: [],
      // 显示评论的条数
      displaysTheNumberOfComments: 6,
      listLength: 0,
      // 文章ID
      contentID: 0,
      // 用户avatar
      userAvatar: '',
    }
  },
  methods: {
    // 获取用户用户信息
    obtainUserUserInformation() {
      // 获取本地存储中的token值
      const token = localStorage.getItem('token')
      axios
        .post('http://localhost:3000/user', {
          token: token,
          requestName: 'home',
        })
        .then((res) => {
          console.log(res)
          this.userAvatar = res.data.data[0].avatar
        })
    },
    // 进行点赞或者踩的API请求
    likeOrDislike(moduleName) {
      // 获取本地存储中的token值
      const token = localStorage.getItem('token')
      // 获取文章ID
      let contentID = this.$route.params.contentID
      request
        .post('http://localhost:3000/insertLike', {
          token: token,
          article_id: contentID,
          moduleName: moduleName,
        })
        .then((res) => {})
    },
    //取消点赞或者踩
    unlikeOrDislike(moduleName) {
      // 获取本地存储中的token值
      const token = localStorage.getItem('token')
      // 获取文章ID
      let contentID = this.$route.params.contentID
      request
        .post('http://localhost:3000/insertLike/unlike', {
          token: token,
          article_id: contentID,
          moduleName: moduleName,
        })
        .then((res) => {})
    },
    // 点赞逻辑
    changeColor() {
      if (this.stepOnTheColor) {
        this.stepOnTheColor = !this.stepOnTheColor
        this.unlikeOrDislike('cai')
      }
      this.likeTheColor = !this.likeTheColor
      if (this.likeTheColor) {
        console.log('数据加一')
        this.likeOrDislike('zan')
      } else {
        console.log('数据减一')
        this.unlikeOrDislike('zan')
      }
    },
    // 改变踩的颜色
    changeCaiColor() {
      if (this.likeTheColor) {
        this.likeTheColor = !this.likeTheColor
        this.unlikeOrDislike('zan')
      }
      this.stepOnTheColor = !this.stepOnTheColor
      if (this.stepOnTheColor) {
        console.log('数据加一')
        this.likeOrDislike('cai')
      } else {
        console.log('数据减一')
        this.unlikeOrDislike('cai')
      }
    },
    // 获取文章评论内容
    getArticleCommentContent(contentID) {
      axios
        .post('http://localhost:3000/selectAsk', {
          article_id: contentID,
        })
        .then((res) => {
          // console.log(res)
          if (res.data.code == 200) {
            this.listOfComments = res.data.data
            // 获取评论列表数组长度
            this.listLength = this.listOfComments.length
          }
        })
    },
    // 更改显示的条数
    changeTheNumberOfBarsDisplayed() {
      this.displaysTheNumberOfComments += 6
    },
    //发布评论,重新请求数据(数据的请示排序为时间降序)
    // 根据文章ID获取文章内容
    obtainTheArticleContentBasedOnTheArticleId(FuContentID) {
      this.contentID = FuContentID
      console.log('我是获取到的文章ID', this.contentID)
      // 根据文章ID获取文章内容
      // sql语句 select
      axios
        .post('http://localhost:3000/selectContent', {
          contentID: this.contentID,
        })
        .then((res) => {
          console.log('文章', res)
          this.articleData = res.data.data
        })
    },
    // 发布评论
    postAComment() {
      if (this.myCommentText == '') {
        return this.$message.error('请输入评论内容')
      } else {
        // 获取文章ID
        const contentID = this.$route.params.contentID
        // 获取本地存储中的token值
        const token = localStorage.getItem('token')
        console.log('我是文章id', contentID)
        request
          .post('http://localhost:3000/insertIntoAsk', {
            token: token,
            content: this.myCommentText,
            article_id: contentID,
          })
          .then((res) => {
            // 清空评论内容
            this.myCommentText = ''
            // 重新请求评论数据
            this.getArticleCommentContent(contentID)
          })
      }
    },
    // 获取用户对文章的点赞信息
    getMyLike(contentID) {
      // 获取本地存储中的token值
      const token = localStorage.getItem('token')
      //返回赞的颜色
      axios
        .post('http://localhost:3000/insertLike/likeTheInformation', {
          token: token,
          article_id: contentID,
          moduleName: 'zan',
        })
        .then((res) => {
          console.log(res)

          this.likeTheColor = res.data.likeTheColor
          console.log(this.likeTheColor)
        })
      //返回踩的颜色
      axios
        .post('http://localhost:3000/insertLike/likeTheInformation', {
          token: token,
          article_id: contentID,
          moduleName: 'cai',
        })
        .then((res) => {
          console.log(res)

          this.stepOnTheColor = res.data.nolikeTheColor

          console.log(this.stepOnTheColor)
        })
    },
  },
  mounted() {
    // console.log('我是数组长度', this.listLength)
    // 根据父组件的文章ID来获取文章内容
    // 获取文章ID
    let contentID = this.$route.params.contentID
    this.obtainTheArticleContentBasedOnTheArticleId(contentID)
    // 加载评论列表数据
    this.getArticleCommentContent(contentID)
    // 获取用户对文章的点赞信息
    this.getMyLike(contentID)
    // 获取用户用户信息
    this.obtainUserUserInformation()
  },
  watch: {},
}
</script>

<style scoped>
@import url(../css/articleDetails.css);
</style>
