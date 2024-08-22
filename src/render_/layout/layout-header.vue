<template>
  <div class="layout-header">
    <!-- 最小化/[全屏,取消全屏,退出] -->
    <div class="header__btns">
      <Close class="mr-2" @click="closeApp" />
      <MiniDesk class="mr-2" @click="miniApp" />

      <!--  所有版本-->
      <router-link to="version" class="mr-2" active-class="active-theme-color">
        <BaseIcon size="90px" bg-color="" @click="getAllVersion">
          所有版本
        </BaseIcon>
      </router-link>
      <router-link to="program" class="mr-2">
        <BaseIcon size="60px" @click="getAllProgram">项目</BaseIcon>
      </router-link>
      <router-link to="group" class="mr-2">
        <BaseIcon size="60px" @click="getAllGroup">分组</BaseIcon>
      </router-link>
    </div>

    <!-- setting -->
    <div>
      <Settings @click="dialogVisible = true" />
    </div>

    <!-- 右侧设置弹窗 -->
    <Popup v-model:dialogVisible="dialogVisible" :form="form"></Popup>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from "@r/components/Icons/Base";
import Close from "../components/Icons/Close";
import MiniDesk from "../components/Icons/MiniDesk";
import { ElMessage, ElMessageBox } from "element-plus";
import Settings from "../components/Icons/Settings";
import Popup from "./components/Popup.vue";

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

//
const dialogVisible = ref(false);

//
const form = reactive({
  versionPath: "",
  configPath: "",
  javaVersion: "",
});
</script>

<style scoped lang="scss">
.layout-header {
  @apply flex items-center justify-between p-2;
  .header__btns {
    @apply flex w-max;
  }
}

.active-theme-color {
  background-color: #42b983;
  color: #fff;
}
</style>
