<template>
  <Dialog v-model="showCreate" :title="'上传新版本抓哇'">
    <div class="drop-area" @dragover.prevent @drop="handleDrop" @click="selecFile">拖拽文件到此处</div>
  </Dialog>
</template>

<script setup lang="ts">
import IpcMainMess from "@r/utils/ipc";
import path from "node:path";
import { resolve } from "path";

const showCreate = ref(false);

defineExpose({
  showCreate,
});

function handleDrop(event: DragEvent) {
  event.preventDefault();
  // 获取arrayBUFFER
  const file = event.dataTransfer?.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result;
      console.log(buffer);

      IpcMainMess.sendSync("system.startDrag");
    };
    reader.readAsArrayBuffer(file);
  }
}

function selecFile() {
  console.log("selecFile");
}
</script>

<style scoped lang="scss">
.drop-area {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  margin-top: 20px;
}
</style>
