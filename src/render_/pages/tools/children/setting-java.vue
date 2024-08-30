<template>
  <div class="setting-java__wrapper">
    <h1>Java设置</h1>
    <!-- 此页面负责检测java环境变量,java环境目录 -->
    <el-card class="box-card"> </el-card>
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  // 页面初始化的时候检测java环境变量
});
</script>

<style scoped lang="scss">
.setting-java__wrapper {
  @apply antialiased;
  h1 {
    @apply mb-2;
  }
}
</style>
