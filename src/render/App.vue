<template>
  <RouterView />
  <button @click="updateDb">更新数据</button>
</template>

<script setup lang="ts">
import ipc from "./ipc/ipc";

function updateDb() {
  ipc.sendSync("system.updateConfig", { key: "test", value: "test" });
}
</script>

<style lang="scss" scoped></style>
