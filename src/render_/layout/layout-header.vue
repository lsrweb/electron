<template>
  <div class="layout-header">
    <!-- 最小化/[全屏,取消全屏,退出] -->
    <div class="header__btns">
      <Close class="mr-2" @click="closeApp" />
      <!-- <MiniDesk /> -->
    </div>

    <h1 class="app-name">UniBuildHelper</h1>
  </div>
</template>

<script setup lang="ts">
import Close from "../components/Icons/Close";
import MiniDesk from "../components/Icons/MiniDesk";

function closeApp() {
  console.log("1");
}
</script>

<style scoped lang="scss">
.layout-header {
  .header__btns {
    @apply flex;
  }
}
</style>
