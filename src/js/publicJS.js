import router from '@/router/index'

export default {
  // 新页面跳转
  ToNewPath(ToPath) {
    console.log('跳转首页', ToPath)

    // 当前页面在路由配置中的name
    let name = router.app._route.name
    console.log('name', name)
    console.log('我是mylike页面的name<<<<<<', name)
    // 当跳转的路径等于本身路径则刷新本页面,反之跳转
    if (ToPath == 'home') {
      window.location.href = '/'
    } else if (name == ToPath) {
      console.log('重定向到页面')
      // 重定向到页面
      window.location.href = name
    } else {
      // 在组件中使用路由跳转
      router.push({ name: ToPath })
    }
  },
  // 跳转文章详情
  jumpToArticleDetails(contentID) {
    router.push({
      name: 'content',
      params: {
        contentID: contentID,
      },
    })
  },
}
