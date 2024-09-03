<template>
  <div class="setting-java__wrapper">
    <el-card class="box-card">
      <el-row>
        <el-col :span="24" class="overflow-auto">
          <div class="mb-3 flex items-center justify-between">
            <h3>密钥库生成</h3>
            <div>
              <!--  -->
            </div>
          </div>
          <data-table
            :data="storeList"
            :columns="columns"
            @clickRow="clickRow"
            :actionProps="{
              class: 'text-center',
              width: '100px',
            }"
          >
            <template #action="{ row }">
              <ElDropdown placement="left-start" class="loading-menu">
                <Button icon="cog"></Button>
                <template #dropdown>
                  <ElDropdownMenu>
                    <!-- 删除 -->
                    <ElDropdownItem @click="deleteKey(row.name)">删除秘钥</ElDropdownItem>
                    <!-- 查看秘钥信息 -->
                    <ElDropdownItem @click="previewKey(row.name)">查看秘钥</ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
            </template>
          </data-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import dataTable from "@r/components/ui/data-table";
import IpcMainMess from "@r/utils/ipc";
import Button from "@r/components/Button.vue";

const storeList = ref([]);
const columns = ref([
  {
    label: "秘钥名称",
    key: "name",
    props: {
      showOverflowTooltip: true,
    },
  },
]);

function clickRow({ originalPath }: any) {
  IpcMainMess.sendSync("cache.openExplorer", { cwd: originalPath });
}

onMounted(async () => {
  let result = await IpcMainMess.sendSync("cache.readKeyStoreList");
  // name
  storeList.value = result.map((item: any) => {
    return {
      name: item,
    };
  });
});

function deleteKey(name: string) {
  IpcMainMess.sendSync("cache.deleteKeyStore", { keystore: name });
  storeList.value = storeList.value.filter((item: any) => item.name !== name);
}

function previewKey(name: string) {
  IpcMainMess.sendSync("cache.previewKeyStore", { name });
}
</script>

<style scoped lang="scss">
.setting-java__wrapper {
  @apply antialiased;
  h1 {
    @apply mb-2;
  }
}
</style>
