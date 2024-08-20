<template>
  <div class="layout">
    <div class="layout__header">
      <layout-header />
    </div>
    <div class="layout__content">
      <router-view />
    </div>
    <div class="layout__footer">
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
import LayoutHeader from "./layout-header.vue";
</script>

<style scoped lang="scss">
.layout {
  @apply flex flex-col p-2;
  .layout__header {
    flex: 0 0 auto;
  }
  .layout__content {
    flex: 1 1 auto;
    overflow: auto;
    @apply mt-2;
  }
  .layout__footer {
    flex: 0 0 auto;
  }
}
</style>
