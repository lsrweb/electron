<template>
  <div class="layout">
    <div class="layout__header">
      <layout-header />
      <BlowUp></BlowUp>
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
import BlowUp from "../components/Icons/BlowUp";
import LayoutHeader from "./layout-header.vue";
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .layout__header {
    flex: 0 0 auto;
  }
  .layout__content {
    flex: 1 1 auto;
    overflow: auto;
  }
  .layout__footer {
    flex: 0 0 auto;
  }
}
</style>
