<template>
  <el-config-provider :locale="zhCn">
    <RouterView />
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from "element-plus/dist/locale/zh-cn.min.mjs";

onMounted(async () => {
  console.log(await window.electron);
});
</script>

<style lang="scss" scoped></style>
