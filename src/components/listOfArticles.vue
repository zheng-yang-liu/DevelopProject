<template>
  <div class="listOfArticles_box">
    <!-- 上文章分类 -->
    <div class="listOfArticles_box_above">
      <div class="listOfArticles_box_above_span">
        <div
          v-for="(item, index) in categorizedList"
          :key="index"
          v-if="index < 10"
        >
          <div
            :class="index == defaultTagsCss ? 'changeColor' : 'defaultColor'"
            @click="changeColor(index, item.id)"
            class="listOfArticles_box_above_span_categorizeItems"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
      <!-- 显示更多分类 -->
      <i class="icon icon-list" @click="showMoreClassifications"></i>
      <transition name="fade">
        <div class="moreAssortments" v-if="displayList">
          <div class="moreAssortments_box_child">
            <div
              v-for="(item, index) in categorizedList"
              :key="index"
              v-if="index > 10"
              class="moreAssortments_span_list"
            >
              <div
                :class="
                  index == defaultTagsCss ? 'changeColor' : 'defaultColor'
                "
                @click="changeColor(index, item.id)"
                class="moreAssortments_span_list_categorizeItems"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </transition>
      <!-- showMoreClassifications -->
    </div>

    <!-- 下文章列表 -->
    <div class="listOfArticles_box_under">
      <!-- 定义组件 -->
      <essayList
        ref="changeSliding"
        :items="listOfArticles"
        :size="130"
        :shownumber="6"
        :child_controlSliding="controlSliding"
        :grandson_changeStart="changeStart"
        :child_theListOfArticlesLength="theListOfArticlesLength"
        :grand_swipeTheMarkerUpAndDown="child_swipeTheMarkerUpAndDown"
      >
      </essayList>
    </div>
  </div>
</template>

<script>
import essayList from '../components/essayList.vue'
import axios from 'axios'
import request from '../utils/request'

export default {
  props: {
    // 控制.container滑动
    controlSliding: {
      type: Boolean,
      required: true,
    },
    // 判断上下
    child_swipeTheMarkerUpAndDown: {
      type: Boolean,
      required: true,
    },
    // child_更改开始函数
    child_changeStart: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      //默认标记css
      defaultTagsCss: 0,
      // 分类列表
      categorizedList: [],
      // 渲染文章列表的数据
      // 文章列表
      // id、标题、发布人、点赞数、浏览量、发布日期、文章内容
      listOfArticles: [],
      // 改变滑动的下标
      controlStartMark: 0,

      // 显示
      displayList: false,
      // listOfArticles数组的长度
      theListOfArticlesLength: 0,
    }
  },
  // 模拟数据
  computed: {
    items() {
      // 模拟以往条数据
      return Array(1000)
        .fill('')
        .map((item, index) => ({
          id: index,
          content: '列表数据内容' + index,
        }))
    },
    // items;要进行渲染的数据列表
    //size;每一条数据的高度
    //shownumber;每次渲染的条数(DOM个数)
  },

  methods: {
    // 改变默认标记改变文字颜色
    changeColor(index, ID) {
      console.log('分类ID', ID)
      if (ID == 1) {
        this.getArticleData()
      } else {
        request
          .post('http://localhost:3000/SelectClassifyToContent', {
            cate_id: ID,
          })
          .then((res) => {
            console.log(res)
            if (res.code == 200) {
              this.listOfArticles = res.data
              // console.log(this.listOfArticles)
              return (this.theListOfArticlesLength = this.listOfArticles.length)
            } else {
              this.listOfArticles = []
              // console.log(this.listOfArticles)
              return (this.theListOfArticlesLength = 0)
            }
          })
      }
      this.defaultTagsCss = index
      if (index > 10) {
        // 关闭位置
        this.displayList = !this.displayList
        // 交换位置
        const temp = this.categorizedList[index]
        this.categorizedList[index] = this.categorizedList[9]
        this.categorizedList[9] = temp
        this.defaultTagsCss = 9
      }
    },
    // 改变start控制body滑动的值
    changeStart(newStart) {
      this.controlStartMark = newStart
    },
    // 获取文章数据
    getArticleData() {
      // 默认的获取的文章内容==>>在首页或者未加载我的X文章、和选择分类时显示

      // 获取页面配置中的name的值来进行相应的数据获取
      console.log('我是页面的name', this.$route.name)
      var routerName = this.$route.name
      if (routerName == 'home') {
        axios.post('http://localhost:3000/selectContentList').then((res) => {
          // console.log(res)
          if (res.data.code == 200) {
            this.listOfArticles = res.data.data
            // console.log(this.listOfArticles)
            return (this.theListOfArticlesLength = this.listOfArticles.length)
          } else {
            this.listOfArticles = []
            return (this.theListOfArticlesLength = 0)
          }
        })
      } else if (routerName == 'hotcontent') {
        // 请求热门文章的文章内容，排序依据浏览量
        // 请求热门文章
        axios.post('http://localhost:3000/selectHotReviewList').then((res) => {
          if (res.data.code == 200) {
            this.listOfArticles = res.data.data
            // console.log(this.listOfArticles)
            return (this.theListOfArticlesLength = this.listOfArticles.length)
          } else {
            this.listOfArticles = []
            return (this.theListOfArticlesLength = 0)
          }
        })
      } else {
        // 获取本地存储中的token值
        const token = localStorage.getItem('token')
        // 检查是否存在token
        if (token) {
          // 执行您想要的操作，例如设置组件数据或者发送请求等
          // if (routerName != 'home')
          axios
            .post('http://localhost:3000/myVariousArticles', {
              name: routerName,
              token: token,
            })
            .then((res) => {
              console.log(res)

              if (res.data.code == 200) {
                this.listOfArticles = res.data.data
                // console.log(this.listOfArticles)
                return (this.theListOfArticlesLength =
                  this.listOfArticles.length)
              } else {
                this.$message.error('没有相关的文章信息')
                this.listOfArticles = []
                return (this.theListOfArticlesLength = 0)
              }
            })
        } else {
          // 如果不存在token，执行其他逻辑
          return this.$message.error('还未登录 请前往登录')
        }
      }
    },
    //显示更多分类showMoreClassifications
    showMoreClassifications() {
      this.displayList = !this.displayList
      this.displayListIndex++
    },

    // 请求分类
    requestClassification() {
      //文章分类
      axios.post('http://localhost:3000/selectCategorizedList').then((res) => {
        // console.log(res)
        this.categorizedList = res.data.data
      })
    },
    // 页面加载时请求文章数据
    // articleDataIsRequestedWhenThePageLoads() {},
  },
  watch: {
    controlStartMark: function (newValue, oldValue) {
      // console.log("list>>>>>>>", "new", newValue, "old", oldValue);
      //控制向上滑动
      this.child_changeStart(newValue)
    },
  },
  components: {
    // 文章列表
    essayList,
  },

  mounted() {
    // 获取文章数据
    this.getArticleData()
    // 请求分类
    this.requestClassification()
    // 页面加载时请求文章数据
    // articleDataIsRequestedWhenThePageLoads()
  },
}
</script>

<style scoped>
@import '../css/listOfArticles.css';
</style>
