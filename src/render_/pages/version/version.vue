<script setup lang="ts">
import Button from "@r/components/Button.vue";
import dataTable from "@r/components/ui/data-table";
import IpcMainMess from "@r/utils/ipc";
import CreateProject from "./create-project.vue";
import { parseKeystoreInfo } from "@r/pages/tools/utils/index";

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
    key: "originalPath",
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
  {
    label: "子项目",
    key: "action",
    props: {
      width: "200px",
    },
  },
]);

const versionArray = ref([]);
onMounted(async () => {
  const getResult = await IpcMainMess.sendSync("cache.readVersionFolderData");
  console.log(getResult);

  versionArray.value = getResult.map((item: object) => {
    return item && typeof item === "object" ? { ...item } : {};
  });
});

//
function handleDelete(row: any) {
  console.log(row);
}

function clickRow({ originalPath }: any) {
  IpcMainMess.sendSync("cache.openExplorer", { originalPath });
}

// 创建项目
const showCreateProject = ref(false);
const rowInfo = ref<{ version?: string; originalPath?: string }>({
  version: "",
  originalPath: "",
});
</script>

<template>
  <div>
    <data-table
      :data="versionArray"
      :columns="columns"
      @deleteRow="handleDelete"
      :action-props="{ width: '300px' }"
      @clickRow="clickRow"
    >
      <template #action="{ row }">
        <Button type="text" class="text-ellipsis" @click="(showCreateProject = true), (rowInfo = row)">添加项目</Button>
      </template>
    </data-table>

    <CreateProject v-model:visible="showCreateProject" :version="rowInfo.version" :CATCH="rowInfo.originalPath" />
  </div>
</template>

<style scoped lang="scss"></style>
