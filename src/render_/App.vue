<template>
  <el-config-provider :locale="$locale">
    <RouterView />
  </el-config-provider>
</template>

<script setup>
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
</script>

<style lang="scss" scoped>
h1 {
  @apply text-4xl;
}
</style>
