<template>
  <el-config-provider>
    <RouterView />
  </el-config-provider>
</template>

<script setup>
const ok = ref(1);
</script>

<style lang="scss" scoped>
h1 {
  @apply text-4xl;
}
</style>
