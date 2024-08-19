<template>
  <div>
    <h1 class="text-red">💖 Hello 1!</h1>
    <p>Welcome to your Electron application.</p>
    <el-button>123</el-button>
    {{ok}}
  </div>
</template>

<script setup>
const ok = ref(1)
</script>

<style lang="scss" scoped>
h1 {
  @apply text-4xl
}
</style>
