<!-- 文章详情 -->
<template>
  <div>
    <div class="myText">
      <P>发布文章</P>
    </div>
    <el-container>
      <!-- 顶部导航 -->
      <el-header height="80px">
        <topNavigation></topNavigation>
      </el-header>

      <div class="main_box" ref="mainBox">
        <!-- 主要数据内容 -->
        <div class="primaryDataContent">
          <div class="primaryDataContent_box"></div>
          <!-- 发布文章 -->
          <publishAnArticle></publishAnArticle>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
// 顶部导航
import topNavigation from '../components/topNavigation.vue'
// 个人中心
import publishAnArticle from '../components/publishAnArticle.vue'
// 发布文章
// publishAnArticle

export default {
  data() {
    return {
      navigation_box_top: 350,
      // 滚动距离
      lastScrollTop: 0,
      // 连带滚动 false 禁止连带滚动
      scrollTogether: false,
      // 改变滑动的下标
      controlStartMark: 0,
    }
  },
  components: {
    topNavigation,
    publishAnArticle,
  },

  mounted() {
    document.body.style.overflow = 'hidden'
    const primaryDataContent = document.querySelector('.primaryDataContent')
    primaryDataContent.style.position = 'fixed'
    primaryDataContent.style.zIndex = '999'
    primaryDataContent.style.top = '90px'

    //给.main_box添加@wheel="handleScroll"事件
    document
      .querySelector('.main_box')
      .addEventListener('wheel', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    // 监测鼠标滚轮滚动事件
    handleScroll(event) {
      if (event.deltaY > 0) {
        // 向下滚动
        // console.log("向下滚动", event.deltaY / 2);
        const publishAnArticleBOX = document.querySelector(
          '.publishAnArticleBOX'
        )
        //平滑滚动
        let count = 0
        const intervalId = setInterval(() => {
          //   console.log("我是滑动");
          publishAnArticleBOX.scrollTop += 6 // 向下滚动33
          count++
          if (count === 6) {
            clearInterval(intervalId)
          }
        }, 50)
      } else if (event.deltaY < 0) {
        // console.log("向上滚动", event.deltaY / 2);
        const publishAnArticleBOX = document.querySelector(
          '.publishAnArticleBOX'
        )
        // 向上滚动
        //平滑滚动
        let count = 0
        const intervalId = setInterval(() => {
          // console.log("我是滑动");
          publishAnArticleBOX.scrollTop -= 6 // 向上滚动33
          count++
          if (count === 6) {
            // 只执行6次
            clearInterval(intervalId)
          }
        }, 50)
      }
    },
  },
}
</script>

<style scoped>
.primaryDataContent_box {
  display: flex;
  justify-content: center;
}

.myText {
  width: 200px;
  height: 50px;
  /* background-color: red; */
  position: absolute;
  z-index: 1000;
  top: 13px;
  left: 45%;
  display: flex;
  align-items: center;
  /* 不允许复制 */
  -webkit-user-select: none;
  /* Safari/Chrome */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* IE10+ */
  user-select: none;
  /* 其他浏览器 */
}

.myText p {
  font-size: 30px;
  font-weight: bold;

  background: linear-gradient(to right, #3494e6, #ec6ead);
  -webkit-background-clip: text;
  /* Safari, Chrome */
  -moz-background-clip: text;
  /* Firefox */
  -o-background-clip: text;
  /* Opera */
  -ms-background-clip: text;
  /* IE */
  background-clip: text;
  /* 标准属性 */
  -webkit-text-fill-color: transparent;

  /* 设置字间距 */
  letter-spacing: 10px;
}
</style>
