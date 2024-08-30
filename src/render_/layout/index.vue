<template>
  <div class="layout">
    <div class="layout__header">
      <layout-header />
    </div>
    <div class="layout__content">
      <router-view :key="viewKey" v-slot="{ Component }">
        <transition name="slide-fade" mode="out-in">
          <component :is="Component" class="view-parent-com h-full" />
        </transition>
      </router-view>
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
    overflow: hidden;
    @apply p-2;
  }
  .layout__footer {
    flex: 0 0 auto;
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
