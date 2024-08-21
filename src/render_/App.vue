<template>
  <el-config-provider :locale="zhCn">
    <RouterView />
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from "element-plus/dist/locale/zh-cn.min.mjs";

onMounted(async () => {
  // 初始化文件配置
});
</script>

<style lang="scss" scoped></style>
