<script setup lang="ts">
import Button from "@r/components/Button.vue";
import dataTable from "@r/components/ui/data-table";
import IpcMainMess from "@r/utils/ipc";

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
    props: {
      //
      showOverflowTooltip: true,
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
    <data-table :data="versionArray" :columns="columns" @deleteRow="handleDelete" :action-props="{ width: '300px' }">
      <template #action>
        <Button type="text">查看下属项目</Button>
      </template>
    </data-table>
  </div>
</template>

<style scoped lang="scss"></style>
