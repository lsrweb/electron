<template>
  <div class="layout-header draggable">
    <!-- 最小化/[全屏,取消全屏,退出] -->
    <div class="header__btns no-drag">
      <Close class="mr-2" @click="closeApp" />
      <MiniDesk class="mr-2" @click="miniApp" />

      <!--  所有版本-->
      <router-link to="version" class="mr-2" active-class="active-theme-color">
        <BaseIcon size="90px" bg-color="" @click="getAllVersion">
          所有版本
        </BaseIcon>
      </router-link>
      <router-link to="program" class="mr-2" active-class="active-theme-color">
        <BaseIcon size="60px" bg-color="" @click="getAllProgram">项目</BaseIcon>
      </router-link>
      <router-link to="group" class="mr-2" active-class="active-theme-color">
        <BaseIcon size="60px" bg-color="" @click="getAllGroup">分组</BaseIcon>
      </router-link>
      <router-link to="tools" class="mr-2" active-class="active-theme-color">
        <BaseIcon size="60px" bg-color="" @click="getAllGroup">工具</BaseIcon>
      </router-link>
    </div>

    <!-- setting -->
    <div class="no-drag">
      <Refresh @click="refreshNowPage" />
      <Settings @click="dialogVisible = true" />
    </div>

    <!-- 右侧设置弹窗 -->
    <Popup v-model:dialogVisible="dialogVisible" :form="form"></Popup>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import BaseIcon from "@r/components/Icons/Base";
import Close from "../components/Icons/Close";
import MiniDesk from "../components/Icons/MiniDesk";
import { ElMessageBox } from "element-plus";
import Settings from "../components/Icons/Settings";
import Popup from "./components/Popup.vue";
import Refresh from "../components/Icons/Refresh";

const refreshView = inject<() => void | undefined>("refreshView");

function closeApp() {
  ElMessageBox.confirm("确定要退出吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    window.system.quit();
  });
}

function miniApp() {
  window.system.minimize();
}

function getAllVersion() {}

function getAllProgram() {}

function getAllGroup() {}

function refreshNowPage() {
  if (refreshView) {
    refreshView();
  }
}

const dialogVisible = ref(false);

const form = reactive({
  versionPath: "",
  configPath: "",
  javaVersion: "",
  STORE_PATH: "",
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
