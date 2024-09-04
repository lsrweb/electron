<template>
  <div class="setting-java__wrapper">
    <el-card class="box-card">
      <el-row>
        <ElCol class="overflow-auto">
          <div class="mb-3 flex items-center justify-between">
            <h3>密钥库生成</h3>
            <div>
              <Button type="primary" @click="showCreate">生成密钥库</Button>
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
              <ElDropdown placement="left-start" class="loading-menu" :disabled="row.disabled">
                <Button icon="cog" :disabled="row.disabled"></Button>
                <template #dropdown>
                  <ElDropdownMenu>
                    <!-- 删除 -->
                    <ElDropdownItem @click="deleteKey(row.name)">删除秘钥</ElDropdownItem>
                    <!-- 查看秘钥信息 -->
                    <ElDropdownItem @click="previewKey(row.name)">查看秘钥</ElDropdownItem>
                    <!-- 读取密钥库信息 -->
                    <ElDropdownItem @click="readKeyStoreFile(row.name, row)">读取密钥库信息</ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
            </template>
          </data-table>
        </ElCol>
      </el-row>
    </el-card>

    <SecretKeyCreate v-model:visible="SecretKeyCreateRefShow" @updateList="updateList" />
    <Dialog v-model="showKeyDetail" size="800px" title="密钥库信息">
      <!-- JAVA -->
      <div class="flex items-center">
        <span class="mr-2">JAVA:</span>
        <pre class="whitespace pre-wrap break-words">{{ keyDetailObj["java"] }}</pre>
      </div>

      <!-- MD5 -->
      <div class="flex items-center">
        <span class="mr-2">MD5:</span>
        <pre class="whitespace-pre-wrap break-words">{{ keyDetailObj["topLevelInfo"][0].MD5 || "未查询到MD5" }}</pre>
      </div>
      <!-- SHA1 -->
      <div class="flex items-center">
        <span class="mr-2">SHA1:</span>
        <pre class="whitespace-pre-wrap break-words">{{ keyDetailObj["topLevelInfo"][0].SHA1 }}</pre>
      </div>
      <!-- SHA256 -->
      <div class="flex items-center">
        <span class="mr-2">SHA256:</span>
        <pre class="whitespace-pre-wrap break-words">{{ keyDetailObj["topLevelInfo"][0].SHA256 }}</pre>
      </div>
      <!-- 字符串里带有 \r\n ,原样渲染 -->
      <pre class="whitespace-pre-wrap break-words">{{ keyDetail }}</pre>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import dataTable from "@r/components/ui/data-table";
import IpcMainMess from "@r/utils/ipc";
import Button from "@r/components/Button.vue";
import SecretKeyCreate from "./secret-key-create.vue";
import { parseKeystoreInfo } from "../utils";
import Dialog from "@r/components/ui/Dialog.vue";
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

async function init() {
  let result = await IpcMainMess.sendSync("cache.readKeyStoreList");
  // name
  storeList.value = result.map((item: any) => {
    return {
      name: item,
    };
  });
}

onMounted(async () => {
  init();
});

function deleteKey(name: string) {
  IpcMainMess.sendSync("cache.deleteKeyStore", { keystore: name });
  storeList.value = storeList.value.filter((item: any) => item.name !== name);
}

async function previewKey(name: string) {
  try {
    const { keypass, storepass } = await IpcMainMess.sendSync("cache.readKeyStoreInfo", { keystore: name });
    ElMessageBox.alert(`秘钥名称：${name}\n秘钥密码：${keypass}\n秘钥库密码：${storepass}`, "秘钥信息", {
      customClass: "canSelect",
    });
  } catch (error) {
    console.log(error);
  }
}
const showKeyDetail = ref(false);
const keyDetail = ref("");
let keyDetailObj: { java: string; topLevelInfo: { MD5: string; SHA1: string; SHA256: string }[] } = {
  topLevelInfo: [{ MD5: "", SHA1: "", SHA256: "" }],
  java: "",
};
async function readKeyStoreFile(name: string, row: any) {
  try {
    row.disabled = true;
    const { storepass, keypass, cwdPath, java } = await IpcMainMess.sendSync("cache.readKeyStoreInfo", {
      keystore: name,
    });
    let result = await IpcMainMess.sendSync("cache.readKeyStoreFile", {
      keystore: name,
      storepass,
      keypass,
      cwdPath,
      java,
    });
    keyDetail.value = `${result}`;
    console.log(keyDetail.value);

    showKeyDetail.value = true;
    keyDetailObj = Object.assign(
      {
        java,
      },
      parseKeystoreInfo(result) as { topLevelInfo: { MD5: string; SHA1: string; SHA256: string }[] }
    );

    row.disabled = false;
  } catch (error) {
    console.log(error);
    row.disabled = false;
  }
}

//
const SecretKeyCreateRefShow = ref();
function showCreate() {
  SecretKeyCreateRefShow.value = !SecretKeyCreateRefShow.value;
}

//
function updateList() {
  init();
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
