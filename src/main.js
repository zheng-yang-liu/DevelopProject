import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//加载 element 组件库
import ElementUI from 'element-ui'
//加载 element 组件库的样式
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import AtComponents from 'at-ui'
import 'at-ui-style'
Vue.use(AtComponents)

Vue.config.productionTip = false

//创建一个 Vue 过滤器来格式化数字
Vue.filter('formatNumber', function (value) {
  if (value >= 10000) {
    return (value / 10000).toFixed(1) + '万'
  } else {
    return value
  }
})
// 只能输入数字
Vue.directive('numberOnly', {
  bind: function (el) {
    el.handler = function () {
      el.childNodes[1].value = el.childNodes[1].value.replace(/\D+/g, '') //因为是elementui组件里使用的el.value获取不到我们输入的内容。然后我发现他的第一个孩子才是我们输入的手机号码的内容。
    }

    el.addEventListener('keyup', el.handler) //这里使用keyup。我开始用的input发现第一次输入拼音字母竟然是可以输入的。改成keyup就都不能输入非数字了
  },

  unbind: function (el) {
    el.removeEventListener('keyup', el.handler)
  },
})

// 创建一个 Vue 过滤器来格式化
// 使2023 - 06 - 07T07: 01: 56.000Z这样格式的日期转化成2023 - 06 - 07 07: 01: 56这样格式的
Vue.filter('dateFormat', function (value) {
  if (!value) return ''

  const date = new Date(value)
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const hours = ('0' + date.getHours()).slice(-2)
  const minutes = ('0' + date.getMinutes()).slice(-2)
  const seconds = ('0' + date.getSeconds()).slice(-2)

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
})

// 引入公共js
import publicJS from './js/publicJS'
Vue.prototype.$publicJS = publicJS

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
