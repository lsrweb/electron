<template>
  <div class="setting-java__wrapper">
    <el-card class="box-card">
      <el-row>
        <el-col :span="24" class="overflow-auto">
          <div class="mb-3 flex items-center justify-between">
            <h3>Java版本列表</h3>
            <Button @click="setUploadJavaShow">上传新版本</Button>
          </div>
          <data-table
            :data="javaList"
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
                    <el-dropdown-item @click="setActiveJava(row)">
                      {{ row.active ? "已激活" : "激活" }}
                    </el-dropdown-item>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
            </template>
          </data-table>
        </el-col>
      </el-row>
    </el-card>

    <SettingJava_upload ref="javaUpload" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import dataTable from "@r/components/ui/data-table";
import IpcMainMess from "@r/utils/ipc";
import Button from "@r/components/Button.vue";
import SettingJava_upload from "./setting-java_upload.vue";
import { ElLoading, ElNotification } from "element-plus";

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

  console.log(javaList.value);
});

const javaUpload = ref(null);

function setUploadJavaShow() {
  javaUpload.value.showCreate = true;
}

async function setActiveJava(row: any) {
  const { originalPath, version } = row;
  ElLoading.service({ fullscreen: true, text: "正在激活环境变量..." });
  if (!originalPath) return;
  await IpcMainMess.sendSync("cache.setActiveJava", { originalPath });
  ElLoading.service().close();
  ElNotification({
    title: "激活成功",
    dangerouslyUseHTMLString: true,
    message: `已激活 <span class="text-blue-500">${version}</span>,建议重启应用或电脑应用生效`,
    type: "success",
    position: "bottom-left",
  });
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
