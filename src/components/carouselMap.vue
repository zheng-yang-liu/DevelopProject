<template>
  <div class="carouselMap_bos">
    <el-carousel indicator-position="outside" height="350px">
      <el-carousel-item v-for="(item, index) in ImgList" :key="index">
        <img :src="require(`../img/${item.imgUrl}`)" class="img" />
        <!-- `../img/${item.imgUrl}`  字符串拼接 -->
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ImgList: [
        { imgUrl: 'carouselMap1.png' },
        { imgUrl: 'carouselMap2.png' },
        { imgUrl: 'carouselMap3.png' },
      ],
    }
  },
}
</script>

<style scoped>
.img {
  /* 图片的中心显示在盒子的中心 */
  position: absolute;
  top: 50%; /* half the height */
  left: 50%; /* half the width */
  transform: translate(
    -50%,
    -50%
  ); /* translate(-50%,-50%) shifts the image to the center of the parent box */
  width: 100vw;
  height: 100vh; /* 100% height and width */
}
el-carousel-item {
  top: 20px;
}
</style>
