<template>
  <div class="layout-header">
    <!-- 最小化/[全屏,取消全屏,退出] -->
    <div class="header__btns">
      <Close class="mr-2" @click="closeApp" />
      <MiniDesk class="mr-2" @click="miniApp" />

      <!--  所有版本-->
      <BaseIcon size="90px" class="mr-2" @click="getAllVersion"
        >所有版本</BaseIcon
      >
      <BaseIcon size="60px" class="mr-2" @click="getAllProgram">项目</BaseIcon>
      <BaseIcon size="60px" class="mr-2" @click="getAllGroup">分组</BaseIcon>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from "@r/components/Icons/Base";
import Close from "../components/Icons/Close";
import MiniDesk from "../components/Icons/MiniDesk";
import { ElMessage, ElMessageBox } from "element-plus";

function closeApp() {
  ElMessageBox.confirm("确定要退出吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    window.system.close();
  });
}

function miniApp() {
  window.system.minimize();
}

function getAllVersion() {}

function getAllProgram() {}

function getAllGroup() {}
</script>

<style scoped lang="scss">
.layout-header {
  .header__btns {
    @apply flex;
  }
}
</style>
