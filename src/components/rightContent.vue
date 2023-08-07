<template>
  <div class="rightContent_box">
    <!-- 上热评文章 -->
    <div class="rightContent_box_above">
      <div class="rightContent_box_above_above">
        <!-- 热评文章 -->
        <p class="rightContent_box_above_above_firstP">热门文章</p>
        <span @click="flushed">
          <i class="icon icon-refresh-cw"></i>
          <p>点击刷新</p>
        </span>
      </div>
      <div
        class="rightContent_box_under_under"
        v-for="(item, index) in hotReviewList"
        :key="item.id"
        v-if="index < 8"
      >
        <span @click="$publicJS.jumpToArticleDetails(item.id)">
          <p class="firstP">{{ item.title }}</p>

          <!-- 在您的应用程序中使用 formatNumber 过滤器：{{ item.see_num | formatNumber }} -->
          <p class="otherP">{{ item.see_num | formatNumber }}</p>
        </span>
      </div>
    </div>
    <!-- 下友情链接 -->
    <div class="rightContent_box_under">
      <!-- 友情链接 -->
      <div class="links">
        <p class="links_firstP">友情链接</p>
        <div class="address">
          <span v-for="(item, index) in aListOfConnections" :key="item.id">
            <a
              type="primary"
              class="links_otherP"
              :href="item.link"
              target="_blank"
            >
              {{ item.name }}
            </a>
          </span>
        </div>
      </div>
      <div class="contact">
        <p class="links_firstP">联系方式</p>
        <div class="address">
          <span
            v-for="(item, index) in contact"
            :key="index"
            class="links_otherP"
          >
            {{ item.contact }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// 更换封装后的axios请求
// import request from '../utils/request'
export default {
  data() {
    return {
      // 热门列表
      // hotReviewList: [
      //   { id: 1, title: '这是我的文章1', see_num: 1298 },
      // ],
      hotReviewList: [],
      //连接列表
      aListOfConnections: [],
      // 联系方式
      contact: [
        { id: 1, contact: '2964142130@qq.com' },
        { id: 2, contact: 'thexuyan@outlook.com' },
        { id: 3, contact: 'www.wenzhangyuedu.com' },
      ],
    }
  },
  methods: {
    // 请求热门文章
    requestAPopularArticle() {
      // 请求热门文章
      axios.post('http://localhost:3000/selectHotReviewList').then((res) => {
        // console.log('热门', res.data.data)
        this.hotReviewList = res.data.data
      })
    },
    // 刷新
    flushed() {
      this.requestAPopularArticle()
    },
  },
  mounted() {
    // 请求友情链接
    axios.post('http://localhost:3000/selectLink').then((res) => {
      this.aListOfConnections = res.data.data
      // console.log(this.aListOfConnections)
    })
    // 请求热门文章
    this.requestAPopularArticle()
  },
}
</script>

<style scoped>
@import url(../css/rightContent.css);
</style>
