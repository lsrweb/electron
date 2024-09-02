<template>
  <div class="setting-java__wrapper">
    <el-card class="box-card">
      <el-row>
        <el-col :span="24" class="overflow-auto">
          <h3 class="float-start">Java版本列表</h3>
          <Button class="float-end">上传新版本</Button>
          <data-table :data="javaList" :columns="columns" @clickRow="clickRow" class="!mt-7"> </data-table>
        </el-col>
      </el-row>
    </el-card>
    <div class="drop-area" @dragover.prevent @drop="handleDrop">拖拽文件到此处上传</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import dataTable from "@r/components/ui/data-table";
import IpcMainMess from "@r/utils/ipc";
import Button from "@r/components/Button.vue";

const javaList = ref([]);
const columns = ref([
  {
    label: "目录名称",
    key: "originalFloder",
    props: {
      showOverflowTooltip: true,
      width: "200px",
    },
  },
  {
    label: "路径",
    key: "originalPath",
    type: "button",
    props: {
      showOverflowTooltip: true,
    },
    buttonProps: {
      variant: "link",
      class: "!text-blue-500 !w-full !text-ellipsis !overflow-hidden !whitespace-nowrap !overflow-ellipsis !block",
    },
  },
  {
    label: "状态",
    key: "status",
    props: {
      width: "140px",
    },
    type: "button",
    buttonProps: {},
  },
  {
    label: "版本",
    key: "version",
    props: {
      width: "100px",
    },
  },
]);

function clickRow({ cwd }: any) {
  IpcMainMess.sendSync("cache.openExplorer", { cwd });
}

function handleDrop(event: DragEvent) {
  // event.preventDefault();
  // const files = event.dataTransfer?.files;
  // if (files) {
  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     console.log("File dropped:", file.name);
  //     // 处理文件上传逻辑
  //   }
  // }
}

onMounted(async () => {
  const result = await IpcMainMess.sendSync("cache.readJavaVersionList");
  javaList.value = result.map((item: any) => {
    return {
      ...(typeof item === "object" ? item : {}),
      originalFloder: item.originalPath.split("\\").pop(),
      status: "",
      realVersion: "",
    };
  });
});
</script>

<style scoped lang="scss">
.setting-java__wrapper {
  @apply antialiased;
  h1 {
    @apply mb-2;
  }
}
.drop-area {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  margin-top: 20px;
}
</style>
