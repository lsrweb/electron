<template>
  <div class="setting-java__wrapper">
    <!-- 此页面负责检测java环境变量,java环境目录 -->
    <el-card class="box-card">
      <!--  java版本列表  -->
      <el-row>
        <el-col :span="24">
          <h3 class="mb-2">Java版本列表</h3>
          <!-- <el-table :data="[]" style="width: 100%" stripe border height="400">
            <el-table-column
              prop="name"
              label="名称"
              width="180"
            ></el-table-column>
            <el-table-column prop="path" label="路径"></el-table-column>
            <el-table-column prop="version" label="版本"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template #default="{ row }">
                <el-button type="text" size="small">编辑</el-button>
                <el-button type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table> -->
          <data-table :data="javaList" :columns="columns"></data-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import dataTable from "@r/components/ui/data-table";
import IpcMainMess from "@r/utils/ipc";

const javaList = ref([]);
const columns = ref([
  {
    label: "版本名称",
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
      //
      showOverflowTooltip: true,
    },
    buttonProps: {
      variant: "link",
      class: "!text-blue-500 !w-full !text-ellipsis !overflow-hidden !whitespace-nowrap !overflow-ellipsis !block",
    },
  },
]);

function clickRow({ cwd }: any) {
  IpcMainMess.sendSync("cache.openExplorer", { cwd });
}

onMounted(() => {
  // 页面初始化的时候检测java环境变量
});
</script>

<style scoped lang="scss">
.setting-java__wrapper {
  @apply antialiased;
  h1 {
    @apply mb-2;
  }
}
</style>
