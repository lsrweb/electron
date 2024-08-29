<template>
  <div class="layout">
    <div class="layout__header">
      <layout-header />
    </div>
    <div class="layout__content">
      <router-view :key="viewKey" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from "vue";
import LayoutHeader from "./layout-header.vue";

const route = useRoute();
const viewKey = ref(route.fullPath);

function refreshView() {
  viewKey.value = route.fullPath + "?" + Date.now();
}

provide("refreshView", refreshView);
</script>

<style scoped lang="scss">
.layout {
  @apply flex flex-col;
  .layout__header {
    flex: 0 0 auto;
  }
  .layout__content {
    flex: 1 1 auto;
    overflow: auto;
    @apply p-2;
  }
  .layout__footer {
    flex: 0 0 auto;
  }
}
</style>
