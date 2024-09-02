<template>
  <div class="setting-java__wrapper">
    <!-- 此页面负责检测java环境变量,java环境目录 -->
    <el-card class="box-card">
      <!--  java版本列表  -->
      <el-row>
        <el-col :span="24">
          <h3 class="mb-2">Java版本列表</h3>
          <data-table :data="javaList" :columns="columns" @clickRow="clickRow"> </data-table>
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

const javaList = ref([]);
const columns = ref([
  {
    label: "目录名称",
    key: "version",
    props: {
      showOverflowTooltip: true,
      width: "200px",
    },
  },
  {
    label: "路径",
    key: "cwd",
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
    key: "realVersion",
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
  // "G:\\uniHelperBuiler\\JAVA_VERSION\\java22.0.2"
  javaList.value = result.map((item: string) => {
    const version = item.split("\\").pop();
    return {
      version,
      cwd: item,
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
