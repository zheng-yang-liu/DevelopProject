<template>
  <div>
    <el-container>
      <!-- 顶部导航 -->
      <el-header height="80px">
        <topNavigation></topNavigation>
      </el-header>
      <div class="main_box" ref="mainBox">
        <!-- 轮播图 -->
        <carouselMap></carouselMap>
        <!-- 主要数据内容 -->
        <div class="primaryDataContent">
          <div class="primaryDataContent_box"></div>
          <!-- 左侧导航栏 -->
          <leftNavigationBar></leftNavigationBar>
          <!-- 中间文章列表 -->
          <listOfArticles
            ref="changeSliding"
            :controlSliding="controlSliding"
            :child_changeStart="father_changeStart"
            :child_swipeTheMarkerUpAndDown="swipeTheMarkerUpAndDown"
          >
          </listOfArticles>
          <!-- 右侧内容 -->
          <!-- 右上部热评文章 -->
          <!-- 右侧右下友情链接 -->
          <rightContent></rightContent>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
// 顶部导航
import topNavigation from '../components/topNavigation.vue'
// 轮播图
import carouselMap from '../components/carouselMap.vue'
//左侧导航栏
import leftNavigationBar from '../components/leftNavigationBar.vue'
// 中间文章列表
import listOfArticles from '../components/listOfArticles.vue'
// 右侧内容
import rightContent from '../components/rightContent.vue'

export default {
  data() {
    return {
      navigation_box_top: 350,
      // 滚动距离
      lastScrollTop: 0,
      // 控制滑动 false 禁止滑动
      controlSliding: false,
      // 连带滚动 false 禁止连带滚动
      scrollTogether: false,
      // 改变滑动的下标
      controlStartMark: 0,
      // 上下滑动标记，上为true , 下为false
      swipeTheMarkerUpAndDown: false,
    }
  },
  components: {
    topNavigation,
    carouselMap,
    leftNavigationBar,
    listOfArticles,
    rightContent,
  },

  mounted() {
    // 启用body的滚动条
    document.body.style.overflow = ''
    const primaryDataContent = document.querySelector('.primaryDataContent')

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      // console.log('scrollTop++++++', scrollTop)
      if (scrollTop >= 448) {
        // console.log('我是>=447')
        // 当scrollTop大于等于447时，给.main_box添加@wheel="handleScroll"事件
        document
          .querySelector('.main_box')
          .addEventListener('wheel', this.handleScroll)
      } else if (scrollTop > 366) {
        // 当scrollTop小于447时，清空.main_box上的@wheel="handleScroll"事件
        document
          .querySelector('.main_box')
          .removeEventListener('wheel', this.handleScroll)

        primaryDataContent.style.position = 'fixed'
        primaryDataContent.style.zIndex = '999'
        primaryDataContent.style.top = '90px'
        // true 允许滑动
        this.controlSliding = true
      } else {
        primaryDataContent.style.position = ''
        primaryDataContent.style.zIndex = ''
        primaryDataContent.style.top = ''
        this.controlSliding = false
      }
    })

    //当.primaryDataContent距离顶部366之前时禁用.container的滑动功能
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    // 监测鼠标滚轮滚动事件
    handleScroll(event) {
      // 向下滚动
      if (event.deltaY > 0) {
        // 向下滚动
        this.swipeTheMarkerUpAndDown = false
        // console.log('向下滚动', event.deltaY / 2)
        const container = document.querySelector('.container')

        //平滑滚动
        let count = 0
        const intervalId = setInterval(() => {
          // console.log("我是滑动");
          container.scrollTop += 5 // 向下滚动33
          count++
          if (count === 6) {
            clearInterval(intervalId)
          }
        }, 50)

        // 禁用body的滚动条
        // console.log('禁用body的滚动条')
        document.body.style.overflow = 'hidden'
        // 向上滚动
      } else if (event.deltaY < 0) {
        this.swipeTheMarkerUpAndDown = true
        // console.log("向上滚动", event.deltaY / 2);
        const container = document.querySelector('.container')
        //平滑滚动
        let count = 0
        const intervalId = setInterval(() => {
          // console.log("我是滑动》》》》》》》》》》》》》");
          container.scrollTop -= 5 // 向上滚动33
          count++
          if (count === 6) {
            // 只执行6次
            clearInterval(intervalId)
          }
        }, 50)
        // 向上滚动
        // console.log('向上滚动', event.deltaY)
        if (this.controlStartMark == 0) {
          // 启用body的滚动条,延时1秒执行
          setTimeout(() => {
            document.body.style.overflow = ''
          }, 1000)
        }
      }
    },
    // 改变start控制body滑动的值
    father_changeStart(newStart) {
      this.controlStartMark = newStart
    },
    // 定义一个函数，用于重新加载主页
    reloadHomePage() {
      window.location.href = '' // 替换为你的主页文件路径
    },
  },
  watch: {},
}
</script>

<style scoped>
/* 首页css样式 */
@import '../css/home-css.css';
.primaryDataContent {
  justify-content: center;
}
</style>
