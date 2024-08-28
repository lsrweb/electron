<script setup lang="ts">
import dataTable from "@r/components/ui/data-table";
import IpcMainMess from "@r/utils/ipc";

const columns = ref([
  {
    label: "版本名称",
    key: "name",
    props: {
      showOverflowTooltip: true,
    },
  },
  {
    label: "路径",
    key: "cwd",
    props: {
      //
      showOverflowTooltip: true,
      width: "300px",
    },
  },
]);

const versionArray = ref([]);
onMounted(async () => {
  const getResult = await IpcMainMess.sendSync("cache.readVersionFolderData");
  // E:\\Android_uni_app_build\\Android-SDK@4.22.82121_20240625
  // 需要将路径进行拆分
  versionArray.value = getResult.map((item: string) => {
    const arr = item.split("\\");
    return {
      name: arr[arr.length - 1],
      cwd: item,
      version: arr[arr.length - 1].split("@")[1],
    };
  });
});

//
function handleDelete(row: any) {
  console.log(row);
}
</script>

<template>
  <div>
    <data-table
      :data="versionArray"
      :columns="columns"
      @deleteRow="handleDelete"
    >
      <template #action>123</template>
    </data-table>
  </div>
</template>

<style scoped lang="scss"></style>
