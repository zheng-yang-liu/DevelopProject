<!-- 发布文章 -->

<template>
  <div class="father_box">
    <div class="publishAnArticleBOX">
      <!-- 输入标题 -->
      <div class="enterATitle_box">
        <div class="enterATitle">
          <div class="enterATitle_input">
            <el-input
              placeholder="请输入标题(2~50)"
              v-model="title"
              minlength="2"
              maxlength="50"
            >
            </el-input>
          </div>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="dividingLine"></div>
      <!-- 输入正文 -->
      <div class="enterTheBody">
        <div class="content_box">
          <div class="content">
            <el-input
              type="textarea"
              placeholder="请输入正文"
              v-model="content"
              :show-word-limit="true"
              :autosize="{ minRows: 30, maxRows: 60 }"
            >
            </el-input>
          </div>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="dividingLine"></div>
      <!-- 选择文章分类 -->
      <div class="selectAnArticleCategory_box">
        <div class="selectAnArticleCategory_box_box">
          <div class="selectAnArticleCategory">
            <div class="select">
              <el-select v-model="cate_id" placeholder="请选择分类">
                <el-option
                  v-for="(item, index) in categorizedList"
                  v-if="index != 0"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>

            <!-- 发布按钮 -->
            <div class="publishButton">
              <button class="publishButton_button" @click="newArticle">
                发布
              </button>
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
      // 标题
      title: '',
      // 正文
      content: '',
      //文章分类ID
      cate_id: '',
      // 分类列表
      categorizedList: [],
    }
  },
  methods: {
    // 获取分类数据
    getCategoricalData() {
      axios.post('http://localhost:3000/selectCategorizedList').then((res) => {
        // console.log("分类", res)
        this.categorizedList = res.data.data
      })
    },
    newArticle() {
      if (this.title == '') {
        return this.$message.error('请输入标题')
      }
      if (this.content == '') {
        return this.$message.error('请输入正文')
      }
      if (this.cate_id == '') {
        return this.$message.error('请选择分类')
      }

      // 获取本地存储中的token值
      const token = localStorage.getItem('token')
      // 检查是否存在token
      if (token) {
        // 执行您想要的操作，例如设置组件数据或者发送请求等
        console.log(
          '标题',
          this.title,
          '正文',
          this.content,
          '分类ID',
          this.cate_id
        )
        request
          .post('http://localhost:3000/insertIntoRelease', {
            title: this.title,
            content: this.content,
            cate_id: this.cate_id,
            token: token,
          })
          .then((res) => {
            // 清空数据
            this.title = ''
            this.content = ''
            this.cate_id = ''
            // 跳转页面
            this.$publicJS.ToNewPath('mycontent')
          })
      } else {
        // 如果不存在token，执行其他逻辑
        return this.$message.error('还未登录 请前往登录')
      }
    },
  },
  mounted() {
    // 获取分类数据
    this.getCategoricalData()
  },
}
</script>

<style scoped>
@import url(../css/publishAnArticle.css);
</style>
