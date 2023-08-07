<template>
  <div class="box">
    <div
      class="container"
      :style="{ height: containerHeight }"
      @scroll="handleScroll"
      ref="container"
    >
      <!-- 数列表 -->
      <div class="list" :style="{ marginTop: listTop }">
        <!-- 列表项 -->
        <div
          v-for="(item, index) in showData"
          :key="index"
          :style="{ height: size + 'px' }"
          class="listItems"
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
            <p>{{ item.like_num | formatNumber }}点赞</p>
            <p>{{ item.see_num | formatNumber }}浏览</p>
            <p>{{ item.create_time | dateFormat }}</p>
          </div>
          <!-- 文章内容 articleContent-->
          <div class="articleContent">
            <p>{{ item.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    child_controlSliding: {
      type: Boolean,
      required: true,
    },
    // 要渲染的数据
    items: {
      type: Array,
      required: true,
    },
    // 每条数据渲染节点的高度
    size: {
      type: Number,
      required: true,
    },
    // 每次渲染DOM节点的个数
    shownumber: {
      type: Number,
      required: true,
    },

    // grandson_更改开始函数
    grandson_changeStart: {
      type: Function,
      required: true,
    },
    // 文章列表数组的长度
    child_theListOfArticlesLength: {
      type: Number,
      required: true,
    },
    // 判断上下
    grand_swipeTheMarkerUpAndDown: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      start: 0, //要展示数据的起始下标
      end: this.shownumber, //要展示数据的结束下标
      // 窗口大小
      windowSize: this.size,
      // 距离顶部的高度
      topstart: this.size,
      // 滑动开关
      controlSliding: this.child_controlSliding,
      // 控制滑动的下标
      // controlStart:0
      //接收文章列表数组的长度
      receivesArrayLength: 0,
      //鼠标滚动方向上为false;下为true,默认为true
      mouseScrollDirection: false,
    }
  },
  methods: {
    // 容器的滚动事件
    handleScroll() {
      // 获取容器顶部滚动的尺寸
      const scrollTop = this.$refs.container.scrollTop
      // console.log('我是容器的滚动事件');
      // this.receivesArrayLength=40
      // 计算卷去的数据条数，用计算的结果作为获取数据的其实和结束下表
      // 起始位置的下表就是卷去的数据条数，向下取整

      // this.receivesArrayLength=40
      // console.log("this.mouseScrollDirectionQQQQQQQQQQQQQQQQQQ", this.mouseScrollDirection);
      // || !this.mouseScrollDirection
      // console.log("我是判断",this.end < this.receivesArrayLength);
      // console.log("我是向上",this.mouseScrollDirection);
      if (this.end < this.receivesArrayLength || this.mouseScrollDirection) {
        this.start = Math.floor(scrollTop / this.size)
      }

      // 改变控制滑动的下标
      this.controlsTheSubscriptOfTheS = this.start
      // 结束的下标就是起始的下标加上要展示的数据条数

      this.end = this.start + this.shownumber
    },
    // 改变滚动状态
    changeTheScrollState() {
      const container = document.querySelector('.container')
      // 为false添加样式overflow:hidden;
      if (this.controlSliding) {
        // console.log('我是禁用中的true');
        // console.log("我是禁用",this.controlSliding);
        container.style.overflow = ''
      } else {
        // console.log("我是禁用中的false");
        // console.log("我是禁用",this.controlSliding);
        container.style.overflow = 'hidden'
      }
    },
  },
  computed: {
    // 最终筛选出要展示的数据
    showData() {
      // console.log('showData起始位置下标', this.start)
      // console.log('showData结束位置下标', this.end)
      // console.log('this.receivesArrayLength<<<<<<', this.receivesArrayLength)

      return this.items.slice(this.start, this.end)
    },
    // 容器的高度
    containerHeight() {
      return (this.windowSize = this.size * this.shownumber + 'px')
    },
    // 撑开内容高度的元素的高度
    barHeight() {
      return (this.windowSize = this.size + 'px')
    },
    //列表项上滚动改变top的值
    listTop() {
      return (this.topstart = this.start * this.size + 'px')
    },
    // 接收父组件中的数组长度
    getArrayLength(newValue) {
      this.receivesArrayLength = newValue
      // console.log(
      //   '我是父组件文章列表的数组长度>>>>>>>>>',this.receivesArrayLength)
    },
  },
  mounted() {
    // console.log("我是默认的controlSlidingTTTTTTTTTTTT", this.controlSliding);
    this.changeTheScrollState()
    // console.log("grand_swipeTheMarkerUpAndDown",this.grand_swipeTheMarkerUpAndDown);
  },

  watch: {
    child_controlSliding: function (newValue, oldValue) {
      this.controlSliding = newValue
      // console.log('newValue: ' + newValue + ' oldValue: ' + oldValue)
      // console.log('this.controlSliding*********', this.controlSliding)
      this.changeTheScrollState()
    },
    //监听下标的改变，并改变changeStart的是
    start: function (newValue, oldValue) {
      this.grandson_changeStart(newValue)
    },
    child_theListOfArticlesLength: function (newValue, oldValue) {
      //  接收父组件中的数组长度
      let dataLength = newValue
      // console.log(
      //   '我是数组长度newValue>>: ' +
      //     dataLength +
      //     '我是数组长度oldValue: ' +
      //     oldValue
      // )
      this.receivesArrayLength = dataLength
      // console.log('我是子组件中的数组长度', this.child_theListOfArticlesLength)
    },
    grand_swipeTheMarkerUpAndDown: function (newValue, oldValue) {
      // console.log("我是判断上下new",newValue,"我是判断上下old", oldValue);
      this.mouseScrollDirection = newValue
    },
  },
}
</script>

<style scoped>
.container {
  overflow-y: scroll;
  background-color: rgb(255, 255, 255);
  width: 100%;
  margin: 0 auto;
  position: relative;
  border-radius: 5px;
}
.list {
  /* position: absolute; */
  top: 0;
  width: 100%;
  border-radius: 5px;
  background-color: #f1f2f5;
  height: 60rem;
}
/* 隐藏滑动条 */
.container::-webkit-scrollbar {
  display: none;
}
/* 列表项 */
.listItems {
  border-radius: 5px;
  background-color: #ffffff;
}

.list > div:not(:first-child) {
  margin-top: 10px;
}
.articleTitle:hover {
  cursor: pointer;
}
/* 文章标题  */
.articleTitle p {
  font-size: 20px;
  font-weight: bold;
  color: black;
  /* background-color: green; */
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 10em;

  margin-left: 4%;
  padding-top: 1%;
}

/* 文章信息 */
.articleInformation {
  display: flex;
}
.articleInformation p {
  color: gray;
  margin-left: 4%;
  font-size: 10px;
}
/* 文章内容 content */
.articleContent {
  margin-top: 10px;
  /* background-color: red; */
  width: 100%;
  box-sizing: border-box;
}
.articleContent p {
  margin-left: 4%;
  margin-right: 4%;
  height: 45px;

  text-indent: 2em;
  overflow: hidden;
}
.bar {
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bar p {
  text-align: center;
  margin-top: 5px;
}
</style>
