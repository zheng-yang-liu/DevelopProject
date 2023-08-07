import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: home,
  },
  // 我的喜欢,mylike
  {
    path: '/mylike',
    name: 'mylike',
    component: () => import('../views/mylike.vue'),
  },
  // 我的踩,mynolike
  {
    path: '/mynolike',
    name: 'mynolike',
    component: () => import('../views/mynolike.vue'),
  },
  // 我的发布,mycontent
  {
    path: '/mycontent',
    name: 'mycontent',
    component: () => import('../views/mycontent.vue'),
  },
  // 我的评论,myask
  {
    path: '/myask',
    name: 'myask',
    component: () => import('../views/myask.vue'),
  },
  // 热门文章,hotcontent
  {
    path: '/hotcontent',
    name: 'hotcontent',
    component: () => import('../views/hotcontent.vue'),
  },
  // 登录页面
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue'),
  },
  // 注册页面
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/register.vue'),
  },
  // 文章详情页面
  {
    path: '/content/:contentID',
    name: 'content',
    component: () => import('../views/content.vue'),
  },
  // 个人中心页面
  {
    path: '/mycenter',
    name: 'mycenter',
    component: () => import('../views/mycenter.vue'),
  },
  // 文章发布
  {
    path: '/release',
    name: 'release',
    component: () => import('../views/release.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

// 添加全局的导航守卫
let isFirstNavigation = true // 初始值为true，表示是初次导航

router.beforeEach((to, from, next) => {
  if (to.name === 'home' && isFirstNavigation) {
    // 如果是首页（name为"home"）且是初次导航，则不执行滚动位置设置操作
    isFirstNavigation = false // 设置为false，表示初次导航已完成
  } else {
    window.scrollTo(0, 0) // 除首页外，每次导航前都将滚动位置设置为顶部
  }
  next()
})
// 解决vue-router在3.0版本以上重复点报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

export default router
