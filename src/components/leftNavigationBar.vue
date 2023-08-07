<template>
  <div class="navigation_box">
    <!-- 文字 -->
    <div class="writing">
      <span @click="$publicJS.ToNewPath('mycenter')">
        <i class="icon icon-home"></i>
        <P>个人中心</P>
      </span>
      <span @click="$publicJS.ToNewPath('hotcontent')">
        <i class="icon icon-star"></i>
        <P>热门文章</P>
      </span>
      <span @click="$publicJS.ToNewPath('mylike')">
        <i class="icon icon-heart"></i>
        <P>我的喜欢</P>
      </span>
      <span @click="$publicJS.ToNewPath('mynolike')">
        <i class="icon icon-thumbs-down"></i>
        <P>我的踩</P>
      </span>
      <span @click="$publicJS.ToNewPath('mycontent')">
        <i class="icon icon-upload-cloud"></i>
        <P>我的发布</P>
      </span>
      <span @click="$publicJS.ToNewPath('myask')">
        <i class="icon icon-message-circle"></i>
        <P>我的评论</P>
      </span>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
/* 左侧导航 */
.navigation_box {
  width: 150px;
  height: 745px;
  /* height: 761px; */

  background-color: #ffffff;
  margin-left: 10%;
  /* 圆角属性 */
  border-radius: 5px;
  justify-content: center;
  display: flex;
}

.writing {
  display: flex;
  flex-direction: column;
}

.writing span {
  margin-top: 25px;
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

.writing span:hover {
  cursor: pointer;
}

.writing span p {
  margin-left: 5px;
}
</style>
